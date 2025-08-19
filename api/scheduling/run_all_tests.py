#!/usr/bin/env python3
"""
Comprehensive test runner for all 20 scheduling test scenarios.
Executes each test and collects detailed results for analysis.
"""

import json
import time
import os
from pathlib import Path
from scheduler import LessonScheduler
from models import SchedulingData
from conflict_analyzer import ConflictAnalyzer


def run_single_test(test_file_path):
    """Run a single test scenario and return detailed results."""
    print(f"\n{'='*80}")
    print(f"RUNNING: {test_file_path.name}")
    print(f"{'='*80}")
    
    # Load test data
    with open(test_file_path, 'r') as f:
        test_data = json.load(f)
    
    test_description = test_data.get('_test_description', 'No description')
    expected_result = test_data.get('_expected_result', 'No expectation specified')
    
    print(f"Description: {test_description}")
    print(f"Expected: {expected_result}")
    
    try:
        # Load scheduling data
        data = SchedulingData.from_json_file(test_file_path)
        total_students = len(data.students)
        
        # Create scheduler and run
        start_time = time.time()
        scheduler = LessonScheduler(data)
        result = scheduler.create_schedule()
        end_time = time.time()
        
        # Analyze conflicts for unscheduled students
        if result.unscheduled_students:
            analyzer = ConflictAnalyzer(data)
            result = analyzer.analyze_conflicts(result)
        
        # Calculate additional metrics
        scheduled_count = len(result.scheduled_lessons)
        unscheduled_count = len(result.unscheduled_students)
        success_rate = (scheduled_count / total_students * 100) if total_students > 0 else 0
        
        # Print results summary
        print(f"\n📊 RESULTS SUMMARY:")
        print(f"   Total Students: {total_students}")
        print(f"   ✅ Scheduled: {scheduled_count} ({success_rate:.1f}%)")
        print(f"   ❌ Unscheduled: {unscheduled_count}")
        print(f"   ⏱️ Solve Time: {end_time - start_time:.3f}s")
        
        if result.scheduled_lessons:
            print(f"\n📅 SCHEDULED LESSONS:")
            for lesson in result.scheduled_lessons[:5]:  # Show first 5
                print(f"   {lesson.day.title()} {lesson.start_time}-{lesson.end_time}: {lesson.student} at {lesson.location} ({lesson.duration}min)")
            if len(result.scheduled_lessons) > 5:
                print(f"   ... and {len(result.scheduled_lessons) - 5} more")
        
        if result.conflicts:
            print(f"\n⚠️  CONFLICTS:")
            for conflict in result.conflicts[:3]:  # Show first 3
                print(f"   {conflict.student}: {conflict.description}")
            if len(result.conflicts) > 3:
                print(f"   ... and {len(result.conflicts) - 3} more conflicts")
        
        # Determine if test met expectations
        test_passed = "UNKNOWN"
        if "SHOULD FULLY SOLVE" in expected_result.upper():
            test_passed = "PASS" if scheduled_count == total_students else "FAIL"
        elif "SHOULD PARTIALLY SOLVE" in expected_result.upper():
            test_passed = "PASS" if 0 < scheduled_count < total_students else "FAIL"
        elif "SHOULD MOSTLY FAIL" in expected_result.upper():
            test_passed = "PASS" if scheduled_count <= 2 else "FAIL"
        else:
            # For scenarios without explicit expectation, consider successful if all scheduled
            test_passed = "PASS" if scheduled_count == total_students else "PARTIAL"
        
        print(f"\n🎯 TEST RESULT: {test_passed}")
        
        return {
            'test_name': test_file_path.stem,
            'description': test_description,
            'expected_result': expected_result,
            'total_students': total_students,
            'scheduled_count': scheduled_count,
            'unscheduled_count': unscheduled_count,
            'success_rate': success_rate,
            'solve_time': end_time - start_time,
            'test_passed': test_passed,
            'conflicts': [
                {
                    'student': c.student,
                    'reason_type': c.reason_type,
                    'description': c.description
                }
                for c in (result.conflicts[:5] if result.conflicts else [])
            ],
            'scheduled_lessons': [
                {
                    'day': l.day,
                    'time': f"{l.start_time}-{l.end_time}",
                    'student': l.student,
                    'location': l.location,
                    'duration': l.duration
                }
                for l in result.scheduled_lessons[:10]  # Save first 10
            ],
            'statistics': result.statistics
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'test_name': test_file_path.stem,
            'description': test_description,
            'expected_result': expected_result,
            'error': str(e),
            'test_passed': 'ERROR'
        }


def main():
    """Run all test scenarios and compile comprehensive results."""
    print("🚀 Starting comprehensive scheduling algorithm test suite...")
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Find all test files
    test_dir = Path('test_scenarios')
    test_files = sorted(test_dir.glob('test_*.json'))
    
    print(f"\n📝 Found {len(test_files)} test scenarios")
    
    all_results = []
    start_time = time.time()
    
    # Run each test
    for i, test_file in enumerate(test_files, 1):
        print(f"\n\n🔄 Progress: {i}/{len(test_files)}")
        result = run_single_test(test_file)
        all_results.append(result)
        
        # Brief pause between tests
        time.sleep(0.1)
    
    total_time = time.time() - start_time
    
    # Generate comprehensive summary
    print(f"\n\n{'='*100}")
    print("📈 COMPREHENSIVE TEST SUITE RESULTS")
    print(f"{'='*100}")
    
    # Summary statistics
    total_tests = len(all_results)
    passed_tests = len([r for r in all_results if r.get('test_passed') == 'PASS'])
    failed_tests = len([r for r in all_results if r.get('test_passed') == 'FAIL'])
    error_tests = len([r for r in all_results if r.get('test_passed') == 'ERROR'])
    
    print(f"\n🎯 OVERALL RESULTS:")
    print(f"   Total Tests: {total_tests}")
    print(f"   ✅ Passed: {passed_tests} ({passed_tests/total_tests*100:.1f}%)")
    print(f"   ❌ Failed: {failed_tests} ({failed_tests/total_tests*100:.1f}%)")
    print(f"   🚫 Errors: {error_tests} ({error_tests/total_tests*100:.1f}%)")
    print(f"   ⏱️ Total Time: {total_time:.2f}s")
    
    # Performance metrics
    valid_results = [r for r in all_results if 'total_students' in r]
    if valid_results:
        avg_students = sum(r['total_students'] for r in valid_results) / len(valid_results)
        avg_success_rate = sum(r['success_rate'] for r in valid_results) / len(valid_results)
        avg_solve_time = sum(r['solve_time'] for r in valid_results) / len(valid_results)
        
        print(f"\n📊 PERFORMANCE METRICS:")
        print(f"   Average Students per Test: {avg_students:.1f}")
        print(f"   Average Success Rate: {avg_success_rate:.1f}%")
        print(f"   Average Solve Time: {avg_solve_time:.3f}s")
    
    # Test category breakdown
    categories = {
        'Fully Solvable': [r for r in valid_results if 'FULLY SOLVE' in r.get('expected_result', '').upper()],
        'Partially Solvable': [r for r in valid_results if 'PARTIALLY SOLVE' in r.get('expected_result', '').upper()],
        'Edge Cases': [r for r in valid_results if any(keyword in r.get('expected_result', '').upper() for keyword in ['MOSTLY FAIL', 'STRESS', 'EDGE'])],
    }
    
    print(f"\n📂 CATEGORY BREAKDOWN:")
    for category, tests in categories.items():
        if tests:
            passed = len([t for t in tests if t.get('test_passed') == 'PASS'])
            avg_rate = sum(t['success_rate'] for t in tests) / len(tests)
            print(f"   {category}: {passed}/{len(tests)} passed, {avg_rate:.1f}% avg success rate")
    
    # Detailed results table
    print(f"\n📋 DETAILED RESULTS:")
    print(f"{'Test':<25} {'Students':<8} {'Scheduled':<9} {'Rate':<6} {'Time':<8} {'Result':<6}")
    print("-" * 70)
    
    for result in all_results:
        if 'total_students' in result:
            name = result['test_name'][:24]
            students = result['total_students']
            scheduled = result['scheduled_count']
            rate = f"{result['success_rate']:.1f}%"
            solve_time = f"{result['solve_time']:.3f}s"
            status = result['test_passed']
            print(f"{name:<25} {students:<8} {scheduled:<9} {rate:<6} {solve_time:<8} {status:<6}")
        else:
            name = result['test_name'][:24]
            print(f"{name:<25} ERROR")
    
    # Save detailed results to JSON
    output_file = f"test_results_{time.strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump({
            'summary': {
                'total_tests': total_tests,
                'passed_tests': passed_tests,
                'failed_tests': failed_tests,
                'error_tests': error_tests,
                'total_time': total_time,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'results': all_results
        }, f, indent=2)
    
    print(f"\n💾 Detailed results saved to: {output_file}")
    print(f"\n🏁 Test suite completed in {total_time:.2f}s")


if __name__ == '__main__':
    main()