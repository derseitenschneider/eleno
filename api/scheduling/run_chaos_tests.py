#!/usr/bin/env python3
"""
Chaos Engineering Test Runner for Scheduling Algorithm

Executes pathological test scenarios and collects detailed failure analysis data.
"""

import json
import time
import os
from typing import Dict, List, Any, Tuple
from datetime import datetime
import glob
from dataclasses import asdict

from scheduler import LessonScheduler
from scheduler_enhanced import EnhancedLessonScheduler
from models import SchedulingData, Student, TimeWindow, TeacherSchedule, Location, TeacherBreakConfig
from conflict_analyzer import ConflictAnalyzer


class ChaosTestRunner:
    """Runs chaos tests and analyzes algorithmic failures."""
    
    def __init__(self):
        self.results = []
        self.test_scenarios = []
        self.start_time = None
        
    def load_chaos_scenarios(self) -> List[str]:
        """Load all chaos test scenario files."""
        chaos_files = glob.glob('test_scenarios/test_chaos_*.json')
        chaos_files.sort()  # Ensure consistent ordering
        return chaos_files
    
    def parse_scenario(self, filepath: str) -> Tuple[SchedulingData, Dict[str, Any]]:
        """Parse a test scenario file into SchedulingData and metadata."""
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        # Extract metadata
        metadata = {
            'description': data.get('_test_description', ''),
            'expected_failure': data.get('_expected_failure', ''),
            'pathological_aspect': data.get('_pathological_aspect', ''),
            'file': filepath
        }
        
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
        
        scheduling_data = SchedulingData(
            teacher=teacher,
            students=students,
            locations=locations
        )
        
        return scheduling_data, metadata
    
    def run_single_test(self, filepath: str, use_enhanced: bool = False) -> Dict[str, Any]:
        """Run a single chaos test and collect detailed metrics."""
        print(f"🔥 Running chaos test: {os.path.basename(filepath)}")
        
        scheduling_data, metadata = self.parse_scenario(filepath)
        
        # Choose scheduler
        if use_enhanced:
            scheduler = EnhancedLessonScheduler(scheduling_data)
            scheduler_type = "Enhanced"
        else:
            scheduler = LessonScheduler(scheduling_data)
            scheduler_type = "Standard"
        
        # Capture pre-test state
        total_students = len(scheduling_data.students)
        total_availability_windows = sum(len(s.availability) for s in scheduling_data.students)
        
        # Run scheduling with detailed timing
        start_time = time.time()
        try:
            result = scheduler.create_schedule()
            end_time = time.time()
            
            solve_time = end_time - start_time
            scheduled_count = len(result.scheduled_lessons)
            success_rate = scheduled_count / total_students if total_students > 0 else 0
            
            # Analyze conflicts if any students failed to schedule
            unscheduled_students = [
                s for s in scheduling_data.students 
                if s.name not in [lesson.student_name for lesson in result.scheduled_lessons]
            ]
            
            conflict_analysis = {}
            if unscheduled_students:
                analyzer = ConflictAnalyzer(scheduling_data)
                conflict_analysis = analyzer.analyze_conflicts()
            
            # Collect detailed metrics
            test_result = {
                'test_file': os.path.basename(filepath),
                'scheduler_type': scheduler_type,
                'metadata': metadata,
                'execution': {
                    'solve_time_seconds': solve_time,
                    'status': result.status,
                    'solver_iterations': getattr(scheduler.solver, 'num_search_workers', 'unknown'),
                },
                'outcomes': {
                    'total_students': total_students,
                    'scheduled_students': scheduled_count,
                    'unscheduled_students': len(unscheduled_students),
                    'success_rate': success_rate,
                    'efficiency_percent': getattr(result, 'schedule_efficiency_percent', 0)
                },
                'lessons_scheduled': [
                    {
                        'student': lesson.student_name,
                        'day': lesson.day,
                        'start_time': lesson.start_time,
                        'end_time': lesson.end_time,
                        'location': lesson.location,
                        'duration_minutes': lesson.duration_minutes
                    } for lesson in result.scheduled_lessons
                ],
                'unscheduled_students': [s.name for s in unscheduled_students],
                'conflict_analysis': conflict_analysis,
                'algorithm_stress_indicators': {
                    'variables_created': getattr(result, 'variables_created', len(scheduler.lesson_vars)),
                    'constraint_density': total_availability_windows / total_students if total_students > 0 else 0,
                    'location_contention': self._calculate_location_contention(scheduling_data),
                    'time_window_overlap_factor': self._calculate_overlap_factor(scheduling_data)
                }
            }
            
            return test_result
            
        except Exception as e:
            end_time = time.time()
            solve_time = end_time - start_time
            
            return {
                'test_file': os.path.basename(filepath),
                'scheduler_type': scheduler_type,
                'metadata': metadata,
                'execution': {
                    'solve_time_seconds': solve_time,
                    'status': 'ERROR',
                    'error': str(e)
                },
                'outcomes': {
                    'total_students': total_students,
                    'scheduled_students': 0,
                    'unscheduled_students': total_students,
                    'success_rate': 0.0,
                    'efficiency_percent': 0
                },
                'algorithm_failure': True
            }
    
    def _calculate_location_contention(self, data: SchedulingData) -> float:
        """Calculate average students per location per time slot."""
        location_demands = {}
        
        for student in data.students:
            for window in student.availability:
                key = f"{window.location}_{window.day}_{window.start_minutes}"
                if key not in location_demands:
                    location_demands[key] = 0
                location_demands[key] += 1
        
        if not location_demands:
            return 0.0
        
        return sum(location_demands.values()) / len(location_demands)
    
    def _calculate_overlap_factor(self, data: SchedulingData) -> float:
        """Calculate how many windows overlap on average."""
        overlaps = 0
        total_comparisons = 0
        
        for i, student1 in enumerate(data.students):
            for j, student2 in enumerate(data.students[i+1:], i+1):
                for window1 in student1.availability:
                    for window2 in student2.availability:
                        total_comparisons += 1
                        if (window1.day == window2.day and 
                            window1.location == window2.location and
                            window1.overlaps_with(window2)):
                            overlaps += 1
        
        return overlaps / total_comparisons if total_comparisons > 0 else 0.0
    
    def run_all_chaos_tests(self) -> None:
        """Run all chaos tests with both standard and enhanced schedulers."""
        self.start_time = datetime.now()
        chaos_files = self.load_chaos_scenarios()
        
        print(f"🔥 CHAOS ENGINEERING COMMENCED 🔥")
        print(f"Found {len(chaos_files)} chaos test scenarios")
        print(f"Testing both Standard and Enhanced schedulers\n")
        
        for filepath in chaos_files:
            # Test with standard scheduler
            result_standard = self.run_single_test(filepath, use_enhanced=False)
            self.results.append(result_standard)
            
            # Test with enhanced scheduler  
            result_enhanced = self.run_single_test(filepath, use_enhanced=True)
            self.results.append(result_enhanced)
            
            # Show comparison
            self._print_test_comparison(result_standard, result_enhanced)
            print("\n" + "="*80 + "\n")
    
    def _print_test_comparison(self, standard_result: Dict, enhanced_result: Dict) -> None:
        """Print a comparison of standard vs enhanced results."""
        test_name = standard_result['test_file']
        std_scheduled = standard_result['outcomes']['scheduled_students']
        std_total = standard_result['outcomes']['total_students']
        enh_scheduled = enhanced_result['outcomes']['scheduled_students']
        enh_total = enhanced_result['outcomes']['total_students']
        
        print(f"📊 {test_name}")
        print(f"   Standard: {std_scheduled}/{std_total} ({std_scheduled/std_total*100:.1f}%)")
        print(f"   Enhanced: {enh_scheduled}/{enh_total} ({enh_scheduled/enh_total*100:.1f}%)")
        
        if enh_scheduled > std_scheduled:
            print(f"   ✅ Enhanced +{enh_scheduled - std_scheduled} students")
        elif std_scheduled > enh_scheduled:
            print(f"   ⚠️  Standard +{std_scheduled - enh_scheduled} students")
        else:
            print(f"   🟰 Tied performance")
    
    def save_results(self) -> str:
        """Save all test results to JSON file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"chaos_test_results_{timestamp}.json"
        
        output_data = {
            'chaos_test_session': {
                'timestamp': self.start_time.isoformat(),
                'total_scenarios': len(self.load_chaos_scenarios()),
                'total_tests_run': len(self.results),
                'summary_stats': self._generate_summary_stats()
            },
            'test_results': self.results
        }
        
        with open(filename, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        print(f"📄 Results saved to: {filename}")
        return filename
    
    def _generate_summary_stats(self) -> Dict[str, Any]:
        """Generate summary statistics across all tests."""
        if not self.results:
            return {}
        
        standard_results = [r for r in self.results if r['scheduler_type'] == 'Standard']
        enhanced_results = [r for r in self.results if r['scheduler_type'] == 'Enhanced']
        
        def calc_stats(results):
            if not results:
                return {}
            success_rates = [r['outcomes']['success_rate'] for r in results]
            solve_times = [r['execution']['solve_time_seconds'] for r in results]
            
            return {
                'avg_success_rate': sum(success_rates) / len(success_rates),
                'min_success_rate': min(success_rates),
                'max_success_rate': max(success_rates),
                'avg_solve_time': sum(solve_times) / len(solve_times),
                'max_solve_time': max(solve_times),
                'total_failures': len([r for r in results if r['outcomes']['success_rate'] < 0.5])
            }
        
        return {
            'standard_scheduler': calc_stats(standard_results),
            'enhanced_scheduler': calc_stats(enhanced_results)
        }
    
    def analyze_failures(self) -> Dict[str, Any]:
        """Analyze failure patterns across all chaos tests."""
        failure_analysis = {
            'critical_failures': [],
            'algorithmic_weaknesses': {},
            'performance_issues': [],
            'fairness_violations': []
        }
        
        for result in self.results:
            success_rate = result['outcomes']['success_rate']
            solve_time = result['execution']['solve_time_seconds']
            
            # Critical failures (< 50% success rate)
            if success_rate < 0.5:
                failure_analysis['critical_failures'].append({
                    'test': result['test_file'],
                    'scheduler': result['scheduler_type'],
                    'success_rate': success_rate,
                    'pathological_aspect': result['metadata']['pathological_aspect'],
                    'expected_failure': result['metadata']['expected_failure']
                })
            
            # Performance issues (> 5 seconds)
            if solve_time > 5.0:
                failure_analysis['performance_issues'].append({
                    'test': result['test_file'],
                    'scheduler': result['scheduler_type'],
                    'solve_time': solve_time,
                    'complexity_indicators': result.get('algorithm_stress_indicators', {})
                })
        
        return failure_analysis


def main():
    """Main execution function."""
    runner = ChaosTestRunner()
    
    print("🎯 CHAOS ENGINEERING: Scheduling Algorithm Stress Test")
    print("="*60)
    
    # Run all chaos tests
    runner.run_all_chaos_tests()
    
    # Save results
    results_file = runner.save_results()
    
    # Generate failure analysis
    failure_analysis = runner.analyze_failures()
    
    # Print summary
    print("\n🔥 CHAOS TEST SUMMARY 🔥")
    print(f"Critical Failures: {len(failure_analysis['critical_failures'])}")
    print(f"Performance Issues: {len(failure_analysis['performance_issues'])}")
    
    # Save failure analysis
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    analysis_file = f"chaos_failure_analysis_{timestamp}.json"
    with open(analysis_file, 'w') as f:
        json.dump(failure_analysis, f, indent=2)
    
    print(f"📊 Failure analysis saved to: {analysis_file}")
    print("\n🎯 Ready for algorithmic improvements!")


if __name__ == "__main__":
    main()