#!/usr/bin/env python3
"""
Enhanced test runner specifically for edge case analysis.
Provides detailed conflict analysis and algorithm behavior insights.
"""

import json
import time
import os
from pathlib import Path
from scheduler import LessonScheduler
from models import SchedulingData
from conflict_analyzer import ConflictAnalyzer
from collections import defaultdict
import traceback


class EdgeCaseAnalyzer:
    """Analyzes edge case test results and provides detailed insights."""
    
    def __init__(self):
        self.results = []
        self.category_stats = defaultdict(list)
        self.failure_patterns = defaultdict(list)
        
    def analyze_result(self, result):
        """Analyze a single test result for patterns and insights."""
        category = result.get('_edge_case_type', 'unknown')
        self.category_stats[category].append(result)
        
        # Track failure patterns
        if result.get('test_passed') == 'FAIL':
            self.failure_patterns[category].append(result)
            
        # Analyze conflict types
        if 'conflicts' in result:
            for conflict in result['conflicts']:
                conflict_type = conflict.get('reason_type', 'unknown')
                if conflict_type not in result:
                    result[f'conflict_{conflict_type}_count'] = 0
                result[f'conflict_{conflict_type}_count'] += 1
                
        return result
    
    def generate_insights(self):
        """Generate comprehensive insights from all test results."""
        insights = {
            'total_tests': len(self.results),
            'category_performance': {},
            'failure_analysis': {},
            'algorithm_weaknesses': [],
            'conflict_patterns': defaultdict(int),
            'performance_metrics': {}
        }
        
        # Category performance analysis
        for category, tests in self.category_stats.items():
            passed = len([t for t in tests if t.get('test_passed') == 'PASS'])
            total = len(tests)
            avg_success_rate = sum(t.get('success_rate', 0) for t in tests) / total if total > 0 else 0
            avg_solve_time = sum(t.get('solve_time', 0) for t in tests) / total if total > 0 else 0
            
            insights['category_performance'][category] = {
                'tests_passed': passed,
                'total_tests': total,
                'pass_rate': (passed / total * 100) if total > 0 else 0,
                'avg_success_rate': avg_success_rate,
                'avg_solve_time': avg_solve_time
            }
        
        # Failure pattern analysis
        for category, failures in self.failure_patterns.items():
            if failures:
                common_conflicts = defaultdict(int)
                for failure in failures:
                    for conflict in failure.get('conflicts', []):
                        common_conflicts[conflict.get('reason_type', 'unknown')] += 1
                
                insights['failure_analysis'][category] = {
                    'failure_count': len(failures),
                    'common_conflicts': dict(common_conflicts),
                    'example_failures': [f['test_name'] for f in failures[:3]]
                }
        
        # Algorithm weakness detection
        algorithm_weaknesses = []
        
        # Check for categories with low pass rates
        for category, perf in insights['category_performance'].items():
            if perf['pass_rate'] < 50:
                algorithm_weaknesses.append(f"Low pass rate ({perf['pass_rate']:.1f}%) in {category}")
        
        # Check for consistently slow solve times
        slow_categories = [cat for cat, perf in insights['category_performance'].items() 
                          if perf['avg_solve_time'] > 1.0]
        if slow_categories:
            algorithm_weaknesses.append(f"Slow solve times in: {', '.join(slow_categories)}")
        
        insights['algorithm_weaknesses'] = algorithm_weaknesses
        
        return insights


def run_edge_case_test(test_file_path):
    """Run a single edge case test with detailed analysis."""
    print(f"\n{'='*80}")
    print(f"RUNNING EDGE CASE: {test_file_path.name}")
    print(f"{'='*80}")
    
    try:
        # Load test data
        with open(test_file_path, 'r') as f:
            test_data = json.load(f)
        
        test_description = test_data.get('_test_description', 'No description')
        expected_result = test_data.get('_expected_result', 'No expectation')
        edge_case_type = test_data.get('_edge_case_type', 'unknown')
        
        print(f"Type: {edge_case_type}")
        print(f"Description: {test_description}")
        print(f"Expected: {expected_result}")
        
        # Load scheduling data
        data = SchedulingData.from_json_file(test_file_path)
        total_students = len(data.students)
        total_teacher_hours = sum(
            (tw.end_minutes - tw.start_minutes) / 60 
            for tw in data.teacher.availability
        )
        
        print(f"Students: {total_students}, Teacher Hours: {total_teacher_hours:.1f}")
        
        # Run scheduler
        start_time = time.time()
        scheduler = LessonScheduler(data)
        result = scheduler.create_schedule()
        solve_time = time.time() - start_time
        
        # Analyze conflicts
        if result.unscheduled_students:
            analyzer = ConflictAnalyzer(data)
            result = analyzer.analyze_conflicts(result)
        
        # Calculate metrics
        scheduled_count = len(result.scheduled_lessons)
        unscheduled_count = len(result.unscheduled_students)
        success_rate = (scheduled_count / total_students * 100) if total_students > 0 else 0
        
        # Determine test outcome
        test_passed = "UNKNOWN"
        if "SHOULD FULLY SOLVE" in expected_result.upper():
            test_passed = "PASS" if scheduled_count == total_students else "FAIL"
        elif "SHOULD PARTIALLY SOLVE" in expected_result.upper():
            test_passed = "PASS" if 0 < scheduled_count < total_students else "FAIL"
        elif "SHOULD MOSTLY FAIL" in expected_result.upper():
            test_passed = "PASS" if scheduled_count <= 2 else "FAIL"
        else:
            # For edge cases, consider partial success acceptable
            test_passed = "PASS" if scheduled_count > 0 else "FAIL"
        
        # Print results
        print(f"\n📊 RESULTS:")
        print(f"   ✅ Scheduled: {scheduled_count}/{total_students} ({success_rate:.1f}%)")
        print(f"   ❌ Unscheduled: {unscheduled_count}")
        print(f"   ⏱️ Solve Time: {solve_time:.3f}s")
        print(f"   🎯 Test Result: {test_passed}")
        
        if result.scheduled_lessons:
            print(f"\n📅 SCHEDULED LESSONS (first 3):")
            for lesson in result.scheduled_lessons[:3]:
                print(f"   {lesson.day.title()} {lesson.start_time}-{lesson.end_time}: "
                      f"{lesson.student} at {lesson.location} ({lesson.duration}min)")
            if len(result.scheduled_lessons) > 3:
                print(f"   ... and {len(result.scheduled_lessons) - 3} more")
        
        if result.conflicts:
            print(f"\n⚠️  CONFLICTS (first 3):")
            for conflict in result.conflicts[:3]:
                print(f"   {conflict.student}: {conflict.reason_type}")
                print(f"      {conflict.description}")
            if len(result.conflicts) > 3:
                print(f"   ... and {len(result.conflicts) - 3} more conflicts")
        
        # Analyze edge case specific insights
        print(f"\n🔍 EDGE CASE ANALYSIS:")
        edge_insights = analyze_edge_case_behavior(data, result, edge_case_type)
        for insight in edge_insights:
            print(f"   • {insight}")
        
        return {
            'test_name': test_file_path.stem,
            'description': test_description,
            'expected_result': expected_result,
            '_edge_case_type': edge_case_type,
            'total_students': total_students,
            'scheduled_count': scheduled_count,
            'unscheduled_count': unscheduled_count,
            'success_rate': success_rate,
            'solve_time': solve_time,
            'test_passed': test_passed,
            'teacher_hours': total_teacher_hours,
            'conflicts': [
                {
                    'student': c.student,
                    'reason_type': c.reason_type,
                    'description': c.description,
                    'suggestions': c.suggestions[:2]  # First 2 suggestions
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
                for l in result.scheduled_lessons[:5]  # First 5 lessons
            ],
            'statistics': result.statistics,
            'edge_insights': edge_insights
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        traceback.print_exc()
        
        return {
            'test_name': test_file_path.stem,
            'description': test_description if 'test_description' in locals() else 'Unknown',
            'expected_result': expected_result if 'expected_result' in locals() else 'Unknown',
            '_edge_case_type': edge_case_type if 'edge_case_type' in locals() else 'unknown',
            'error': str(e),
            'test_passed': 'ERROR'
        }


def analyze_edge_case_behavior(data, result, edge_case_type):
    """Analyze algorithm behavior specific to edge case type."""
    insights = []
    
    if edge_case_type == "time_overlap_complexity":
        # Analyze time overlap handling
        if result.scheduled_lessons:
            gaps = calculate_scheduling_gaps(result.scheduled_lessons)
            insights.append(f"Average gap between lessons: {gaps['avg_gap']:.1f} minutes")
            insights.append(f"Total wasted time: {gaps['total_waste']:.1f} minutes")
        
        overlaps = count_student_availability_overlaps(data.students)
        insights.append(f"Student availability overlaps detected: {overlaps}")
    
    elif edge_case_type == "location_constraint_conflict":
        # Analyze location switching efficiency
        location_switches = count_location_switches(result.scheduled_lessons)
        insights.append(f"Teacher location switches required: {location_switches}")
        
        location_usage = defaultdict(int)
        for lesson in result.scheduled_lessons:
            location_usage[lesson.location] += 1
        insights.append(f"Location usage distribution: {dict(location_usage)}")
    
    elif edge_case_type == "duration_based_conflict":
        # Analyze duration fitting efficiency
        duration_stats = analyze_lesson_durations(result.scheduled_lessons)
        insights.append(f"Duration variance: {duration_stats['variance']:.1f} minutes")
        insights.append(f"Average lesson duration: {duration_stats['avg']:.1f} minutes")
    
    elif edge_case_type == "optimization_challenge":
        # Analyze optimization quality
        efficiency = calculate_schedule_efficiency(data, result)
        insights.append(f"Schedule efficiency score: {efficiency:.2f}")
        
        if result.statistics.get('status') == 'OPTIMAL':
            insights.append("Algorithm found optimal solution")
        else:
            insights.append("Algorithm found feasible but possibly sub-optimal solution")
    
    return insights


def calculate_scheduling_gaps(lessons):
    """Calculate gaps between consecutive lessons."""
    if len(lessons) < 2:
        return {'avg_gap': 0, 'total_waste': 0}
    
    # Group by day and location
    day_location_lessons = defaultdict(list)
    for lesson in lessons:
        key = (lesson.day, lesson.location)
        day_location_lessons[key].append(lesson)
    
    total_gap = 0
    gap_count = 0
    
    for lessons_group in day_location_lessons.values():
        if len(lessons_group) < 2:
            continue
            
        # Sort by start time
        sorted_lessons = sorted(lessons_group, key=lambda x: x.start_time)
        
        for i in range(len(sorted_lessons) - 1):
            current_end = time_to_minutes(sorted_lessons[i].end_time)
            next_start = time_to_minutes(sorted_lessons[i + 1].start_time)
            gap = next_start - current_end
            if gap > 0:
                total_gap += gap
                gap_count += 1
    
    return {
        'avg_gap': total_gap / gap_count if gap_count > 0 else 0,
        'total_waste': total_gap
    }


def count_student_availability_overlaps(students):
    """Count how many students have overlapping availability."""
    overlaps = 0
    for i, student1 in enumerate(students):
        for j, student2 in enumerate(students[i+1:], i+1):
            for window1 in student1.availability:
                for window2 in student2.availability:
                    if window1.overlaps_with(window2):
                        overlaps += 1
                        break
    return overlaps


def count_location_switches(lessons):
    """Count how many times teacher needs to switch locations."""
    if len(lessons) < 2:
        return 0
    
    # Sort lessons by day and time
    sorted_lessons = sorted(lessons, key=lambda x: (x.day, x.start_time))
    
    switches = 0
    current_location = None
    current_day = None
    
    for lesson in sorted_lessons:
        if current_day != lesson.day:
            current_day = lesson.day
            current_location = lesson.location
        elif current_location != lesson.location:
            switches += 1
            current_location = lesson.location
    
    return switches


def analyze_lesson_durations(lessons):
    """Analyze lesson duration statistics."""
    if not lessons:
        return {'avg': 0, 'variance': 0}
    
    durations = [lesson.duration for lesson in lessons]
    avg_duration = sum(durations) / len(durations)
    variance = sum((d - avg_duration) ** 2 for d in durations) / len(durations)
    
    return {'avg': avg_duration, 'variance': variance}


def calculate_schedule_efficiency(data, result):
    """Calculate overall scheduling efficiency score."""
    total_students = len(data.students)
    scheduled_students = len(result.scheduled_lessons)
    
    if total_students == 0:
        return 0
    
    # Base efficiency: percentage of students scheduled
    base_efficiency = scheduled_students / total_students
    
    # Penalty for gaps and location switches
    gap_penalty = 0
    if result.scheduled_lessons:
        gaps = calculate_scheduling_gaps(result.scheduled_lessons)
        gap_penalty = min(gaps['total_waste'] / 120, 0.2)  # Max 20% penalty
    
    location_penalty = 0
    switches = count_location_switches(result.scheduled_lessons)
    location_penalty = min(switches * 0.05, 0.2)  # 5% penalty per switch, max 20%
    
    efficiency = base_efficiency - gap_penalty - location_penalty
    return max(efficiency, 0)


def time_to_minutes(time_str):
    """Convert HH:MM to minutes since midnight."""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes


def main():
    """Run all edge case tests and generate comprehensive analysis."""
    print("🚀 Starting comprehensive edge case analysis...")
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Find edge case test files
    test_dir = Path('test_scenarios')
    edge_test_files = sorted(test_dir.glob('test_edge_*.json'))
    
    print(f"\n📝 Found {len(edge_test_files)} edge case scenarios")
    
    analyzer = EdgeCaseAnalyzer()
    start_time = time.time()
    
    # Run each edge case test
    for i, test_file in enumerate(edge_test_files, 1):
        print(f"\n\n🔄 Progress: {i}/{len(edge_test_files)}")
        result = run_edge_case_test(test_file)
        analyzed_result = analyzer.analyze_result(result)
        analyzer.results.append(analyzed_result)
        
        time.sleep(0.1)  # Brief pause
    
    total_time = time.time() - start_time
    
    # Generate comprehensive insights
    print(f"\n\n{'='*100}")
    print("🧠 EDGE CASE ANALYSIS INSIGHTS")
    print(f"{'='*100}")
    
    insights = analyzer.generate_insights()
    
    # Print category performance
    print(f"\n📊 CATEGORY PERFORMANCE:")
    for category, perf in insights['category_performance'].items():
        print(f"   {category.replace('_', ' ').title()}:")
        print(f"      Pass Rate: {perf['pass_rate']:.1f}% ({perf['tests_passed']}/{perf['total_tests']})")
        print(f"      Avg Success Rate: {perf['avg_success_rate']:.1f}%")
        print(f"      Avg Solve Time: {perf['avg_solve_time']:.3f}s")
    
    # Print algorithm weaknesses
    if insights['algorithm_weaknesses']:
        print(f"\n⚠️  ALGORITHM WEAKNESSES DETECTED:")
        for weakness in insights['algorithm_weaknesses']:
            print(f"   • {weakness}")
    
    # Print failure analysis
    if insights['failure_analysis']:
        print(f"\n🔍 FAILURE PATTERN ANALYSIS:")
        for category, analysis in insights['failure_analysis'].items():
            print(f"   {category.replace('_', ' ').title()}:")
            print(f"      Failures: {analysis['failure_count']}")
            print(f"      Common conflicts: {analysis['common_conflicts']}")
    
    # Overall summary
    total_tests = insights['total_tests']
    passed_tests = len([r for r in analyzer.results if r.get('test_passed') == 'PASS'])
    failed_tests = len([r for r in analyzer.results if r.get('test_passed') == 'FAIL'])
    error_tests = len([r for r in analyzer.results if r.get('test_passed') == 'ERROR'])
    
    print(f"\n🎯 OVERALL EDGE CASE RESULTS:")
    print(f"   Total Tests: {total_tests}")
    print(f"   ✅ Passed: {passed_tests} ({passed_tests/total_tests*100:.1f}%)")
    print(f"   ❌ Failed: {failed_tests} ({failed_tests/total_tests*100:.1f}%)")
    print(f"   🚫 Errors: {error_tests} ({error_tests/total_tests*100:.1f}%)")
    print(f"   ⏱️ Total Time: {total_time:.2f}s")
    
    # Save detailed results
    output_file = f"edge_case_results_{time.strftime('%Y%m%d_%H%M%S')}.json"
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
            'insights': insights,
            'results': analyzer.results
        }, f, indent=2)
    
    print(f"\n💾 Detailed edge case analysis saved to: {output_file}")
    print(f"\n🏁 Edge case analysis completed in {total_time:.2f}s")


if __name__ == '__main__':
    main()