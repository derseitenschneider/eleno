#!/usr/bin/env python3
"""
Comprehensive regression test framework for algorithm improvements.
Runs all 61 test scenarios and detects any performance degradation.

Usage:
    python run_regression_tests.py --baseline           # Capture baseline
    python run_regression_tests.py --test               # Run regression tests
    python run_regression_tests.py --compare            # Compare schedulers
"""

import json
import time
import glob
import argparse
from typing import Dict, List, Any, Tuple
from datetime import datetime
from dataclasses import dataclass

from scheduler import LessonScheduler
from scheduler_hardened import HardenedLessonScheduler
from models import SchedulingData, Student, TimeWindow, TeacherSchedule, Location, TeacherBreakConfig


@dataclass
class TestResult:
    """Result of a single test scenario."""
    scenario: str
    total_students: int
    scheduled_students: int
    success_rate: float
    solve_time: float
    status: str
    error_message: str = ""


class RegressionTestSuite:
    """Comprehensive test suite for algorithm regression testing."""
    
    def __init__(self):
        self.test_scenarios = self._load_all_scenarios()
        self.baseline_metrics = {}
        
    def _load_all_scenarios(self) -> Dict[str, List[str]]:
        """Load all test scenario files by category."""
        scenarios = {
            'basic': sorted(glob.glob('test_scenarios/test_[0-9][0-9]_*.json')),
            'edge': sorted(glob.glob('test_scenarios/test_edge_*.json')),
            'chaos': sorted(glob.glob('test_scenarios/test_chaos_*.json')),
            'break': sorted(glob.glob('test_scenarios/test_break*.json')),
            'priority': sorted(glob.glob('test_scenarios/test_priority*.json')),
            'examples': sorted(glob.glob('examples/*.json'))
        }
        
        # Filter out empty categories
        return {k: v for k, v in scenarios.items() if v}
    
    def capture_baseline(self, scheduler_class=LessonScheduler):
        """Capture baseline performance metrics."""
        print("📊 Capturing baseline metrics...")
        print(f"Using scheduler: {scheduler_class.__name__}")
        
        self.baseline_metrics = {}
        total_scenarios = sum(len(scenarios) for scenarios in self.test_scenarios.values())
        current_scenario = 0
        
        for category, scenarios in self.test_scenarios.items():
            print(f"\\n🔍 Testing {category} scenarios ({len(scenarios)} files)...")
            self.baseline_metrics[category] = {}
            
            for scenario_file in scenarios:
                current_scenario += 1
                scenario_name = scenario_file.split('/')[-1]
                print(f"[{current_scenario}/{total_scenarios}] {scenario_name}", end="... ")
                
                result = self._run_single_test(scenario_file, scheduler_class)
                self.baseline_metrics[category][scenario_name] = result
                
                if result.status == 'success':
                    print(f"✅ {result.success_rate:.1f}% ({result.solve_time:.3f}s)")
                else:
                    print(f"❌ {result.status}")
        
        # Save baseline to file
        baseline_data = self._serialize_results(self.baseline_metrics)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        baseline_file = f"baseline_metrics_{timestamp}.json"
        
        with open(baseline_file, 'w') as f:
            json.dump(baseline_data, f, indent=2)
        
        print(f"\\n✅ Baseline captured: {total_scenarios} scenarios")
        print(f"📄 Saved to: {baseline_file}")
        
        return baseline_file
    
    def load_baseline(self, baseline_file: str):
        """Load baseline metrics from file."""
        try:
            with open(baseline_file, 'r') as f:
                data = json.load(f)
            
            self.baseline_metrics = {}
            for category, scenarios in data.items():
                self.baseline_metrics[category] = {}
                for scenario_name, result_data in scenarios.items():
                    self.baseline_metrics[category][scenario_name] = TestResult(**result_data)
            
            print(f"📊 Baseline loaded from {baseline_file}")
            return True
            
        except FileNotFoundError:
            print(f"❌ Baseline file not found: {baseline_file}")
            return False
        except Exception as e:
            print(f"❌ Error loading baseline: {e}")
            return False
    
    def run_regression_tests(self, test_scheduler_class, baseline_file: str = None):
        """Run full regression suite and detect degradation."""
        print("🧪 Running comprehensive regression tests...")
        print(f"Using scheduler: {test_scheduler_class.__name__}")
        
        # Load baseline if provided
        if baseline_file and not self.load_baseline(baseline_file):
            print("❌ Cannot proceed without baseline metrics")
            return False
        
        results = {}
        regressions_detected = []
        improvements_found = []
        errors_found = []
        
        total_scenarios = sum(len(scenarios) for scenarios in self.test_scenarios.values())
        current_scenario = 0
        
        for category, scenarios in self.test_scenarios.items():
            print(f"\\n🔍 Testing {category} scenarios ({len(scenarios)} files)...")
            results[category] = {}
            
            for scenario_file in scenarios:
                current_scenario += 1
                scenario_name = scenario_file.split('/')[-1]
                print(f"[{current_scenario}/{total_scenarios}] {scenario_name}", end="... ")
                
                # Run improved algorithm
                new_result = self._run_single_test(scenario_file, test_scheduler_class)
                results[category][scenario_name] = new_result
                
                if new_result.status == 'success':
                    print(f"✅ {new_result.success_rate:.1f}% ({new_result.solve_time:.3f}s)", end="")
                else:
                    print(f"❌ {new_result.status}", end="")
                    errors_found.append((scenario_name, new_result.error_message))
                
                # Compare against baseline if available
                if (category in self.baseline_metrics and 
                    scenario_name in self.baseline_metrics[category]):
                    
                    baseline = self.baseline_metrics[category][scenario_name]
                    comparison = self._compare_results(baseline, new_result, scenario_name)
                    
                    if comparison['is_regression']:
                        regressions_detected.append(comparison)
                        print(" 📉 REGRESSION")
                    elif comparison['is_improvement']:
                        improvements_found.append(comparison)
                        print(" 📈 IMPROVED")
                    else:
                        print(" 🟰 STABLE")
                else:
                    print(" 📊 NEW")
        
        # Generate comprehensive report
        success = self._generate_regression_report(
            results, regressions_detected, improvements_found, errors_found,
            test_scheduler_class.__name__
        )
        
        return success
    
    def compare_schedulers(self, scheduler1_class, scheduler2_class):
        """Compare two schedulers side by side."""
        print(f"🔄 Comparing {scheduler1_class.__name__} vs {scheduler2_class.__name__}")
        
        comparison_results = {}
        total_scenarios = sum(len(scenarios) for scenarios in self.test_scenarios.values())
        current_scenario = 0
        
        for category, scenarios in self.test_scenarios.items():
            print(f"\\n🔍 Comparing {category} scenarios...")
            comparison_results[category] = {}
            
            for scenario_file in scenarios:
                current_scenario += 1
                scenario_name = scenario_file.split('/')[-1]
                print(f"[{current_scenario}/{total_scenarios}] {scenario_name}")
                
                # Run both schedulers
                result1 = self._run_single_test(scenario_file, scheduler1_class)
                result2 = self._run_single_test(scenario_file, scheduler2_class)
                
                comparison_results[category][scenario_name] = {
                    'scheduler1': result1,
                    'scheduler2': result2,
                    'winner': self._determine_winner(result1, result2)
                }
                
                print(f"  {scheduler1_class.__name__}: {result1.success_rate:.1f}% ({result1.solve_time:.3f}s)")
                print(f"  {scheduler2_class.__name__}: {result2.success_rate:.1f}% ({result2.solve_time:.3f}s)")
                
                winner = comparison_results[category][scenario_name]['winner']
                if winner == 'tie':
                    print("  🟰 Tie")
                elif winner == 'scheduler1':
                    print(f"  🏆 {scheduler1_class.__name__} wins")
                else:
                    print(f"  🏆 {scheduler2_class.__name__} wins")
        
        # Generate comparison report
        self._generate_comparison_report(comparison_results, scheduler1_class.__name__, scheduler2_class.__name__)
        
        return comparison_results
    
    def _run_single_test(self, scenario_file: str, scheduler_class) -> TestResult:
        """Run a single test scenario and return metrics."""
        try:
            # Parse scenario
            scheduling_data = self._parse_scenario_file(scenario_file)
            
            # Run scheduler with timeout
            start_time = time.time()
            scheduler = scheduler_class(scheduling_data)
            
            # Set reasonable timeout
            if hasattr(scheduler, 'solver'):
                scheduler.solver.parameters.max_time_in_seconds = 30.0
            
            result = scheduler.create_schedule()
            solve_time = time.time() - start_time
            
            # Extract metrics
            total_students = len(scheduling_data.students)
            scheduled_count = len(result.scheduled_lessons)
            success_rate = (scheduled_count / total_students * 100) if total_students > 0 else 0
            
            return TestResult(
                scenario=scenario_file,
                total_students=total_students,
                scheduled_students=scheduled_count,
                success_rate=success_rate,
                solve_time=solve_time,
                status='success'
            )
            
        except Exception as e:
            return TestResult(
                scenario=scenario_file,
                total_students=0,
                scheduled_students=0,
                success_rate=0.0,
                solve_time=0.0,
                status='error',
                error_message=str(e)
            )
    
    def _parse_scenario_file(self, filepath: str) -> SchedulingData:
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
    
    def _compare_results(self, baseline: TestResult, new_result: TestResult, scenario_name: str) -> Dict:
        """Compare two test results and detect regression/improvement."""
        baseline_rate = baseline.success_rate
        new_rate = new_result.success_rate
        
        difference = new_rate - baseline_rate
        percentage_change = (difference / max(baseline_rate, 0.1)) * 100
        
        # Regression criteria: >5% absolute drop OR >10% relative drop
        is_regression = (difference < -5.0) or (percentage_change < -10.0)
        
        # Improvement criteria: >5% absolute gain OR >10% relative gain  
        is_improvement = (difference > 5.0) or (percentage_change > 10.0)
        
        return {
            'scenario': scenario_name,
            'baseline_rate': baseline_rate,
            'new_rate': new_rate,
            'difference': difference,
            'percentage_change': percentage_change,
            'is_regression': is_regression,
            'is_improvement': is_improvement,
            'baseline_time': baseline.solve_time,
            'new_time': new_result.solve_time,
            'time_change': new_result.solve_time - baseline.solve_time
        }
    
    def _determine_winner(self, result1: TestResult, result2: TestResult) -> str:
        """Determine which result is better."""
        # First priority: success rate
        if abs(result1.success_rate - result2.success_rate) > 5.0:
            return 'scheduler1' if result1.success_rate > result2.success_rate else 'scheduler2'
        
        # Second priority: solve time (if success rates similar)
        if abs(result1.solve_time - result2.solve_time) > 0.5:
            return 'scheduler1' if result1.solve_time < result2.solve_time else 'scheduler2'
        
        return 'tie'
    
    def _serialize_results(self, results: Dict) -> Dict:
        """Convert TestResult objects to dictionaries for JSON serialization."""
        serialized = {}
        for category, scenarios in results.items():
            serialized[category] = {}
            for scenario_name, result in scenarios.items():
                serialized[category][scenario_name] = {
                    'scenario': result.scenario,
                    'total_students': result.total_students,
                    'scheduled_students': result.scheduled_students,
                    'success_rate': result.success_rate,
                    'solve_time': result.solve_time,
                    'status': result.status,
                    'error_message': result.error_message
                }
        return serialized
    
    def _count_total_scenarios(self) -> int:
        """Count total number of test scenarios."""
        return sum(len(scenarios) for scenarios in self.test_scenarios.values())
    
    def _generate_regression_report(self, results: Dict, regressions: List, 
                                  improvements: List, errors: List, scheduler_name: str) -> bool:
        """Generate comprehensive regression test report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"regression_test_report_{timestamp}.md"
        
        with open(report_file, 'w') as f:
            f.write("# 📊 Regression Test Report\\n\\n")
            f.write(f"**Date**: {datetime.now().isoformat()}\\n")
            f.write(f"**Scheduler**: {scheduler_name}\\n")
            f.write(f"**Total Scenarios**: {self._count_total_scenarios()}\\n\\n")
            
            # Executive Summary
            f.write("## 🎯 Executive Summary\\n\\n")
            f.write(f"- **Regressions Detected**: {len(regressions)}\\n")
            f.write(f"- **Improvements Found**: {len(improvements)}\\n")
            f.write(f"- **Errors Encountered**: {len(errors)}\\n")
            
            overall_status = "❌ FAIL" if regressions or errors else "✅ PASS"
            f.write(f"- **Overall Status**: {overall_status}\\n\\n")
            
            # Critical Issues
            if regressions:
                f.write("## 🚨 CRITICAL: REGRESSIONS DETECTED\\n\\n")
                f.write("**IMMEDIATE ACTION REQUIRED**: The following scenarios show performance degradation:\\n\\n")
                
                for reg in regressions:
                    f.write(f"### ❌ {reg['scenario']}\\n")
                    f.write(f"- **Baseline**: {reg['baseline_rate']:.1f}%\\n")
                    f.write(f"- **Current**: {reg['new_rate']:.1f}%\\n") 
                    f.write(f"- **Change**: {reg['difference']:+.1f}% ({reg['percentage_change']:+.1f}%)\\n")
                    f.write(f"- **Time Impact**: {reg['time_change']:+.3f}s\\n\\n")
                
                f.write("**🔄 ROLLBACK RECOMMENDED** until regressions are resolved.\\n\\n")
            
            # Errors
            if errors:
                f.write("## ⚠️ ERRORS ENCOUNTERED\\n\\n")
                for scenario_name, error_msg in errors:
                    f.write(f"### {scenario_name}\\n")
                    f.write(f"```\\n{error_msg}\\n```\\n\\n")
            
            # Improvements
            if improvements:
                f.write("## ✅ IMPROVEMENTS FOUND\\n\\n")
                for imp in improvements:
                    f.write(f"### ✅ {imp['scenario']}\\n")
                    f.write(f"- **Baseline**: {imp['baseline_rate']:.1f}%\\n")
                    f.write(f"- **Current**: {imp['new_rate']:.1f}%\\n")
                    f.write(f"- **Improvement**: +{imp['difference']:.1f}% (+{imp['percentage_change']:.1f}%)\\n")
                    f.write(f"- **Time Impact**: {imp['time_change']:+.3f}s\\n\\n")
            
            # Detailed Results by Category
            f.write("## 📊 Detailed Results by Category\\n\\n")
            for category, scenarios in results.items():
                f.write(f"### {category.title()} Tests ({len(scenarios)} scenarios)\\n\\n")
                f.write("| Scenario | Students | Success Rate | Solve Time | Status |\\n")
                f.write("|----------|----------|--------------|------------|--------|\\n")
                
                for scenario_name, result in scenarios.items():
                    students_str = f"{result.scheduled_students}/{result.total_students}"
                    rate = f"{result.success_rate:.1f}%"
                    time_str = f"{result.solve_time:.3f}s"
                    status = result.status
                    
                    f.write(f"| {scenario_name} | {students_str} | {rate} | {time_str} | {status} |\\n")
                f.write("\\n")
        
        print(f"\\n📄 Report generated: {report_file}")
        
        if regressions:
            print("🚨 REGRESSIONS DETECTED - IMMEDIATE ACTION REQUIRED")
            print("📋 See report for details and rollback recommendations")
            return False
        elif errors:
            print("⚠️  ERRORS FOUND - INVESTIGATION REQUIRED")
            return False
        else:
            print("✅ All tests passed - No regressions detected")
            return True
    
    def _generate_comparison_report(self, results: Dict, scheduler1_name: str, scheduler2_name: str):
        """Generate scheduler comparison report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"scheduler_comparison_{timestamp}.md"
        
        scheduler1_wins = 0
        scheduler2_wins = 0
        ties = 0
        
        with open(report_file, 'w') as f:
            f.write(f"# 🔄 Scheduler Comparison Report\\n\\n")
            f.write(f"**Date**: {datetime.now().isoformat()}\\n")
            f.write(f"**Scheduler 1**: {scheduler1_name}\\n")
            f.write(f"**Scheduler 2**: {scheduler2_name}\\n\\n")
            
            # Summary
            for category, scenarios in results.items():
                for scenario_name, comparison in scenarios.items():
                    winner = comparison['winner']
                    if winner == 'scheduler1':
                        scheduler1_wins += 1
                    elif winner == 'scheduler2':
                        scheduler2_wins += 1
                    else:
                        ties += 1
            
            total_scenarios = scheduler1_wins + scheduler2_wins + ties
            
            f.write("## 🏆 Overall Results\\n\\n")
            f.write(f"- **{scheduler1_name} Wins**: {scheduler1_wins}/{total_scenarios} ({scheduler1_wins/total_scenarios*100:.1f}%)\\n")
            f.write(f"- **{scheduler2_name} Wins**: {scheduler2_wins}/{total_scenarios} ({scheduler2_wins/total_scenarios*100:.1f}%)\\n")
            f.write(f"- **Ties**: {ties}/{total_scenarios} ({ties/total_scenarios*100:.1f}%)\\n\\n")
            
            # Detailed comparison
            f.write("## 📊 Detailed Comparison\\n\\n")
            for category, scenarios in results.items():
                f.write(f"### {category.title()} Tests\\n\\n")
                f.write(f"| Scenario | {scheduler1_name} | {scheduler2_name} | Winner |\\n")
                f.write("|----------|-----------|-----------|--------|\\n")
                
                for scenario_name, comparison in scenarios.items():
                    result1 = comparison['scheduler1']
                    result2 = comparison['scheduler2']
                    winner = comparison['winner']
                    
                    rate1 = f"{result1.success_rate:.1f}%"
                    rate2 = f"{result2.success_rate:.1f}%"
                    
                    winner_symbol = "🟰" if winner == "tie" else ("🏆" if winner == "scheduler1" else "🥈")
                    winner_text = f"{winner_symbol} {winner.replace('scheduler1', scheduler1_name).replace('scheduler2', scheduler2_name)}"
                    if winner == "tie":
                        winner_text = "🟰 Tie"
                    
                    f.write(f"| {scenario_name} | {rate1} | {rate2} | {winner_text} |\\n")
                f.write("\\n")
        
        print(f"📄 Comparison report: {report_file}")


def main():
    """Main function with command line interface."""
    parser = argparse.ArgumentParser(description="Comprehensive regression test suite")
    parser.add_argument('--baseline', action='store_true', help='Capture baseline metrics')
    parser.add_argument('--test', type=str, help='Run regression tests against baseline file')
    parser.add_argument('--compare', action='store_true', help='Compare standard vs hardened schedulers')
    parser.add_argument('--scheduler', choices=['standard', 'hardened'], default='hardened',
                       help='Scheduler to test (default: hardened)')
    
    args = parser.parse_args()
    
    suite = RegressionTestSuite()
    
    if args.baseline:
        # Capture baseline metrics
        scheduler_class = LessonScheduler if args.scheduler == 'standard' else HardenedLessonScheduler
        baseline_file = suite.capture_baseline(scheduler_class)
        print(f"\\n✅ Baseline captured successfully: {baseline_file}")
        
    elif args.test:
        # Run regression tests
        scheduler_class = LessonScheduler if args.scheduler == 'standard' else HardenedLessonScheduler
        success = suite.run_regression_tests(scheduler_class, args.test)
        
        if success:
            print("\\n🎉 All regression tests passed!")
            exit(0)
        else:
            print("\\n❌ Regression tests failed!")
            exit(1)
            
    elif args.compare:
        # Compare schedulers
        results = suite.compare_schedulers(LessonScheduler, HardenedLessonScheduler)
        print("\\n✅ Scheduler comparison completed!")
        
    else:
        # Default: run quick comparison
        print("🚀 Running quick scheduler comparison...")
        suite.compare_schedulers(LessonScheduler, HardenedLessonScheduler)


if __name__ == "__main__":
    main()