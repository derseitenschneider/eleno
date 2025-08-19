"""
Conflict analysis for unscheduled students.
"""

from typing import List, Dict, Set, Tuple
from models import (
    SchedulingData, Student, TimeWindow, ScheduleResult, 
    ConflictReason, ScheduleEntry
)


class ConflictAnalyzer:
    """Analyzes why students couldn't be scheduled and suggests solutions."""
    
    def __init__(self, data: SchedulingData):
        self.data = data
    
    def analyze_conflicts(self, result: ScheduleResult) -> ScheduleResult:
        """Analyze conflicts for unscheduled students and add to result."""
        conflicts = []
        
        for student_name in result.unscheduled_students:
            student = next(s for s in self.data.students if s.name == student_name)
            conflict = self._analyze_student_conflict(student, result.scheduled_lessons)
            conflicts.append(conflict)
        
        result.conflicts = conflicts
        return result
    
    def _analyze_student_conflict(self, student: Student, 
                                scheduled_lessons: List[ScheduleEntry]) -> ConflictReason:
        """Analyze why a specific student couldn't be scheduled."""
        
        # Check for location/day mismatch first (most common issue)
        location_day_mismatch = self._check_location_day_mismatch(student)
        if location_day_mismatch:
            return location_day_mismatch
        
        # Check for location accessibility issues
        location_conflict = self._check_location_conflicts(student)
        if location_conflict:
            return location_conflict
        
        # Check for time availability issues
        time_conflict = self._check_time_conflicts(student, scheduled_lessons)
        if time_conflict:
            return time_conflict
        
        # Check for scheduling conflicts (slots taken by others)
        slot_conflict = self._check_slot_conflicts(student, scheduled_lessons)
        if slot_conflict:
            return slot_conflict
        
        # Fallback - general scheduling issue
        return ConflictReason(
            student=student.name,
            reason_type='general',
            description='Could not find a suitable time slot that satisfies all constraints.',
            suggestions=[
                'Check if student availability can be expanded',
                'Consider adding more teacher availability windows',
                'Review lesson duration requirements'
            ]
        )
    
    def _check_location_conflicts(self, student: Student) -> ConflictReason:
        """Check if student has location accessibility issues."""
        # Get all locations where teacher is available
        teacher_locations = set(window.location for window in self.data.teacher.availability)
        
        # Check if student can access any of these locations
        accessible_teacher_locations = teacher_locations.intersection(
            set(student.accessible_locations)
        )
        
        if not accessible_teacher_locations:
            # Student can't access any location where teacher is available
            teacher_location_names = [
                next(loc.name for loc in self.data.locations if loc.id == loc_id)
                for loc_id in teacher_locations
            ]
            
            accessible_location_names = [
                next(loc.name for loc in self.data.locations if loc.id == loc_id)
                for loc_id in student.accessible_locations
            ]
            
            return ConflictReason(
                student=student.name,
                reason_type='location_mismatch',
                description=f'Student can only access {accessible_location_names} but teacher is only available at {teacher_location_names}.',
                suggestions=[
                    f'Ask if student can travel to: {", ".join(teacher_location_names)}',
                    f'Ask teacher to add availability at: {", ".join(accessible_location_names)}',
                    'Consider online/virtual lessons if applicable'
                ]
            )
        
        # Check if student's availability matches teacher's location schedule
        viable_combinations = []
        for student_window in student.availability:
            teacher_windows_at_location = [
                tw for tw in self.data.teacher.availability
                if tw.location == student_window.location and tw.day == student_window.day
            ]
            
            for teacher_window in teacher_windows_at_location:
                if student_window.overlaps_with(teacher_window):
                    viable_combinations.append((student_window, teacher_window))
        
        if not viable_combinations:
            return ConflictReason(
                student=student.name,
                reason_type='location_schedule_mismatch',
                description='No time overlap between student availability and teacher availability at accessible locations.',
                suggestions=self._generate_location_schedule_suggestions(student)
            )
        
        return None
    
    def _check_location_day_mismatch(self, student: Student) -> ConflictReason:
        """Check if student's available locations don't match teacher's schedule on those days."""
        
        mismatches = []
        valid_combinations = []
        
        for window in student.availability:
            # Check if teacher is at that location on that day
            teacher_at_location = any(
                tw.day == window.day and tw.location == window.location
                for tw in self.data.teacher.availability
            )
            
            location_name = next(
                (loc.name for loc in self.data.locations if loc.id == window.location),
                window.location
            )
            
            if not teacher_at_location:
                mismatches.append(f"{window.day.title()} at {location_name}")
            else:
                valid_combinations.append(f"{window.day.title()} at {location_name}")
        
        # Only return this conflict if ALL student availability is mismatched
        # If there are valid combinations, this isn't the primary issue
        if mismatches and not valid_combinations:
            # Show where teacher actually is on each day
            teacher_schedule = []
            for tw in self.data.teacher.availability:
                location_name = next(
                    (loc.name for loc in self.data.locations if loc.id == tw.location),
                    tw.location
                )
                teacher_schedule.append(f"{tw.day.title()}: {location_name}")
            
            suggestions = [
                f'Student wants: {", ".join(mismatches)} but teacher is not there',
                f'Teacher\'s location schedule: {"; ".join(teacher_schedule)}',
                'Student needs to adjust availability to match teacher\'s location schedule'
            ]
            
            return ConflictReason(
                student=student.name,
                reason_type='location_day_mismatch',
                description=f'Student availability doesn\'t match teacher\'s location schedule: {", ".join(mismatches)}',
                suggestions=suggestions
            )
        
        return None
    
    def _check_time_conflicts(self, student: Student, 
                            scheduled_lessons: List[ScheduleEntry]) -> ConflictReason:
        """Check for time availability conflicts."""
        
        # Find overlapping availability between student and teacher
        overlapping_windows = []
        
        for student_window in student.availability:
            teacher_windows = [
                tw for tw in self.data.teacher.availability
                if tw.day == student_window.day and 
                   tw.location == student_window.location and
                   student.can_access_location(tw.location)
            ]
            
            for teacher_window in teacher_windows:
                if student_window.overlaps_with(teacher_window):
                    # Calculate actual overlap
                    overlap_start = max(student_window.start_minutes, teacher_window.start_minutes)
                    overlap_end = min(student_window.end_minutes, teacher_window.end_minutes)
                    overlap_duration = overlap_end - overlap_start
                    
                    if overlap_duration >= student.lesson_duration:
                        overlapping_windows.append({
                            'day': student_window.day,
                            'location': student_window.location,
                            'start': overlap_start,
                            'end': overlap_end,
                            'duration': overlap_duration
                        })
        
        if not overlapping_windows:
            return ConflictReason(
                student=student.name,
                reason_type='no_time_overlap',
                description='No overlapping availability between student and teacher.',
                suggestions=self._generate_time_suggestions(student)
            )
        
        return None
    
    def _check_slot_conflicts(self, student: Student, 
                            scheduled_lessons: List[ScheduleEntry]) -> ConflictReason:
        """Check if available slots are taken by other students."""
        
        # Find potential time slots for this student
        potential_slots = []
        
        for student_window in student.availability:
            teacher_windows = [
                tw for tw in self.data.teacher.availability
                if tw.day == student_window.day and 
                   tw.location == student_window.location and
                   student.can_access_location(tw.location)
            ]
            
            for teacher_window in teacher_windows:
                if student_window.overlaps_with(teacher_window):
                    overlap_start = max(student_window.start_minutes, teacher_window.start_minutes)
                    overlap_end = min(student_window.end_minutes, teacher_window.end_minutes)
                    
                    # Check for potential lesson slots within this overlap
                    current_time = overlap_start
                    while current_time + student.lesson_duration <= overlap_end:
                        potential_slots.append({
                            'day': student_window.day,
                            'location': student_window.location,
                            'start': current_time,
                            'end': current_time + student.lesson_duration
                        })
                        current_time += 15  # 15-minute increments
        
        if not potential_slots:
            return None  # This should have been caught by previous checks
        
        # Check which slots are blocked by existing lessons
        available_slots = []
        blocked_slots = []
        
        for slot in potential_slots:
            is_blocked = False
            blocking_lesson = None
            
            for lesson in scheduled_lessons:
                if (lesson.day == slot['day'] and 
                    lesson.location == slot['location']):
                    
                    lesson_start = self._time_str_to_minutes(lesson.start_time)
                    lesson_end = self._time_str_to_minutes(lesson.end_time)
                    
                    # Check for overlap
                    if not (slot['end'] <= lesson_start or slot['start'] >= lesson_end):
                        is_blocked = True
                        blocking_lesson = lesson
                        break
            
            if is_blocked:
                blocked_slots.append((slot, blocking_lesson))
            else:
                available_slots.append(slot)
        
        if available_slots:
            # There are available slots, so the issue is elsewhere
            return None
        
        # All slots are blocked
        blocking_students = list(set(lesson.student for slot, lesson in blocked_slots))
        
        return ConflictReason(
            student=student.name,
            reason_type='slots_taken',
            description=f'All available time slots are occupied by other students: {", ".join(blocking_students)}.',
            suggestions=self._generate_slot_conflict_suggestions(student, blocked_slots)
        )
    
    def _generate_location_schedule_suggestions(self, student: Student) -> List[str]:
        """Generate suggestions for location schedule conflicts."""
        suggestions = []
        
        # Find teacher's availability at student's accessible locations
        for location in student.accessible_locations:
            teacher_windows = [
                tw for tw in self.data.teacher.availability 
                if tw.location == location
            ]
            
            location_name = next(
                (loc.name for loc in self.data.locations if loc.id == location), 
                location
            )
            
            if teacher_windows:
                days_available = list(set(tw.day.title() for tw in teacher_windows))
                suggestions.append(
                    f'Teacher is available at {location_name} on: {", ".join(days_available)}'
                )
            else:
                suggestions.append(f'Ask teacher to add availability at {location_name}')
        
        return suggestions
    
    def _generate_time_suggestions(self, student: Student) -> List[str]:
        """Generate suggestions for time overlap issues."""
        suggestions = []
        
        # Show student's availability
        student_times = []
        for window in student.availability:
            location_name = next(
                (loc.name for loc in self.data.locations if loc.id == window.location),
                window.location
            )
            student_times.append(
                f'{window.day.title()} {window.start_time}-{window.end_time} at {location_name}'
            )
        
        suggestions.append(f'Student is available: {"; ".join(student_times)}')
        
        # Show teacher's availability at accessible locations
        for location in student.accessible_locations:
            teacher_windows = [
                tw for tw in self.data.teacher.availability 
                if tw.location == location
            ]
            
            if teacher_windows:
                location_name = next(
                    (loc.name for loc in self.data.locations if loc.id == location),
                    location
                )
                
                teacher_times = [
                    f'{tw.day.title()} {tw.start_time}-{tw.end_time}'
                    for tw in teacher_windows
                ]
                
                suggestions.append(
                    f'Teacher available at {location_name}: {"; ".join(teacher_times)}'
                )
        
        suggestions.append('Consider adjusting student or teacher availability to create overlap')
        
        return suggestions
    
    def _generate_slot_conflict_suggestions(self, student: Student, 
                                          blocked_slots: List[Tuple]) -> List[str]:
        """Generate suggestions for slot conflicts."""
        suggestions = []
        
        # Show which students are blocking which times
        for slot, blocking_lesson in blocked_slots:
            location_name = next(
                (loc.name for loc in self.data.locations if loc.id == slot['location']),
                slot['location']
            )
            
            start_time = self._minutes_to_time_str(slot['start'])
            suggestions.append(
                f'{slot["day"].title()} {start_time} at {location_name} is taken by {blocking_lesson.student}'
            )
        
        suggestions.append('Consider asking other students to change their lesson times')
        suggestions.append('Ask teacher to add more availability windows')
        suggestions.append('Consider shorter lesson durations to fit in smaller gaps')
        
        return suggestions
    
    def _time_str_to_minutes(self, time_str: str) -> int:
        """Convert HH:MM to minutes since midnight."""
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes
    
    def _minutes_to_time_str(self, minutes: int) -> str:
        """Convert minutes since midnight to HH:MM format."""
        hours = minutes // 60
        mins = minutes % 60
        return f"{hours:02d}:{mins:02d}"