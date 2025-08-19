"""
Data models for the scheduling system.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime, time
import json


@dataclass
class TimeWindow:
    """Represents a time window with day, start/end times, and location."""
    day: str  # monday, tuesday, etc.
    start_time: str  # HH:MM format
    end_time: str  # HH:MM format
    location: str
    
    def to_minutes(self, time_str: str) -> int:
        """Convert HH:MM to minutes since midnight."""
        hour, minute = map(int, time_str.split(':'))
        return hour * 60 + minute
    
    @property
    def start_minutes(self) -> int:
        return self.to_minutes(self.start_time)
    
    @property
    def end_minutes(self) -> int:
        return self.to_minutes(self.end_time)
    
    @property
    def duration_minutes(self) -> int:
        return self.end_minutes - self.start_minutes
    
    def overlaps_with(self, other: 'TimeWindow') -> bool:
        """Check if this time window overlaps with another on the same day."""
        if self.day != other.day:
            return False
        return not (self.end_minutes <= other.start_minutes or 
                   self.start_minutes >= other.end_minutes)


@dataclass
class Student:
    """Represents a student with their availability and constraints."""
    name: str
    availability: List[TimeWindow]
    accessible_locations: List[str]
    lesson_duration: int  # in minutes
    
    def can_access_location(self, location: str) -> bool:
        """Check if student can access the given location."""
        return location in self.accessible_locations
    
    def get_availability_at_location(self, location: str) -> List[TimeWindow]:
        """Get availability windows where student can access the location."""
        return [window for window in self.availability 
                if self.can_access_location(window.location)]


@dataclass
class Location:
    """Represents a teaching location."""
    id: str
    name: str
    address: Optional[str] = None


@dataclass
class TeacherSchedule:
    """Represents teacher's availability across different locations."""
    availability: List[TimeWindow]
    
    def get_availability_at_location(self, location: str) -> List[TimeWindow]:
        """Get teacher's availability windows at a specific location."""
        return [window for window in self.availability if window.location == location]
    
    def get_availability_on_day(self, day: str) -> List[TimeWindow]:
        """Get teacher's availability on a specific day."""
        return [window for window in self.availability if window.day == day]


@dataclass
class ScheduleEntry:
    """Represents a scheduled lesson."""
    student: str
    day: str
    start_time: str
    end_time: str
    location: str
    duration: int
    
    def to_dict(self) -> Dict:
        return {
            'student': self.student,
            'day': self.day,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'location': self.location,
            'duration': self.duration
        }


@dataclass
class ConflictReason:
    """Represents why a student couldn't be scheduled."""
    student: str
    reason_type: str  # 'location_mismatch', 'no_overlap', 'slots_taken'
    description: str
    suggestions: List[str]


@dataclass
class ScheduleResult:
    """Results of the scheduling attempt."""
    scheduled_lessons: List[ScheduleEntry]
    unscheduled_students: List[str]
    conflicts: List[ConflictReason]
    statistics: Dict[str, any]
    
    def to_dict(self) -> Dict:
        return {
            'scheduled_lessons': [lesson.to_dict() for lesson in self.scheduled_lessons],
            'unscheduled_students': self.unscheduled_students,
            'conflicts': [
                {
                    'student': conflict.student,
                    'reason_type': conflict.reason_type,
                    'description': conflict.description,
                    'suggestions': conflict.suggestions
                }
                for conflict in self.conflicts
            ],
            'statistics': self.statistics
        }


class SchedulingData:
    """Container for all scheduling input data."""
    
    def __init__(self, teacher: TeacherSchedule, students: List[Student], 
                 locations: List[Location]):
        self.teacher = teacher
        self.students = students
        self.locations = locations
    
    @classmethod
    def from_json_file(cls, file_path: str) -> 'SchedulingData':
        """Load scheduling data from JSON file."""
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Parse locations
        locations = [Location(**loc) for loc in data['locations']]
        
        # Parse teacher schedule
        teacher_windows = []
        for window_data in data['teacher']['availability']:
            teacher_windows.append(TimeWindow(**window_data))
        teacher = TeacherSchedule(teacher_windows)
        
        # Parse students
        students = []
        for student_data in data['students']:
            student_windows = [TimeWindow(**window) for window in student_data['availability']]
            student = Student(
                name=student_data['name'],
                availability=student_windows,
                accessible_locations=student_data['accessible_locations'],
                lesson_duration=student_data['lesson_duration']
            )
            students.append(student)
        
        return cls(teacher, students, locations)