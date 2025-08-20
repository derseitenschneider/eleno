#!/usr/bin/env python3
"""
Test script to verify hardened scheduler improvements against chaos scenarios.
"""

import json
import time
from typing import Dict, List, Any, Tuple
from datetime import datetime

from scheduler import LessonScheduler
from scheduler_hardened import HardenedLessonScheduler
from models import SchedulingData, Student, TimeWindow, TeacherSchedule, Location, TeacherBreakConfig


def parse_scenario_file(filepath: str) -> SchedulingData:
    """Parse a test scenario JSON file into SchedulingData."""
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
    for s_data in data['students']:
        student_availability = [
            TimeWindow(
                day=w['day'],
                start_time=w['start_time'],
                end_time=w['end_time'],
                location=w['location'],
                priority=w.get('priority', 1)
            ) for w in s_data['availability']
        ]
        
        student = Student(
            name=s_data['name'],
            availability=student_availability,
            accessible_locations=s_data['accessible_locations'],
            lesson_duration=s_data['lesson_duration']
        )
        students.append(student)
    
    # Parse locations
    locations = [
        Location(id=loc['id'], name=loc['name'])
        for loc in data['locations']
    ]
    
    return SchedulingData(
        teacher=teacher,
        students=students,
        locations=locations
    )


def test_scheduler_comparison(scenario_file: str) -> Dict[str, Any]:
    """Test both standard and hardened schedulers on a scenario."""
    print(f"\\nTesting: {scenario_file}")
    print("-" * 50)
    
    scheduling_data = parse_scenario_file(scenario_file)
    total_students = len(scheduling_data.students)
    
    results = {
        'scenario': scenario_file,
        'total_students': total_students,
        'standard': {},
        'hardened': {}
    }
    
    # Test standard scheduler
    print("🔧 Standard Scheduler:")
    start_time = time.time()
    try:
        standard_scheduler = LessonScheduler(scheduling_data)
        standard_result = standard_scheduler.create_schedule()
        solve_time = time.time() - start_time
        
        scheduled_count = len(standard_result.scheduled_lessons)
        success_rate = scheduled_count / total_students * 100
        
        results['standard'] = {
            'scheduled': scheduled_count,
            'success_rate': success_rate,
            'solve_time': solve_time,
            'status': standard_result.statistics.get('status', 'UNKNOWN')
        }
        
        print(f"   Scheduled: {scheduled_count}/{total_students} ({success_rate:.1f}%)")
        print(f"   Time: {solve_time:.3f}s")
        
    except Exception as e:
        results['standard'] = {
            'scheduled': 0,
            'success_rate': 0.0,
            'solve_time': time.time() - start_time,
            'status': f'ERROR: {str(e)}'
        }
        print(f"   ERROR: {str(e)}")
    
    # Test hardened scheduler
    print("🛡️  Hardened Scheduler:")
    start_time = time.time()
    try:
        hardened_scheduler = HardenedLessonScheduler(scheduling_data)
        hardened_result = hardened_scheduler.create_schedule()
        solve_time = time.time() - start_time
        
        scheduled_count = len(hardened_result.scheduled_lessons)
        success_rate = scheduled_count / total_students * 100
        
        results['hardened'] = {
            'scheduled': scheduled_count,
            'success_rate': success_rate,
            'solve_time': solve_time,
            'status': hardened_result.statistics.get('status', 'UNKNOWN')
        }
        
        print(f"   Scheduled: {scheduled_count}/{total_students} ({success_rate:.1f}%)")
        print(f"   Time: {solve_time:.3f}s")
        
    except Exception as e:
        results['hardened'] = {
            'scheduled': 0,
            'success_rate': 0.0,
            'solve_time': time.time() - start_time,
            'status': f'ERROR: {str(e)}'
        }
        print(f"   ERROR: {str(e)}")
    
    # Show improvement
    if 'scheduled' in results['standard'] and 'scheduled' in results['hardened']:
        improvement = results['hardened']['scheduled'] - results['standard']['scheduled']
        if improvement > 0:
            print(f"✅ IMPROVEMENT: +{improvement} students ({improvement/total_students*100:.1f}%)")
        elif improvement < 0:
            print(f"❌ REGRESSION: {improvement} students ({improvement/total_students*100:.1f}%)")
        else:
            print(f"🟰 NO CHANGE: Same performance")
    
    return results


def main():
    """Run hardening verification tests."""
    print("🛡️  HARDENED SCHEDULER VERIFICATION TESTS")
    print("=" * 60)
    
    # Test the chaos scenarios that showed failures
    chaos_scenarios = [
        'test_scenarios/test_chaos_01_priority_inversion.json',
        'test_scenarios/test_chaos_02_harmonic_resonance.json',
        'test_scenarios/test_chaos_04_break_starvation.json',
        'test_scenarios/test_chaos_07_location_convoy.json',
    ]
    
    all_results = []
    total_improvements = 0
    total_scenarios = 0
    
    for scenario in chaos_scenarios:
        try:
            result = test_scheduler_comparison(scenario)
            all_results.append(result)
            
            if 'scheduled' in result['standard'] and 'scheduled' in result['hardened']:
                improvement = result['hardened']['scheduled'] - result['standard']['scheduled']
                total_improvements += improvement
                total_scenarios += 1
        
        except FileNotFoundError:
            print(f"⚠️  Skipping {scenario} (file not found)")
        except Exception as e:
            print(f"❌ Error testing {scenario}: {str(e)}")
    
    # Summary
    print("\\n" + "=" * 60)
    print("📊 HARDENING VERIFICATION SUMMARY")
    print("=" * 60)
    
    if total_scenarios > 0:
        avg_improvement = total_improvements / total_scenarios
        print(f"Total scenarios tested: {total_scenarios}")
        print(f"Average student improvement: {avg_improvement:.1f} students per scenario")
        print(f"Total additional students scheduled: {total_improvements}")
        
        # Show detailed results
        print("\\nDetailed Results:")
        for result in all_results:
            scenario_name = result['scenario'].split('/')[-1].replace('.json', '')
            std_rate = result['standard'].get('success_rate', 0)
            hard_rate = result['hardened'].get('success_rate', 0)
            improvement = hard_rate - std_rate
            
            print(f"  {scenario_name:25} | {std_rate:5.1f}% → {hard_rate:5.1f}% ({improvement:+5.1f}%)")
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"hardening_verification_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump({
            'verification_session': {
                'timestamp': datetime.now().isoformat(),
                'total_scenarios': total_scenarios,
                'total_improvements': total_improvements,
                'avg_improvement': avg_improvement if total_scenarios > 0 else 0
            },
            'detailed_results': all_results
        }, f, indent=2)
    
    print(f"\\n📄 Detailed results saved to: {results_file}")
    
    if avg_improvement > 0:
        print("\\n🎯 HARDENING SUCCESS: Algorithm improvements verified!")
    else:
        print("\\n⚠️  HARDENING NEEDS WORK: No significant improvements detected")


if __name__ == "__main__":
    main()