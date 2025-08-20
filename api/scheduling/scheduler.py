"""
Core scheduling engine using Google OR-Tools.
"""

from ortools.sat.python import cp_model
from typing import List, Dict, Tuple, Optional
import time
from datetime import datetime, timedelta

from models import (
    SchedulingData, Student, TimeWindow, TeacherSchedule, 
    ScheduleEntry, ScheduleResult, ConflictReason
)


class LessonScheduler:
    """Main scheduling engine using constraint programming."""
    
    def __init__(self, data: SchedulingData):
        self.data = data
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
        # Time slots (15-minute intervals)
        self.time_slots = self._generate_time_slots()
        self.lesson_vars = {}
        self.lesson_priority_map = {}  # Track priority for each lesson variable
        self.statistics = {}
    
    def _generate_time_slots(self) -> List[Tuple[str, int, str]]:
        """Generate all possible time slots as (day, start_minutes, location) tuples."""
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
        """Main scheduling method."""
        start_time = time.time()
        
        # Create decision variables
        self._create_variables()
        
        # Add constraints
        self._add_constraints()
        
        # Set optimization objective
        self._set_objective()
        
        # Solve
        status = self.solver.Solve(self.model)
        
        solve_time = time.time() - start_time
        
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            return self._extract_solution(solve_time, status)
        else:
            return self._handle_infeasible_solution(solve_time)
    
    def _create_variables(self):
        """Create decision variables for each possible lesson assignment."""
        for student in self.data.students:
            for day, start_minutes, location in self.time_slots:
                # Check if student can access this location
                if not student.can_access_location(location):
                    continue
                
                # Check if student is available at this time and find the best priority
                matching_windows = [
                    w for w in student.availability
                    if w.day == day and 
                       w.location == location and
                       w.start_minutes <= start_minutes and
                       w.end_minutes >= start_minutes + student.lesson_duration
                ]
                
                if not matching_windows:
                    continue
                
                # Use the highest priority (lowest number) among matching windows
                best_priority = min(w.priority for w in matching_windows)
                
                var_name = f'lesson_{student.name}_{day}_{start_minutes}_{location}'
                lesson_key = (student.name, day, start_minutes, location)
                self.lesson_vars[lesson_key] = self.model.NewBoolVar(var_name)
                self.lesson_priority_map[lesson_key] = best_priority
    
    def _add_constraints(self):
        """Add scheduling constraints."""
        
        # Constraint 1: Each student gets at most one lesson per week
        for student in self.data.students:
            student_vars = [
                var for (s, d, t, l), var in self.lesson_vars.items() 
                if s == student.name
            ]
            if student_vars:
                self.model.Add(sum(student_vars) <= 1)
        
        # Constraint 2: No overlapping lessons (teacher can only teach one lesson at a time)
        # Create constraints for all pairs of lessons that could overlap
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
                
                # Check if lessons would overlap
                if not (end1 <= start2 or end2 <= start1):
                    # These lessons overlap, so at most one can be scheduled
                    self.model.Add(var1 + var2 <= 1)
        
        # Constraint 3: Lessons must fit within student availability windows
        # (Already handled in variable creation, but double-check)
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
    
    def _set_objective(self):
        """Set optimization objectives."""
        # Primary objective: Maximize number of scheduled lessons
        total_lessons = sum(self.lesson_vars.values())
        
        # Secondary objective: Prioritize high-priority time slots
        priority_bonus = self._calculate_priority_bonus()
        
        # Tertiary objective: Minimize gaps between lessons
        gap_penalty = self._calculate_gap_penalty()
        
        # Combine objectives (lessons count most, then priority, then minimize gaps)
        self.model.Maximize(total_lessons * 10000 + priority_bonus - gap_penalty)
    
    def _calculate_priority_bonus(self) -> cp_model.IntVar:
        """Calculate bonus points for scheduling in high-priority time slots."""
        priority_bonus = self.model.NewIntVar(0, 50000, 'priority_bonus')
        
        # Calculate bonus points based on priority
        bonus_terms = []
        for lesson_key, var in self.lesson_vars.items():
            priority = self.lesson_priority_map[lesson_key]
            
            # Priority scoring: 1=100 points, 2=50 points, 3=10 points
            if priority == 1:
                bonus_points = 100
            elif priority == 2:
                bonus_points = 50
            elif priority == 3:
                bonus_points = 10
            else:
                bonus_points = 1  # Fallback for any other priority values
            
            # Create a variable that equals bonus_points when lesson is scheduled, 0 otherwise
            bonus_var = self.model.NewIntVar(0, bonus_points, f'bonus_{lesson_key}')
            self.model.Add(bonus_var == bonus_points * var)
            bonus_terms.append(bonus_var)
        
        if bonus_terms:
            self.model.Add(priority_bonus == sum(bonus_terms))
        else:
            self.model.Add(priority_bonus == 0)
        
        return priority_bonus
    
    def _calculate_gap_penalty(self) -> cp_model.IntVar:
        """Calculate penalty for gaps between lessons."""
        gap_penalty = self.model.NewIntVar(0, 10000, 'gap_penalty')
        
        # For each day/location, penalize gaps between lessons
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
                        gap_var = self.model.NewIntVar(0, gap_minutes, f'gap_{day}_{location.id}_{i}')
                        self.model.Add(gap_var >= gap_minutes * (var1 + var2 - 1))
                        penalties.append(gap_var)
        
        if penalties:
            self.model.Add(gap_penalty == sum(penalties))
        else:
            self.model.Add(gap_penalty == 0)
        
        return gap_penalty
    
    def _extract_solution(self, solve_time: float, status) -> ScheduleResult:
        """Extract and format the solution."""
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
        
        # Generate statistics
        total_scheduled = len(scheduled_lessons)
        total_students = len(self.data.students)
        schedule_efficiency = (total_scheduled / total_students * 100) if total_students > 0 else 0
        
        location_usage = {}
        for lesson in scheduled_lessons:
            location_usage[lesson.location] = location_usage.get(lesson.location, 0) + 1
        
        statistics = {
            'solve_time_seconds': round(solve_time, 3),
            'status': 'OPTIMAL' if status == cp_model.OPTIMAL else 'FEASIBLE',
            'total_students': total_students,
            'scheduled_students': total_scheduled,
            'schedule_efficiency_percent': round(schedule_efficiency, 1),
            'location_usage': location_usage,
            'solver_iterations': self.solver.NumBranches(),
            'variables_created': len(self.lesson_vars)
        }
        
        return ScheduleResult(
            scheduled_lessons=scheduled_lessons,
            unscheduled_students=unscheduled_students,
            conflicts=[],  # Will be filled by conflict analyzer
            statistics=statistics
        )
    
    def _handle_infeasible_solution(self, solve_time: float) -> ScheduleResult:
        """Handle case where no solution was found."""
        statistics = {
            'solve_time_seconds': round(solve_time, 3),
            'status': 'INFEASIBLE',
            'total_students': len(self.data.students),
            'scheduled_students': 0,
            'schedule_efficiency_percent': 0,
            'location_usage': {},
            'solver_iterations': self.solver.NumBranches(),
            'variables_created': len(self.lesson_vars)
        }
        
        return ScheduleResult(
            scheduled_lessons=[],
            unscheduled_students=[s.name for s in self.data.students],
            conflicts=[],  # Will be filled by conflict analyzer
            statistics=statistics
        )