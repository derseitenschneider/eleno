#!/usr/bin/env python3

import json
from models import SchedulingData, Student, TeacherSchedule, TimeWindow, TeacherBreakConfig, Location
from scheduler_hardened import HardenedLessonScheduler

def load_scheduling_data_from_json(filepath):
    """Load and parse JSON scheduling data (copied from run_chaos_tests.py)."""
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    # Parse teacher
    teacher_data = data['teacher']
    availability = [
        TimeWindow(
            day=w['day'],
            start_time=w['start_time'],
            end_time=w['end_time'],
            location=w['location'],
            priority=w.get('priority', 1)
        ) for w in teacher_data['availability']
    ]
    
    break_config = None
    if 'break_config' in teacher_data:
        bc = teacher_data['break_config']
        break_config = TeacherBreakConfig(
            max_teaching_block_minutes=bc['max_teaching_block_minutes'],
            min_break_duration_minutes=bc['min_break_duration_minutes']
        )
    
    teacher = TeacherSchedule(availability=availability, break_config=break_config)
    
    # Parse students
    students = []
    for student_data in data['students']:
        student_availability = [
            TimeWindow(
                day=w['day'],
                start_time=w['start_time'],
                end_time=w['end_time'],
                location=w['location'],
                priority=w.get('priority', 1)
            ) for w in student_data['availability']
        ]
        
        student = Student(
            name=student_data['name'],
            availability=student_availability,
            accessible_locations=student_data['accessible_locations'],
            lesson_duration=student_data['lesson_duration']
        )
        students.append(student)
    
    # Parse locations
    locations = [Location(id=loc['id'], name=loc['name']) for loc in data['locations']]
    
    return SchedulingData(teacher=teacher, students=students, locations=locations)

def debug_enhanced_result():
    """Debug the enhanced scheduler result structure."""
    
    # Load the break starvation test case
    data = load_scheduling_data_from_json('test_scenarios/test_chaos_04_break_starvation.json')
    scheduler = HardenedLessonScheduler(data)
    
    print("=== DEBUGGING ENHANCED SCHEDULER RESULT ===")
    print(f"Total students: {len(data.students)}")
    
    # Run the enhanced scheduler
    result = scheduler.create_schedule()
    
    print(f"\n=== SCHEDULE RESULT ATTRIBUTES ===")
    print(f"Type: {type(result)}")
    print(f"Dir: {[attr for attr in dir(result) if not attr.startswith('_')]}")
    
    # Check if it has scheduled_lessons
    if hasattr(result, 'scheduled_lessons'):
        print(f"\nScheduled lessons count: {len(result.scheduled_lessons)}")
        if result.scheduled_lessons:
            print("First few scheduled lessons:")
            for i, lesson in enumerate(result.scheduled_lessons[:3]):
                print(f"  {i+1}. {lesson}")
    else:
        print("\nNo 'scheduled_lessons' attribute found!")
    
    # Check what attributes it does have
    print(f"\n=== ALL RESULT ATTRIBUTES ===")
    for attr in ['scheduled_lessons', 'unscheduled_students', 'statistics', 'solve_time', 'success', 'solver_status']:
        if hasattr(result, attr):
            value = getattr(result, attr)
            print(f"{attr}: {value} (type: {type(value)})")
        else:
            print(f"{attr}: NOT FOUND")
    
    # Check the result.statistics dictionary if it exists
    if hasattr(result, 'statistics') and isinstance(result.statistics, dict):
        print(f"\n=== STATISTICS DICTIONARY ===")
        for key, value in result.statistics.items():
            print(f"{key}: {value}")

if __name__ == "__main__":
    debug_enhanced_result()