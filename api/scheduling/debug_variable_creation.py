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

def debug_variable_creation():
    """Debug why variables aren't being created for break starvation scenario."""
    
    # Load the break starvation test case
    data = load_scheduling_data_from_json('test_scenarios/test_chaos_04_break_starvation.json')
    scheduler = HardenedLessonScheduler(data)
    
    print("=== DEBUGGING VARIABLE CREATION ===")
    print(f"Number of students: {len(data.students)}")
    print(f"Number of locations: {len(data.locations)}")
    print(f"Time granularity: {scheduler.time_granularity}")
    print(f"Number of time slots: {len(scheduler.time_slots)}")
    
    # Check constraint scores
    print("\n=== CONSTRAINT SCORES ===")
    for student_name, score in scheduler.student_constraint_scores.items():
        print(f"{student_name}: {score}")
    
    # Check sorted students
    sorted_students = scheduler._get_sorted_students()
    print(f"\n=== SORTED STUDENTS (constraint difficulty order) ===")
    for i, student in enumerate(sorted_students):
        print(f"{i+1}. {student.name} (score: {scheduler.student_constraint_scores[student.name]})")
    
    # Check time slots for the specific day/location
    monday_studio_a_slots = [
        (day, start_min, loc) for day, start_min, loc in scheduler.time_slots 
        if day == 'monday' and loc == 'studio_a'
    ]
    print(f"\n=== MONDAY STUDIO_A TIME SLOTS ===")
    print(f"Total slots: {len(monday_studio_a_slots)}")
    print("First 10 slots:")
    for i, slot in enumerate(monday_studio_a_slots[:10]):
        day, start_min, loc = slot
        print(f"  {i+1}. {day} {start_min//60:02d}:{start_min%60:02d} at {loc}")
    
    # Test variable creation for one student
    test_student = sorted_students[0]
    print(f"\n=== TESTING VARIABLE CREATION FOR {test_student.name} ===")
    print(f"Lesson duration: {test_student.lesson_duration} minutes")
    print(f"Accessible locations: {test_student.accessible_locations}")
    print(f"Availability windows: {len(test_student.availability)}")
    
    for window in test_student.availability:
        print(f"  - {window.day} {window.start_minutes//60:02d}:{window.start_minutes%60:02d}-{window.end_minutes//60:02d}:{window.end_minutes%60:02d} at {window.location} (priority {window.priority})")
    
    # Check what slots match this student
    matching_count = 0
    for day, start_minutes, location in scheduler.time_slots:
        # Check location accessibility
        if not test_student.can_access_location(location):
            continue
        
        # Check availability and priority
        matching_windows = [
            w for w in test_student.availability
            if w.day == day and 
               w.location == location and
               w.start_minutes <= start_minutes and
               w.end_minutes >= start_minutes + test_student.lesson_duration
        ]
        
        if matching_windows:
            matching_count += 1
            if matching_count <= 5:  # Show first 5 matches
                print(f"  Match {matching_count}: {day} {start_minutes//60:02d}:{start_minutes%60:02d} at {location}")
    
    print(f"Total matching slots for {test_student.name}: {matching_count}")
    
    # Now try to create variables and see what happens
    print(f"\n=== CREATING VARIABLES ===")
    print("Before variable creation:")
    print(f"  lesson_vars count: {len(scheduler.lesson_vars)}")
    print(f"  lesson_priority_map count: {len(scheduler.lesson_priority_map)}")
    
    scheduler._create_variables_hardened()
    
    print("After variable creation:")
    print(f"  lesson_vars count: {len(scheduler.lesson_vars)}")
    print(f"  lesson_priority_map count: {len(scheduler.lesson_priority_map)}")
    
    if scheduler.lesson_vars:
        print("First 5 variables created:")
        for i, (key, var) in enumerate(list(scheduler.lesson_vars.items())[:5]):
            student_name, day, start_min, location = key
            priority = scheduler.lesson_priority_map[key]
            print(f"  {i+1}. {var.Name()}: {student_name} on {day} at {start_min//60:02d}:{start_min%60:02d} ({location}) priority={priority}")
    else:
        print("NO VARIABLES CREATED!")

if __name__ == "__main__":
    debug_variable_creation()