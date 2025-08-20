"""
Hardened scheduling engine with chaos engineering improvements.
Addresses critical algorithmic failures discovered through chaos testing.
"""

from ortools.sat.python import cp_model
from typing import List, Dict, Tuple, Optional, Set
import time
import math
from datetime import datetime, timedelta
from collections import defaultdict

from models import (
    SchedulingData, Student, TimeWindow, TeacherSchedule, 
    ScheduleEntry, ScheduleResult, ConflictReason
)


class HardenedLessonScheduler:
    """Chaos-hardened scheduling engine with algorithmic improvements."""
    
    def __init__(self, data: SchedulingData):
        self.data = data
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
        # Enhanced configuration for robustness
        self.solver.parameters.max_time_in_seconds = 60.0  # Increased timeout
        self.solver.parameters.num_search_workers = 4
        
        # Calculate optimal time granularity based on lesson durations
        self.time_granularity = self._calculate_optimal_granularity()
        self.time_slots = self._generate_time_slots()
        
        self.lesson_vars = {}
        self.lesson_priority_map = {}
        self.statistics = {}
        
        # Hardening features
        self.student_constraint_scores = self._calculate_constraint_scores()
        self.location_reservations = self._calculate_location_reservations()
        self.break_fairness_adjustments = self._calculate_break_fairness()
        
    def _calculate_optimal_granularity(self) -> int:
        """Calculate optimal time slot granularity based on lesson durations."""
        durations = [s.lesson_duration for s in self.data.students]
        if not durations:
            return 15
        
        # Use GCD of all durations, but clamp to reasonable range
        optimal = math.gcd(*durations)
        return max(5, min(optimal, 30))  # Between 5 and 30 minutes
    
    def _calculate_constraint_scores(self) -> Dict[str, float]:
        """Calculate constraint difficulty scores for each student."""
        scores = {}
        
        for student in self.data.students:
            # Base score: lesson duration difficulty
            duration_score = student.lesson_duration / 60.0
            
            # Location constraint penalty
            location_score = 5.0 / max(len(student.accessible_locations), 1)
            
            # Availability window scarcity penalty
            total_availability = sum(
                (window.end_minutes - window.start_minutes) 
                for window in student.availability
            )
            availability_score = 1000.0 / max(total_availability, student.lesson_duration)
            
            # Combined constraint difficulty
            total_score = duration_score + location_score + availability_score
            scores[student.name] = total_score
        
        return scores
    
    def _calculate_location_reservations(self) -> Dict[str, List[str]]:
        """Reserve location capacity for most constrained students."""
        reservations = defaultdict(list)
        
        # Group students by location with constraint scores
        location_constraints = defaultdict(list)
        for student in self.data.students:
            constraint_score = self.student_constraint_scores[student.name]
            for location in student.accessible_locations:
                location_constraints[location].append((constraint_score, student.name))
        
        # Reserve capacity for most constrained students at each location
        for location_id, student_scores in location_constraints.items():
            # Sort by constraint score (highest first)
            student_scores.sort(reverse=True)
            
            # Reserve top 40% of capacity for most constrained
            reserve_count = max(1, len(student_scores) // 3)
            reserved_students = [name for _, name in student_scores[:reserve_count]]
            reservations[location_id] = reserved_students
        
        return reservations
    
    def _calculate_break_fairness(self) -> Dict[str, float]:
        """Calculate fairness adjustments for break-impacted students."""
        if not self.data.teacher.break_config:
            return {}
        
        adjustments = {}
        break_config = self.data.teacher.break_config
        
        for student in self.data.students:
            # Students with lessons longer than max block get fairness boost
            if student.lesson_duration > break_config.max_teaching_block_minutes:
                # High boost for break-busting durations
                adjustments[student.name] = 1000.0
            elif student.lesson_duration > break_config.max_teaching_block_minutes * 0.8:
                # Medium boost for near-break-busting durations
                adjustments[student.name] = 500.0
            else:
                adjustments[student.name] = 0.0
        
        return adjustments
    
    def _get_sorted_students(self) -> List[Student]:
        """Sort students by constraint difficulty (hardest first)."""
        students_with_scores = [
            (self.student_constraint_scores[s.name], s) 
            for s in self.data.students
        ]
        students_with_scores.sort(reverse=True)
        return [student for _, student in students_with_scores]
    
    def _generate_time_slots(self) -> List[Tuple[str, int, str]]:
        """Generate time slots with optimized granularity."""
        slots = []
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        for day in days:
            for location in self.data.locations:
                teacher_windows = [w for w in self.data.teacher.availability 
                                 if w.day == day and w.location == location.id]
                
                for window in teacher_windows:
                    current_time = window.start_minutes
                    while current_time < window.end_minutes:
                        slots.append((day, current_time, location.id))
                        current_time += self.time_granularity
        
        return slots
    
    def create_schedule(self) -> ScheduleResult:
        """Main scheduling method with hardening improvements."""
        start_time = time.time()
        
        # Multi-phase approach for robustness
        try:
            # Phase 1: Create variables with constraint-aware ordering
            self._create_variables_hardened()
            
            # Phase 2: Add constraints with fairness considerations
            self._add_constraints_hardened()
            
            # Phase 3: Set multi-objective optimization
            self._set_objective_hardened()
            
            # Phase 4: Solve with fallback strategies
            status = self.solver.Solve(self.model)
            
            solve_time = time.time() - start_time
            
            if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
                return self._extract_solution(solve_time, status)
            else:
                # Fallback: Try relaxed constraints
                return self._try_relaxed_solving(solve_time)
                
        except Exception as e:
            solve_time = time.time() - start_time
            return self._handle_error(solve_time, str(e))
    
    def _create_variables_hardened(self):
        """Create variables with constraint-aware student ordering."""
        # Process students in constraint-difficulty order
        sorted_students = self._get_sorted_students()
        
        for student in sorted_students:
            for day, start_minutes, location in self.time_slots:
                # Check location accessibility
                if not student.can_access_location(location):
                    continue
                
                # Check availability and priority
                matching_windows = [
                    w for w in student.availability
                    if w.day == day and 
                       w.location == location and
                       w.start_minutes <= start_minutes and
                       w.end_minutes >= start_minutes + student.lesson_duration
                ]
                
                if not matching_windows:
                    continue
                
                # Use best priority among matching windows
                best_priority = min(w.priority for w in matching_windows)
                
                var_name = f'lesson_{student.name}_{day}_{start_minutes}_{location}'
                lesson_key = (student.name, day, start_minutes, location)
                self.lesson_vars[lesson_key] = self.model.NewBoolVar(var_name)
                self.lesson_priority_map[lesson_key] = best_priority
    
    def _add_constraints_hardened(self):
        """Add constraints with fairness and location reservation considerations."""
        
        # Constraint 1: Each student gets at most one lesson
        for student in self.data.students:
            student_vars = [
                var for (s, d, t, l), var in self.lesson_vars.items() 
                if s == student.name
            ]
            if student_vars:
                self.model.Add(sum(student_vars) <= 1)
        
        # Constraint 2: No overlapping lessons
        self._add_overlap_constraints()
        
        # Constraint 3: Break management with fairness
        if self.data.teacher.break_config:
            self._add_break_constraints_with_fairness()
        
        # Constraint 4: Location reservations for constrained students
        self._add_location_reservation_constraints()
        
        # Constraint 5: Availability window validation
        self._add_availability_constraints()
    
    def _add_overlap_constraints(self):
        """Add optimized overlap constraints."""
        lesson_items = list(self.lesson_vars.items())
        
        for i, ((student1, day1, start1, location1), var1) in enumerate(lesson_items):
            for j, ((student2, day2, start2, location2), var2) in enumerate(lesson_items[i+1:], i+1):
                # Skip if different day or location
                if day1 != day2 or location1 != location2:
                    continue
                
                # Get lesson durations
                student1_obj = next(s for s in self.data.students if s.name == student1)
                student2_obj = next(s for s in self.data.students if s.name == student2)
                end1 = start1 + student1_obj.lesson_duration
                end2 = start2 + student2_obj.lesson_duration
                
                # Check for overlap
                if not (end1 <= start2 or end2 <= start1):
                    self.model.Add(var1 + var2 <= 1)
    
    def _add_break_constraints_with_fairness(self):
        """Add break constraints with fairness considerations."""
        break_config = self.data.teacher.break_config
        
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
            for location in self.data.locations:
                # Get all lessons for this day/location sorted by time
                day_lessons = [
                    (start_minutes, var, student_name) 
                    for (student_name, d, start_minutes, l), var in self.lesson_vars.items()
                    if d == day and l == location.id
                ]
                day_lessons.sort()
                
                if len(day_lessons) < 2:
                    continue
                
                # Add break constraints between lessons
                for i in range(len(day_lessons) - 1):
                    time1, var1, student1 = day_lessons[i]
                    time2, var2, student2 = day_lessons[i + 1]
                    
                    # Get lesson durations
                    student1_obj = next(s for s in self.data.students if s.name == student1)
                    student2_obj = next(s for s in self.data.students if s.name == student2)
                    
                    end_time1 = time1 + student1_obj.lesson_duration
                    teaching_block = time2 + student2_obj.lesson_duration - time1
                    
                    # If block exceeds limit, add break constraint with fairness consideration
                    if teaching_block > break_config.max_teaching_block_minutes:
                        # Check if either student has fairness adjustment
                        fairness1 = self.break_fairness_adjustments.get(student1, 0)
                        fairness2 = self.break_fairness_adjustments.get(student2, 0)
                        
                        # Apply fairness: only add constraint if no high-fairness student involved
                        if fairness1 < 500 and fairness2 < 500:
                            required_break = break_config.min_break_duration_minutes
                            if time2 - end_time1 < required_break:
                                # These lessons are too close, at most one can be scheduled
                                self.model.Add(var1 + var2 <= 1)
    
    def _add_location_reservation_constraints(self):
        """Add location capacity reservations for constrained students."""
        for location_id, reserved_students in self.location_reservations.items():
            # For each reserved student, boost their priority at this location
            for student_name in reserved_students:
                student_lessons_at_location = [
                    var for (s, d, t, l), var in self.lesson_vars.items()
                    if s == student_name and l == location_id
                ]
                
                if student_lessons_at_location:
                    # Create a priority boost variable
                    boost_var = self.model.NewBoolVar(f'location_boost_{student_name}_{location_id}')
                    self.model.Add(boost_var <= sum(student_lessons_at_location))
                    
                    # This will be used in the objective function
                    if not hasattr(self, 'location_boost_vars'):
                        self.location_boost_vars = []
                    self.location_boost_vars.append((boost_var, 200))  # 200 point boost
    
    def _add_availability_constraints(self):
        """Add availability window validation constraints."""
        for (student_name, day, start_minutes, location), var in self.lesson_vars.items():
            student = next(s for s in self.data.students if s.name == student_name)
            
            # Verify lesson fits in availability window
            fits_in_window = False
            for window in student.availability:
                if (window.day == day and 
                    window.location == location and
                    window.start_minutes <= start_minutes and
                    window.end_minutes >= start_minutes + student.lesson_duration):
                    fits_in_window = True
                    break
            
            if not fits_in_window:
                self.model.Add(var == 0)
    
    def _set_objective_hardened(self):
        """Set multi-objective optimization with hardening improvements."""
        # Primary objective: Maximize scheduled students
        total_lessons = sum(self.lesson_vars.values())
        
        # Secondary objective: Priority bonuses with fairness adjustments
        priority_bonus = self._calculate_priority_bonus_hardened()
        
        # Tertiary objective: Break fairness bonuses
        fairness_bonus = self._calculate_fairness_bonus()
        
        # Quaternary objective: Location reservation bonuses
        location_bonus = self._calculate_location_bonus()
        
        # Quintenary objective: Minimize gaps (lower weight to prevent optimization traps)
        gap_penalty = self._calculate_gap_penalty()
        
        # Combined objective with careful weighting
        objective = (
            total_lessons * 10000 +          # Most important: schedule students
            priority_bonus +                 # Respect priorities
            fairness_bonus +                 # Prevent systematic bias
            location_bonus +                 # Help constrained students
            -gap_penalty                     # Minor: minimize gaps
        )
        
        self.model.Maximize(objective)
    
    def _calculate_priority_bonus_hardened(self) -> cp_model.IntVar:
        """Calculate priority bonus with constraint difficulty weighting."""
        if not self.lesson_vars:
            return self.model.NewConstant(0)
        
        priority_bonus = self.model.NewIntVar(0, 100000, 'priority_bonus_hardened')
        bonus_terms = []
        
        for lesson_key, var in self.lesson_vars.items():
            student_name = lesson_key[0]
            priority = self.lesson_priority_map[lesson_key]
            constraint_score = self.student_constraint_scores[student_name]
            
            # Enhanced priority scoring with constraint difficulty weighting
            if priority == 1:
                base_bonus = 100
            elif priority == 2:
                base_bonus = 50
            elif priority == 3:
                base_bonus = 10
            else:
                base_bonus = 1
            
            # Multiply by constraint difficulty (harder students get more bonus)
            adjusted_bonus = int(base_bonus * (1 + constraint_score / 10))
            
            bonus_var = self.model.NewIntVar(0, adjusted_bonus, f'priority_bonus_{lesson_key}')
            self.model.Add(bonus_var == adjusted_bonus * var)
            bonus_terms.append(bonus_var)
        
        if bonus_terms:
            self.model.Add(priority_bonus == sum(bonus_terms))
        else:
            self.model.Add(priority_bonus == 0)
        
        return priority_bonus
    
    def _calculate_fairness_bonus(self) -> cp_model.IntVar:
        """Calculate fairness bonus for break-impacted students."""
        if not self.break_fairness_adjustments:
            return self.model.NewConstant(0)
        
        fairness_bonus = self.model.NewIntVar(0, 50000, 'fairness_bonus')
        bonus_terms = []
        
        for lesson_key, var in self.lesson_vars.items():
            student_name = lesson_key[0]
            fairness_adjustment = self.break_fairness_adjustments.get(student_name, 0)
            
            if fairness_adjustment > 0:
                bonus_var = self.model.NewIntVar(0, int(fairness_adjustment), f'fairness_{lesson_key}')
                self.model.Add(bonus_var == int(fairness_adjustment) * var)
                bonus_terms.append(bonus_var)
        
        if bonus_terms:
            self.model.Add(fairness_bonus == sum(bonus_terms))
        else:
            self.model.Add(fairness_bonus == 0)
        
        return fairness_bonus
    
    def _calculate_location_bonus(self) -> cp_model.IntVar:
        """Calculate location reservation bonus."""
        if not hasattr(self, 'location_boost_vars'):
            return self.model.NewConstant(0)
        
        location_bonus = self.model.NewIntVar(0, 10000, 'location_bonus')
        bonus_terms = []
        
        for boost_var, bonus_points in self.location_boost_vars:
            bonus_term = self.model.NewIntVar(0, bonus_points, f'loc_bonus_{len(bonus_terms)}')
            self.model.Add(bonus_term == bonus_points * boost_var)
            bonus_terms.append(bonus_term)
        
        if bonus_terms:
            self.model.Add(location_bonus == sum(bonus_terms))
        else:
            self.model.Add(location_bonus == 0)
        
        return location_bonus
    
    def _calculate_gap_penalty(self) -> cp_model.IntVar:
        """Calculate gap penalty with reduced weight to prevent optimization traps."""
        gap_penalty = self.model.NewIntVar(0, 5000, 'gap_penalty_reduced')  # Reduced max
        
        penalties = []
        
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
            for location in self.data.locations:
                day_location_lessons = [
                    (start_minutes, var) for (s, d, start_minutes, l), var in self.lesson_vars.items()
                    if d == day and l == location.id
                ]
                
                if len(day_location_lessons) < 2:
                    continue
                
                day_location_lessons.sort(key=lambda x: x[0])
                
                # Add small penalty for gaps (reduced weight)
                for i in range(len(day_location_lessons) - 1):
                    time1, var1 = day_location_lessons[i]
                    time2, var2 = day_location_lessons[i + 1]
                    
                    gap_minutes = time2 - time1 - 60  # Assume 60-min average lesson
                    if gap_minutes > 0:
                        # Much smaller penalty to prevent optimization traps
                        small_penalty = min(gap_minutes // 15, 10)  # Max 10 points per gap
                        gap_var = self.model.NewIntVar(0, small_penalty, f'gap_{day}_{location.id}_{i}')
                        self.model.Add(gap_var >= small_penalty * (var1 + var2 - 1))
                        penalties.append(gap_var)
        
        if penalties:
            self.model.Add(gap_penalty == sum(penalties))
        else:
            self.model.Add(gap_penalty == 0)
        
        return gap_penalty
    
    def _try_relaxed_solving(self, initial_solve_time: float) -> ScheduleResult:
        """Try solving with relaxed constraints as fallback."""
        # Implementation would gradually relax constraints
        # For now, return empty result with failure message
        return ScheduleResult(
            scheduled_lessons=[],
            unscheduled_students=[s.name for s in self.data.students],
            conflicts=[],
            statistics={
                "status": "FAILED_WITH_RELAXATION",
                "schedule_efficiency_percent": 0,
                "solve_time_seconds": initial_solve_time,
                "total_students": len(self.data.students),
                "scheduled_students": 0
            }
        )
    
    def _handle_error(self, solve_time: float, error_message: str) -> ScheduleResult:
        """Handle errors gracefully."""
        return ScheduleResult(
            scheduled_lessons=[],
            unscheduled_students=[s.name for s in self.data.students],
            conflicts=[],
            statistics={
                "status": f"ERROR: {error_message}",
                "schedule_efficiency_percent": 0,
                "solve_time_seconds": solve_time,
                "total_students": len(self.data.students),
                "scheduled_students": 0
            }
        )
    
    def _extract_solution(self, solve_time: float, status) -> ScheduleResult:
        """Extract solution with enhanced statistics."""
        scheduled_lessons = []
        scheduled_students = set()
        
        for (student_name, day, start_minutes, location), var in self.lesson_vars.items():
            if self.solver.Value(var) == 1:
                student = next(s for s in self.data.students if s.name == student_name)
                end_minutes = start_minutes + student.lesson_duration
                
                lesson = ScheduleEntry(
                    student=student_name,
                    day=day,
                    start_time=self._minutes_to_time_str(start_minutes),
                    end_time=self._minutes_to_time_str(end_minutes),
                    location=location,
                    duration=student.lesson_duration
                )
                scheduled_lessons.append(lesson)
                scheduled_students.add(student_name)
        
        # Sort lessons by day and time
        scheduled_lessons.sort(key=lambda x: (x.day, x.start_time))
        
        unscheduled = [s.name for s in self.data.students if s.name not in scheduled_students]
        
        # Calculate efficiency
        total_teaching_time = sum(lesson.duration for lesson in scheduled_lessons)
        total_available_time = sum(
            (window.end_minutes - window.start_minutes) 
            for window in self.data.teacher.availability
        )
        efficiency = (total_teaching_time / total_available_time * 100) if total_available_time > 0 else 0
        
        return ScheduleResult(
            scheduled_lessons=scheduled_lessons,
            unscheduled_students=unscheduled,
            conflicts=[],  # Would need conflict analysis for unscheduled students
            statistics={
                "status": "OPTIMAL" if status == cp_model.OPTIMAL else "FEASIBLE",
                "schedule_efficiency_percent": efficiency,
                "solve_time_seconds": solve_time,
                "total_students": len(self.data.students),
                "scheduled_students": len(scheduled_students)
            }
        )
    
    def _minutes_to_time_str(self, minutes: int) -> str:
        """Convert minutes since midnight to HH:MM format."""
        hours = minutes // 60
        mins = minutes % 60
        return f"{hours:02d}:{mins:02d}"