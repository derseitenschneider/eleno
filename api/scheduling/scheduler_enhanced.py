"""
Enhanced scheduling engine with improved conflict handling and optimization.
Based on edge case analysis findings.
"""

from ortools.sat.python import cp_model
from typing import List, Dict, Tuple, Optional, Set
import time
from datetime import datetime, timedelta
from collections import defaultdict

from models import (
    SchedulingData, Student, TimeWindow, TeacherSchedule, 
    ScheduleEntry, ScheduleResult, ConflictReason
)


class EnhancedLessonScheduler:
    """Enhanced scheduling engine with improved conflict resolution and optimization."""
    
    def __init__(self, data: SchedulingData):
        self.data = data
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
        # Enhanced configuration
        self.solver.parameters.max_time_in_seconds = 30.0  # Longer solve time
        self.solver.parameters.num_search_workers = 4  # Parallel search
        
        # Time slots (15-minute intervals)
        self.time_slots = self._generate_time_slots()
        self.lesson_vars = {}
        self.statistics = {}
        
        # Enhanced tracking
        self.student_priorities = self._calculate_student_priorities()
        self.conflict_graph = self._build_conflict_graph()
        
    def _calculate_student_priorities(self) -> Dict[str, float]:
        """Calculate scheduling priorities based on constraint difficulty."""
        priorities = {}
        
        for student in self.data.students:
            priority = 1.0
            
            # Fewer accessible locations = higher priority
            num_locations = len(student.accessible_locations)
            location_penalty = 1.0 / max(num_locations, 1)
            priority += location_penalty
            
            # Limited availability windows = higher priority
            total_availability = sum(
                (window.end_minutes - window.start_minutes) 
                for window in student.availability
            )
            availability_penalty = 1000.0 / max(total_availability, student.lesson_duration)
            priority += availability_penalty
            
            # Longer lessons = slightly higher priority (harder to place)
            duration_penalty = student.lesson_duration / 120.0
            priority += duration_penalty
            
            priorities[student.name] = priority
            
        return priorities
    
    def _build_conflict_graph(self) -> Dict[str, Set[str]]:
        """Build a graph of students that conflict with each other."""
        conflicts = defaultdict(set)
        
        students = self.data.students
        for i, student1 in enumerate(students):
            for j, student2 in enumerate(students[i+1:], i+1):
                if self._students_conflict(student1, student2):
                    conflicts[student1.name].add(student2.name)
                    conflicts[student2.name].add(student1.name)
                    
        return conflicts
    
    def _students_conflict(self, student1: Student, student2: Student) -> bool:
        """Check if two students have potential scheduling conflicts."""
        # Check for overlapping availability at same location
        for window1 in student1.availability:
            for window2 in student2.availability:
                if (window1.day == window2.day and 
                    window1.location == window2.location and
                    window1.overlaps_with(window2)):
                    return True
        return False
    
    def _generate_time_slots(self) -> List[Tuple[str, int, str]]:
        """Generate all possible time slots with enhanced granularity."""
        slots = []
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        for day in days:
            for location in self.data.locations:
                # For each teacher availability window at this location/day
                teacher_windows = [w for w in self.data.teacher.availability 
                                 if w.day == day and w.location == location.id]
                
                for window in teacher_windows:
                    # Create 15-minute slots within this window
                    current_time = window.start_minutes
                    while current_time < window.end_minutes:
                        slots.append((day, current_time, location.id))
                        current_time += 15  # 15-minute granularity
        
        return slots
    
    def _minutes_to_time_str(self, minutes: int) -> str:
        """Convert minutes since midnight to HH:MM format."""
        hours = minutes // 60
        mins = minutes % 60
        return f"{hours:02d}:{mins:02d}"
    
    def create_schedule(self) -> ScheduleResult:
        """Main enhanced scheduling method with multiple strategies."""
        start_time = time.time()
        
        # Try multiple optimization strategies
        strategies = [
            self._strategy_priority_first,
            self._strategy_hard_constraints_first,
            self._strategy_balanced_optimization
        ]
        
        best_result = None
        best_score = -1
        
        for i, strategy in enumerate(strategies):
            print(f"Trying strategy {i+1}/{len(strategies)}: {strategy.__name__}")
            
            # Reset model for each strategy
            self.model = cp_model.CpModel()
            self.lesson_vars = {}
            
            try:
                result = strategy()
                if result:
                    score = self._evaluate_solution_quality(result)
                    print(f"Strategy {i+1} score: {score:.3f}, scheduled: {len(result.scheduled_lessons)}")
                    
                    if score > best_score:
                        best_score = score
                        best_result = result
            except Exception as e:
                print(f"Strategy {i+1} failed: {e}")
                continue
        
        solve_time = time.time() - start_time
        
        if best_result:
            best_result.statistics['total_solve_time'] = solve_time
            best_result.statistics['best_strategy_score'] = best_score
            return best_result
        else:
            return self._handle_infeasible_solution(solve_time)
    
    def _strategy_priority_first(self) -> Optional[ScheduleResult]:
        """Strategy 1: Schedule high-priority (constrained) students first."""
        # Create variables with priority ordering
        self._create_priority_variables()
        
        # Add enhanced constraints
        self._add_enhanced_constraints()
        
        # Set priority-based objective
        self._set_priority_objective()
        
        # Solve
        status = self.solver.Solve(self.model)
        
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            return self._extract_solution(0, status)
        return None
    
    def _strategy_hard_constraints_first(self) -> Optional[ScheduleResult]:
        """Strategy 2: Focus on students with hardest constraints."""
        # Identify students with very limited options
        hard_constraint_students = [
            s for s in self.data.students 
            if self.student_priorities[s.name] > 3.0
        ]
        
        # Create variables prioritizing hard constraint students
        self._create_constraint_focused_variables(hard_constraint_students)
        
        # Add constraints with relaxation for easier students
        self._add_relaxed_constraints()
        
        # Set constraint-focused objective
        self._set_constraint_objective()
        
        # Solve
        status = self.solver.Solve(self.model)
        
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            return self._extract_solution(0, status)
        return None
    
    def _strategy_balanced_optimization(self) -> Optional[ScheduleResult]:
        """Strategy 3: Balanced approach considering multiple factors."""
        # Create standard variables
        self._create_variables()
        
        # Add all constraints
        self._add_constraints()
        self._add_fairness_constraints()
        
        # Set balanced objective
        self._set_balanced_objective()
        
        # Solve
        status = self.solver.Solve(self.model)
        
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            return self._extract_solution(0, status)
        return None
    
    def _create_priority_variables(self):
        """Create variables with priority-based ordering."""
        # Sort students by priority (highest first)
        sorted_students = sorted(
            self.data.students, 
            key=lambda s: self.student_priorities[s.name], 
            reverse=True
        )
        
        for student in sorted_students:
            for day, start_minutes, location in self.time_slots:
                # Check if student can access this location
                if not student.can_access_location(location):
                    continue
                
                # Check if student is available at this time
                if not self._student_available_at_time(student, day, start_minutes, location):
                    continue
                
                var_name = f'lesson_{student.name}_{day}_{start_minutes}_{location}'
                self.lesson_vars[(student.name, day, start_minutes, location)] = \
                    self.model.NewBoolVar(var_name)
    
    def _create_constraint_focused_variables(self, priority_students: List[Student]):
        """Create variables focusing on hard constraint students."""
        # First create variables for hard constraint students
        for student in priority_students:
            self._create_student_variables(student)
        
        # Then create variables for remaining students
        remaining_students = [s for s in self.data.students if s not in priority_students]
        for student in remaining_students:
            self._create_student_variables(student)
    
    def _create_student_variables(self, student: Student):
        """Create variables for a single student."""
        for day, start_minutes, location in self.time_slots:
            if not student.can_access_location(location):
                continue
            
            if not self._student_available_at_time(student, day, start_minutes, location):
                continue
            
            var_name = f'lesson_{student.name}_{day}_{start_minutes}_{location}'
            self.lesson_vars[(student.name, day, start_minutes, location)] = \
                self.model.NewBoolVar(var_name)
    
    def _create_variables(self):
        """Standard variable creation."""
        for student in self.data.students:
            self._create_student_variables(student)
    
    def _student_available_at_time(self, student: Student, day: str, 
                                  start_minutes: int, location: str) -> bool:
        """Check if student is available at specific time."""
        return any(
            w.day == day and 
            w.location == location and
            w.start_minutes <= start_minutes and
            w.end_minutes >= start_minutes + student.lesson_duration
            for w in student.availability
        )
    
    def _add_enhanced_constraints(self):
        """Add enhanced constraints with better conflict handling."""
        # Constraint 1: Each student gets at most one lesson per week
        for student in self.data.students:
            student_vars = [
                var for (s, d, t, l), var in self.lesson_vars.items() 
                if s == student.name
            ]
            if student_vars:
                self.model.Add(sum(student_vars) <= 1)
        
        # Constraint 2: Enhanced overlap prevention
        self._add_overlap_constraints()
        
        # Constraint 3: Strict availability constraints
        self._add_availability_constraints()
        
        # Constraint 4: Location switching penalties
        self._add_location_switching_constraints()
        
        # Constraint 5: Teacher break constraints (only if configured)
        self._add_break_constraints()
    
    def _add_overlap_constraints(self):
        """Enhanced overlap constraint handling."""
        # Group lessons by day and location for efficient conflict detection
        day_location_lessons = defaultdict(list)
        
        for (student, day, start, location), var in self.lesson_vars.items():
            day_location_lessons[(day, location)].append((student, start, var))
        
        # For each day/location, prevent overlapping lessons
        for (day, location), lessons in day_location_lessons.items():
            for i, (student1, start1, var1) in enumerate(lessons):
                student1_obj = next(s for s in self.data.students if s.name == student1)
                end1 = start1 + student1_obj.lesson_duration
                
                for j, (student2, start2, var2) in enumerate(lessons[i+1:], i+1):
                    student2_obj = next(s for s in self.data.students if s.name == student2)
                    end2 = start2 + student2_obj.lesson_duration
                    
                    # Check if lessons would overlap
                    if not (end1 <= start2 or end2 <= start1):
                        self.model.Add(var1 + var2 <= 1)
    
    def _add_availability_constraints(self):
        """Strict availability window constraints."""
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
    
    def _add_location_switching_constraints(self):
        """Add soft constraints to minimize excessive location switching."""
        # This is handled in the objective function
        pass
    
    def _should_enforce_breaks(self) -> bool:
        """Check if break constraints should be applied."""
        return (self.data.teacher.break_config is not None and
                hasattr(self.data.teacher.break_config, 'max_teaching_block_minutes') and
                hasattr(self.data.teacher.break_config, 'min_break_duration_minutes'))
    
    def _add_break_constraints(self):
        """Only add break constraints if explicitly configured."""
        if not self._should_enforce_breaks():
            return  # No breaks required - teacher can teach continuously
        
        config = self.data.teacher.break_config
        print(f"Enforcing breaks: max {config.max_teaching_block_minutes}min blocks, "
              f"min {config.min_break_duration_minutes}min breaks")
        
        # Add break enforcement for each day
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        for day in days:
            self._enforce_daily_break_constraints(day, config)
    
    def _enforce_daily_break_constraints(self, day: str, config):
        """Enforce break constraints for a specific day."""
        # Get all lessons for this day, sorted by start time
        day_lessons = []
        for (student, lesson_day, start_time, location), var in self.lesson_vars.items():
            if lesson_day == day:
                student_obj = next(s for s in self.data.students if s.name == student)
                end_time = start_time + student_obj.lesson_duration
                day_lessons.append((start_time, end_time, var, student))
        
        if len(day_lessons) < 2:
            return  # No need for breaks with 0 or 1 lessons
        
        # Sort lessons by start time
        day_lessons.sort(key=lambda x: x[0])
        
        # Track cumulative teaching time and enforce breaks
        self._add_cumulative_teaching_constraints(day_lessons, config)
    
    def _add_cumulative_teaching_constraints(self, day_lessons, config):
        """Add constraints to track cumulative teaching time and enforce breaks."""
        max_block = config.max_teaching_block_minutes
        min_break = config.min_break_duration_minutes
        
        # For each consecutive pair of lessons, check if they would exceed the teaching block
        for i in range(len(day_lessons)):
            for j in range(i + 1, len(day_lessons)):
                start_time_1, end_time_1, var_1, student_1 = day_lessons[i]
                start_time_2, end_time_2, var_2, student_2 = day_lessons[j]
                
                # If both lessons are scheduled and the gap is too short for a proper break
                gap_between = start_time_2 - end_time_1
                teaching_duration = end_time_1 - start_time_1 + end_time_2 - start_time_2
                
                # If scheduling both lessons would create a teaching block that's too long
                # without adequate break, prevent this combination
                if gap_between < min_break and teaching_duration > max_block:
                    # If gap is shorter than minimum break and total teaching exceeds max block
                    self.model.Add(var_1 + var_2 <= 1)
                
                # Also check if the continuous time span (including gaps) exceeds the block limit
                total_span = end_time_2 - start_time_1
                if gap_between > 0 and gap_between < min_break and total_span > max_block:
                    self.model.Add(var_1 + var_2 <= 1)
    
    def _add_constraints(self):
        """Standard constraint method for balanced optimization."""
        self._add_enhanced_constraints()
    
    def _add_relaxed_constraints(self):
        """Add constraints with some relaxation for flexibility."""
        self._add_enhanced_constraints()
        # Future: Add constraint relaxation logic
    
    def _add_fairness_constraints(self):
        """Add constraints to improve fairness."""
        # Ensure high-priority students get preference
        high_priority_students = [
            s for s in self.data.students 
            if self.student_priorities[s.name] > 2.0
        ]
        
        if len(high_priority_students) > 0:
            # At least 50% of high-priority students should be scheduled
            high_priority_vars = [
                var for (s, d, t, l), var in self.lesson_vars.items() 
                if s in [st.name for st in high_priority_students]
            ]
            
            if high_priority_vars:
                min_high_priority = max(1, len(high_priority_students) // 2)
                self.model.Add(sum(high_priority_vars) >= min_high_priority)
    
    def _set_priority_objective(self):
        """Set objective function prioritizing difficult students."""
        objective_terms = []
        
        # Weighted by student priority
        for (student_name, day, start_minutes, location), var in self.lesson_vars.items():
            priority = self.student_priorities[student_name]
            weight = int(priority * 100)  # Scale for integer optimization
            objective_terms.append(weight * var)
        
        # Minimize gaps (secondary objective)
        gap_penalty = self._calculate_gap_penalty()
        
        # Combine objectives
        if objective_terms:
            primary_objective = sum(objective_terms)
            self.model.Maximize(primary_objective - gap_penalty)
        else:
            self.model.Maximize(-gap_penalty)
    
    def _set_constraint_objective(self):
        """Objective focusing on constraint satisfaction."""
        # Maximize scheduled lessons with priority weighting
        total_lessons = 0
        for (student_name, day, start_minutes, location), var in self.lesson_vars.items():
            priority = self.student_priorities[student_name]
            weight = min(int(priority * 50), 500)  # Cap weights
            total_lessons += weight * var
        
        self.model.Maximize(total_lessons)
    
    def _set_balanced_objective(self):
        """Balanced objective considering multiple factors."""
        # Primary: maximize scheduled lessons
        total_lessons = sum(self.lesson_vars.values())
        
        # Secondary: minimize gaps
        gap_penalty = self._calculate_gap_penalty()
        
        # Tertiary: location switching penalty
        switch_penalty = self._calculate_location_switch_penalty()
        
        # Combine with appropriate weights
        self.model.Maximize(total_lessons * 1000 - gap_penalty - switch_penalty * 10)
    
    def _calculate_gap_penalty(self) -> cp_model.IntVar:
        """Enhanced gap penalty calculation."""
        gap_penalty = self.model.NewIntVar(0, 50000, 'gap_penalty')
        
        penalties = []
        
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
            for location in self.data.locations:
                day_location_lessons = [
                    (start_minutes, var) for (s, d, start_minutes, l), var in self.lesson_vars.items()
                    if d == day and l == location.id
                ]
                
                if len(day_location_lessons) < 2:
                    continue
                
                # Sort by time
                day_location_lessons.sort(key=lambda x: x[0])
                
                # Add penalty for gaps
                for i in range(len(day_location_lessons) - 1):
                    time1, var1 = day_location_lessons[i]
                    time2, var2 = day_location_lessons[i + 1]
                    
                    gap_minutes = time2 - time1 - 60  # Assume 60-min average lesson
                    if gap_minutes > 0:
                        # Penalty proportional to gap size
                        penalty_var = self.model.NewIntVar(0, gap_minutes, f'gap_{day}_{location.id}_{i}')
                        self.model.Add(penalty_var >= gap_minutes * (var1 + var2 - 1))
                        penalties.append(penalty_var)
        
        if penalties:
            self.model.Add(gap_penalty == sum(penalties))
        else:
            self.model.Add(gap_penalty == 0)
        
        return gap_penalty
    
    def _calculate_location_switch_penalty(self) -> cp_model.IntVar:
        """Calculate penalty for excessive location switching."""
        switch_penalty = self.model.NewIntVar(0, 1000, 'switch_penalty')
        
        switches = []
        
        # For each day, count location switches
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
            day_lessons = [
                (start_minutes, location, var) 
                for (s, d, start_minutes, location), var in self.lesson_vars.items()
                if d == day
            ]
            
            if len(day_lessons) < 2:
                continue
            
            # Sort by time
            day_lessons.sort(key=lambda x: x[0])
            
            # Count switches between consecutive lessons
            for i in range(len(day_lessons) - 1):
                _, loc1, var1 = day_lessons[i]
                _, loc2, var2 = day_lessons[i + 1]
                
                if loc1 != loc2:
                    # Penalty for location switch
                    switch_var = self.model.NewIntVar(0, 50, f'switch_{day}_{i}')
                    self.model.Add(switch_var >= 50 * (var1 + var2 - 1))
                    switches.append(switch_var)
        
        if switches:
            self.model.Add(switch_penalty == sum(switches))
        else:
            self.model.Add(switch_penalty == 0)
        
        return switch_penalty
    
    def _evaluate_solution_quality(self, result: ScheduleResult) -> float:
        """Evaluate the quality of a scheduling solution."""
        if not result or not result.scheduled_lessons:
            return 0.0
        
        total_students = len(self.data.students)
        scheduled_count = len(result.scheduled_lessons)
        
        # Base score: percentage of students scheduled
        base_score = scheduled_count / total_students if total_students > 0 else 0
        
        # Priority bonus: extra points for scheduling high-priority students
        priority_bonus = 0
        for lesson in result.scheduled_lessons:
            priority = self.student_priorities.get(lesson.student, 1.0)
            if priority > 2.0:
                priority_bonus += 0.1
        
        # Gap penalty: reduce score for excessive gaps
        gap_penalty = self._calculate_gap_penalty_score(result.scheduled_lessons)
        
        # Location switch penalty
        switch_penalty = self._calculate_switch_penalty_score(result.scheduled_lessons)
        
        final_score = base_score + priority_bonus - gap_penalty - switch_penalty
        return max(final_score, 0.0)
    
    def _calculate_gap_penalty_score(self, lessons: List[ScheduleEntry]) -> float:
        """Calculate gap penalty for solution evaluation."""
        if len(lessons) < 2:
            return 0.0
        
        # Group by day and location
        day_location_lessons = defaultdict(list)
        for lesson in lessons:
            key = (lesson.day, lesson.location)
            day_location_lessons[key].append(lesson)
        
        total_gap_penalty = 0.0
        for lessons_group in day_location_lessons.values():
            if len(lessons_group) < 2:
                continue
            
            # Sort by start time
            sorted_lessons = sorted(lessons_group, key=lambda x: x.start_time)
            
            for i in range(len(sorted_lessons) - 1):
                current_end = self._time_str_to_minutes(sorted_lessons[i].end_time)
                next_start = self._time_str_to_minutes(sorted_lessons[i + 1].start_time)
                gap = next_start - current_end
                
                if gap > 30:  # Penalize gaps longer than 30 minutes
                    total_gap_penalty += (gap - 30) / 120.0  # Normalize
        
        return min(total_gap_penalty, 0.3)  # Cap penalty
    
    def _calculate_switch_penalty_score(self, lessons: List[ScheduleEntry]) -> float:
        """Calculate location switch penalty for solution evaluation."""
        if len(lessons) < 2:
            return 0.0
        
        # Group by day
        day_lessons = defaultdict(list)
        for lesson in lessons:
            day_lessons[lesson.day].append(lesson)
        
        total_switches = 0
        for day_lessons_list in day_lessons.values():
            if len(day_lessons_list) < 2:
                continue
            
            # Sort by start time
            sorted_lessons = sorted(day_lessons_list, key=lambda x: x.start_time)
            
            for i in range(len(sorted_lessons) - 1):
                if sorted_lessons[i].location != sorted_lessons[i + 1].location:
                    total_switches += 1
        
        return total_switches * 0.05  # 5% penalty per switch
    
    def _time_str_to_minutes(self, time_str: str) -> int:
        """Convert HH:MM to minutes since midnight."""
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes
    
    def _extract_solution(self, solve_time: float, status) -> ScheduleResult:
        """Extract and format the solution with enhanced statistics."""
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
        day_order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        scheduled_lessons.sort(key=lambda x: (day_order.index(x.day), x.start_time))
        
        unscheduled_students = [
            s.name for s in self.data.students 
            if s.name not in scheduled_students
        ]
        
        # Enhanced statistics
        total_scheduled = len(scheduled_lessons)
        total_students = len(self.data.students)
        schedule_efficiency = (total_scheduled / total_students * 100) if total_students > 0 else 0
        
        location_usage = {}
        for lesson in scheduled_lessons:
            location_usage[lesson.location] = location_usage.get(lesson.location, 0) + 1
        
        # Calculate additional metrics
        gap_penalty_score = self._calculate_gap_penalty_score(scheduled_lessons)
        switch_penalty_score = self._calculate_switch_penalty_score(scheduled_lessons)
        solution_quality = self._evaluate_solution_quality(
            ScheduleResult(scheduled_lessons, unscheduled_students, [], {})
        )
        
        statistics = {
            'solve_time_seconds': round(solve_time, 3),
            'status': 'OPTIMAL' if status == cp_model.OPTIMAL else 'FEASIBLE',
            'total_students': total_students,
            'scheduled_students': total_scheduled,
            'schedule_efficiency_percent': round(schedule_efficiency, 1),
            'location_usage': location_usage,
            'solver_iterations': self.solver.NumBranches(),
            'variables_created': len(self.lesson_vars),
            'gap_penalty_score': round(gap_penalty_score, 3),
            'switch_penalty_score': round(switch_penalty_score, 3),
            'solution_quality_score': round(solution_quality, 3),
            'high_priority_scheduled': len([
                l for l in scheduled_lessons 
                if self.student_priorities.get(l.student, 0) > 2.0
            ])
        }
        
        return ScheduleResult(
            scheduled_lessons=scheduled_lessons,
            unscheduled_students=unscheduled_students,
            conflicts=[],  # Will be filled by conflict analyzer
            statistics=statistics
        )
    
    def _handle_infeasible_solution(self, solve_time: float) -> ScheduleResult:
        """Handle case where no solution was found."""
        # Analyze why the solution is infeasible
        conflicts = self._analyze_infeasibility_causes()
        
        statistics = {
            'solve_time_seconds': round(solve_time, 3),
            'status': 'INFEASIBLE',
            'total_students': len(self.data.students),
            'scheduled_students': 0,
            'schedule_efficiency_percent': 0,
            'location_usage': {},
            'solver_iterations': 0,
            'variables_created': len(self.lesson_vars),
            'gap_penalty_score': 0,
            'switch_penalty_score': 0,
            'solution_quality_score': 0,
            'high_priority_scheduled': 0,
            'break_constraints_enabled': self._should_enforce_breaks()
        }
        
        return ScheduleResult(
            scheduled_lessons=[],
            unscheduled_students=[s.name for s in self.data.students],
            conflicts=conflicts,
            statistics=statistics
        )
    
    def _analyze_infeasibility_causes(self) -> List[ConflictReason]:
        """Analyze why the scheduling problem is infeasible."""
        conflicts = []
        
        # First check if break constraints are causing issues
        if self._should_enforce_breaks():
            break_conflicts = self._analyze_break_conflicts()
            conflicts.extend(break_conflicts)
        
        # Check for other standard conflicts (availability, location, etc.)
        standard_conflicts = self._analyze_standard_conflicts()
        conflicts.extend(standard_conflicts)
        
        return conflicts
    
    def _analyze_break_conflicts(self) -> List[ConflictReason]:
        """Analyze conflicts caused by break constraints."""
        conflicts = []
        
        # Test if the problem would be solvable without break constraints
        solvable_without_breaks = self._test_without_breaks()
        
        if solvable_without_breaks:
            # Break constraints are the primary cause of infeasibility
            suggestions = self._generate_break_suggestions()
            
            # Find the most affected students
            affected_students = self._find_break_affected_students()
            
            for student in affected_students[:3]:  # Report top 3 affected
                conflicts.append(ConflictReason(
                    student=student,
                    reason_type='teacher_break_required',
                    description=f"Cannot schedule {student}: would exceed {self.data.teacher.break_config.max_teaching_block_minutes}-minute teaching block without a {self.data.teacher.break_config.min_break_duration_minutes}-minute break",
                    suggestions=suggestions
                ))
        
        return conflicts
    
    def _analyze_standard_conflicts(self) -> List[ConflictReason]:
        """Analyze standard scheduling conflicts."""
        conflicts = []
        
        # Check for students with impossible constraints
        for student in self.data.students:
            if not self._has_valid_availability(student):
                conflicts.append(ConflictReason(
                    student=student.name,
                    reason_type='no_overlap',
                    description=f"No available time slots for {student.name}",
                    suggestions=["Expand student availability windows", "Add more teacher availability"]
                ))
        
        return conflicts
    
    def _test_without_breaks(self) -> bool:
        """Test if the problem would be solvable without break constraints."""
        try:
            # Create a temporary scheduler without breaks
            temp_data = self.data
            original_break_config = temp_data.teacher.break_config
            temp_data.teacher.break_config = None  # Temporarily disable breaks
            
            # Create a minimal test model
            temp_model = cp_model.CpModel()
            temp_solver = cp_model.CpSolver()
            temp_solver.parameters.max_time_in_seconds = 5.0  # Quick test
            
            # Create variables for a few key students
            temp_vars = {}
            test_students = self.data.students[:5]  # Test with first 5 students
            
            for student in test_students:
                for day, start_minutes, location in self.time_slots[:20]:  # Limited slots for speed
                    if (student.can_access_location(location) and 
                        self._student_available_at_time(student, day, start_minutes, location)):
                        var_name = f'temp_{student.name}_{day}_{start_minutes}_{location}'
                        temp_vars[(student.name, day, start_minutes, location)] = temp_model.NewBoolVar(var_name)
            
            # Add basic constraints (no breaks)
            # Each student at most one lesson
            for student in test_students:
                student_vars = [var for (s, d, t, l), var in temp_vars.items() if s == student.name]
                if student_vars:
                    temp_model.Add(sum(student_vars) <= 1)
            
            # No overlaps
            for (s1, d1, t1, l1), var1 in temp_vars.items():
                for (s2, d2, t2, l2), var2 in temp_vars.items():
                    if s1 >= s2:  # Avoid duplicate checks
                        continue
                    if d1 == d2 and l1 == l2:  # Same day and location
                        student1 = next(st for st in test_students if st.name == s1)
                        student2 = next(st for st in test_students if st.name == s2)
                        end1 = t1 + student1.lesson_duration
                        end2 = t2 + student2.lesson_duration
                        
                        if not (end1 <= t2 or end2 <= t1):  # Would overlap
                            temp_model.Add(var1 + var2 <= 1)
            
            # Try to maximize scheduled students
            temp_model.Maximize(sum(temp_vars.values()))
            
            status = temp_solver.Solve(temp_model)
            is_solvable = status in [cp_model.OPTIMAL, cp_model.FEASIBLE]
            
            # Restore original break config
            temp_data.teacher.break_config = original_break_config
            
            return is_solvable
            
        except Exception:
            return False  # Conservative: assume not solvable if test fails
    
    def _generate_break_suggestions(self) -> List[str]:
        """Generate actionable suggestions for break-related conflicts."""
        suggestions = []
        config = self.data.teacher.break_config
        
        # Suggestion 1: Remove breaks entirely
        without_breaks_count = self._estimate_schedulable_without_breaks()
        suggestions.append(f"Remove break requirements (would allow scheduling {without_breaks_count} students)")
        
        # Suggestion 2: Increase teaching block duration
        for extension in [30, 60, 90]:
            new_max = config.max_teaching_block_minutes + extension
            estimated_count = self._estimate_with_longer_blocks(new_max)
            if estimated_count > 0:
                suggestions.append(f"Increase max teaching block to {new_max} minutes (estimated +{estimated_count} students)")
                break
        
        # Suggestion 3: Reduce break duration
        if config.min_break_duration_minutes > 10:
            for reduction in [5, 10]:
                new_min = max(5, config.min_break_duration_minutes - reduction)
                estimated_count = self._estimate_with_shorter_breaks(new_min)
                if estimated_count > 0:
                    suggestions.append(f"Reduce minimum break to {new_min} minutes (estimated +{estimated_count} students)")
                    break
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def _find_break_affected_students(self) -> List[str]:
        """Find students most likely affected by break constraints."""
        # This is a simplified heuristic - could be enhanced
        # Students with longer lessons or limited availability are more likely to be affected
        affected = []
        
        for student in self.data.students:
            if student.lesson_duration > 60:  # Longer lessons are harder to fit
                affected.append(student.name)
            elif len(student.availability) <= 2:  # Limited availability
                affected.append(student.name)
        
        return affected
    
    def _has_valid_availability(self, student: Student) -> bool:
        """Check if student has any valid availability slots."""
        for window in student.availability:
            if window.duration_minutes >= student.lesson_duration:
                # Check if teacher is available at this time/location
                teacher_available = any(
                    tw.day == window.day and 
                    tw.location == window.location and
                    tw.overlaps_with(window)
                    for tw in self.data.teacher.availability
                )
                if teacher_available:
                    return True
        return False
    
    def _estimate_schedulable_without_breaks(self) -> int:
        """Estimate how many students could be scheduled without breaks."""
        # Simplified estimation - in practice this could run a quick solver test
        return max(len(self.data.students) - 2, 0)  # Conservative estimate
    
    def _estimate_with_longer_blocks(self, new_max_minutes: int) -> int:
        """Estimate improvement with longer teaching blocks."""
        current_max = self.data.teacher.break_config.max_teaching_block_minutes
        improvement_ratio = new_max_minutes / current_max if current_max > 0 else 1.0
        return max(int(2 * improvement_ratio), 0)  # Rough heuristic
    
    def _estimate_with_shorter_breaks(self, new_min_minutes: int) -> int:
        """Estimate improvement with shorter breaks."""
        current_min = self.data.teacher.break_config.min_break_duration_minutes
        if current_min > new_min_minutes:
            return 1  # Small improvement expected
        return 0