#!/usr/bin/env python3
"""
Algorithm comparison tool - Original vs Enhanced scheduler.
Tests both algorithms on edge cases and provides detailed comparison.
"""

import json
import time
import os
from pathlib import Path
from scheduler import LessonScheduler
from scheduler_enhanced import EnhancedLessonScheduler
from models import SchedulingData
from conflict_analyzer import ConflictAnalyzer
from collections import defaultdict
import traceback


class AlgorithmComparison:
    """Compares original and enhanced scheduling algorithms."""
    
    def __init__(self):
        self.results = []
        self.summary_stats = {
            'original': defaultdict(list),
            'enhanced': defaultdict(list)
        }
    
    def run_comparison_test(self, test_file_path):
        """Run both algorithms on the same test case and compare results."""
        print(f"\n{'='*80}")
        print(f"COMPARING: {test_file_path.name}")
        print(f"{'='*80}")
        
        try:
            # Load test data
            with open(test_file_path, 'r') as f:
                test_data = json.load(f)
            
            test_name = test_file_path.stem
            test_description = test_data.get('_test_description', 'No description')
            edge_case_type = test_data.get('_edge_case_type', 'unknown')
            
            print(f"Test: {test_description}")
            print(f"Type: {edge_case_type}")
            
            # Load scheduling data
            data = SchedulingData.from_json_file(test_file_path)
            total_students = len(data.students)
            
            # Test original algorithm
            print(f"\n🔄 Running ORIGINAL algorithm...")
            original_result = self._run_original_algorithm(data)
            
            # Test enhanced algorithm
            print(f"🔄 Running ENHANCED algorithm...")
            enhanced_result = self._run_enhanced_algorithm(data)
            
            # Analyze conflicts for both
            if original_result and original_result.unscheduled_students:
                analyzer = ConflictAnalyzer(data)
                original_result = analyzer.analyze_conflicts(original_result)
            
            if enhanced_result and enhanced_result.unscheduled_students:
                analyzer = ConflictAnalyzer(data)
                enhanced_result = analyzer.analyze_conflicts(enhanced_result)
            
            # Compare results
            comparison = self._compare_results(original_result, enhanced_result, total_students)
            
            # Print comparison
            self._print_comparison(comparison)
            
            # Store results
            test_result = {
                'test_name': test_name,
                'description': test_description,
                'edge_case_type': edge_case_type,
                'total_students': total_students,
                'original': self._extract_result_data(original_result) if original_result else None,
                'enhanced': self._extract_result_data(enhanced_result) if enhanced_result else None,
                'comparison': comparison
            }
            
            self.results.append(test_result)
            
            # Update summary stats
            if original_result:
                self.summary_stats['original']['scheduled'].append(len(original_result.scheduled_lessons))
                self.summary_stats['original']['success_rate'].append(
                    len(original_result.scheduled_lessons) / total_students * 100
                )
                self.summary_stats['original']['solve_time'].append(
                    original_result.statistics.get('solve_time_seconds', 0)
                )
            
            if enhanced_result:
                self.summary_stats['enhanced']['scheduled'].append(len(enhanced_result.scheduled_lessons))
                self.summary_stats['enhanced']['success_rate'].append(
                    len(enhanced_result.scheduled_lessons) / total_students * 100
                )
                self.summary_stats['enhanced']['solve_time'].append(
                    enhanced_result.statistics.get('total_solve_time', 0)
                )
            
            return test_result
            
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            traceback.print_exc()
            
            return {
                'test_name': test_file_path.stem,
                'description': test_description if 'test_description' in locals() else 'Unknown',
                'edge_case_type': edge_case_type if 'edge_case_type' in locals() else 'unknown',
                'error': str(e)
            }
    
    def _run_original_algorithm(self, data: SchedulingData):
        """Run the original scheduling algorithm."""
        try:
            start_time = time.time()
            scheduler = LessonScheduler(data)
            result = scheduler.create_schedule()
            solve_time = time.time() - start_time
            
            if result:
                result.statistics['solve_time_seconds'] = solve_time
            
            return result
        except Exception as e:
            print(f"   Original algorithm failed: {e}")
            return None
    
    def _run_enhanced_algorithm(self, data: SchedulingData):
        """Run the enhanced scheduling algorithm."""
        try:
            scheduler = EnhancedLessonScheduler(data)
            result = scheduler.create_schedule()
            return result
        except Exception as e:
            print(f"   Enhanced algorithm failed: {e}")
            return None
    
    def _extract_result_data(self, result):
        """Extract comparable data from a result."""
        if not result:
            return None
        
        return {
            'scheduled_count': len(result.scheduled_lessons),
            'unscheduled_count': len(result.unscheduled_students),
            'success_rate': (len(result.scheduled_lessons) / 
                           (len(result.scheduled_lessons) + len(result.unscheduled_students)) * 100),
            'solve_time': result.statistics.get('solve_time_seconds', 
                                             result.statistics.get('total_solve_time', 0)),
            'status': result.statistics.get('status', 'UNKNOWN'),
            'statistics': result.statistics,
            'conflicts': [c.reason_type for c in result.conflicts] if result.conflicts else []
        }
    
    def _compare_results(self, original_result, enhanced_result, total_students):
        """Compare results from both algorithms."""
        comparison = {
            'total_students': total_students,
            'winner': 'tie',
            'improvement': {},
            'analysis': []
        }
        
        if not original_result and not enhanced_result:
            comparison['winner'] = 'both_failed'
            comparison['analysis'].append("Both algorithms failed")
            return comparison
        
        if not original_result:
            comparison['winner'] = 'enhanced'
            comparison['analysis'].append("Original algorithm failed, Enhanced succeeded")
            return comparison
        
        if not enhanced_result:
            comparison['winner'] = 'original'
            comparison['analysis'].append("Enhanced algorithm failed, Original succeeded")
            return comparison
        
        # Compare scheduled counts
        orig_scheduled = len(original_result.scheduled_lessons)
        enh_scheduled = len(enhanced_result.scheduled_lessons)
        
        if enh_scheduled > orig_scheduled:
            comparison['winner'] = 'enhanced'
            improvement = enh_scheduled - orig_scheduled
            comparison['improvement']['scheduled_more'] = improvement
            comparison['analysis'].append(f"Enhanced scheduled {improvement} more students")
        elif orig_scheduled > enh_scheduled:
            comparison['winner'] = 'original'
            improvement = orig_scheduled - enh_scheduled
            comparison['improvement']['scheduled_fewer'] = improvement
            comparison['analysis'].append(f"Enhanced scheduled {improvement} fewer students")
        else:
            comparison['winner'] = 'tie'
            comparison['analysis'].append("Same number of students scheduled")
        
        # Compare solve times
        orig_time = original_result.statistics.get('solve_time_seconds', 0)
        enh_time = enhanced_result.statistics.get('total_solve_time', 0)
        
        if enh_time < orig_time:
            time_improvement = orig_time - enh_time
            comparison['improvement']['faster_by'] = time_improvement
            comparison['analysis'].append(f"Enhanced was {time_improvement:.3f}s faster")
        elif orig_time < enh_time:
            time_degradation = enh_time - orig_time
            comparison['improvement']['slower_by'] = time_degradation
            comparison['analysis'].append(f"Enhanced was {time_degradation:.3f}s slower")
        
        # Compare solution quality (if available)
        orig_quality = original_result.statistics.get('solution_quality_score')
        enh_quality = enhanced_result.statistics.get('solution_quality_score')
        
        if orig_quality is not None and enh_quality is not None:
            if enh_quality > orig_quality:
                quality_improvement = enh_quality - orig_quality
                comparison['improvement']['quality_better'] = quality_improvement
                comparison['analysis'].append(f"Enhanced has better quality (+{quality_improvement:.3f})")
            elif orig_quality > enh_quality:
                quality_degradation = orig_quality - enh_quality
                comparison['improvement']['quality_worse'] = quality_degradation
                comparison['analysis'].append(f"Enhanced has worse quality (-{quality_degradation:.3f})")
        
        # Compare gap penalties
        orig_gaps = original_result.statistics.get('gap_penalty_score', 0)
        enh_gaps = enhanced_result.statistics.get('gap_penalty_score', 0)
        
        if enh_gaps < orig_gaps:
            comparison['improvement']['fewer_gaps'] = orig_gaps - enh_gaps
            comparison['analysis'].append("Enhanced has fewer gaps")
        elif orig_gaps < enh_gaps:
            comparison['improvement']['more_gaps'] = enh_gaps - orig_gaps
            comparison['analysis'].append("Enhanced has more gaps")
        
        return comparison
    
    def _print_comparison(self, comparison):
        """Print comparison results."""
        print(f"\n📊 COMPARISON RESULTS:")
        print(f"   Winner: {comparison['winner'].upper()}")
        
        for analysis in comparison['analysis']:
            print(f"   • {analysis}")
        
        if comparison['improvement']:
            print(f"   Improvements/Changes:")
            for key, value in comparison['improvement'].items():
                print(f"     - {key}: {value}")
    
    def generate_summary_report(self):
        """Generate a comprehensive summary report."""
        print(f"\n\n{'='*100}")
        print("📈 ALGORITHM COMPARISON SUMMARY")
        print(f"{'='*100}")
        
        total_tests = len(self.results)
        
        # Count wins
        enhanced_wins = len([r for r in self.results if r.get('comparison', {}).get('winner') == 'enhanced'])
        original_wins = len([r for r in self.results if r.get('comparison', {}).get('winner') == 'original'])
        ties = len([r for r in self.results if r.get('comparison', {}).get('winner') == 'tie'])
        failures = len([r for r in self.results if r.get('comparison', {}).get('winner') in ['both_failed', None]])
        
        print(f"\n🏆 WIN/LOSS RECORD:")
        print(f"   Enhanced Algorithm Wins: {enhanced_wins}/{total_tests} ({enhanced_wins/total_tests*100:.1f}%)")
        print(f"   Original Algorithm Wins: {original_wins}/{total_tests} ({original_wins/total_tests*100:.1f}%)")
        print(f"   Ties: {ties}/{total_tests} ({ties/total_tests*100:.1f}%)")
        print(f"   Failures: {failures}/{total_tests} ({failures/total_tests*100:.1f}%)")
        
        # Performance metrics
        if self.summary_stats['original']['scheduled'] and self.summary_stats['enhanced']['scheduled']:
            orig_avg_scheduled = sum(self.summary_stats['original']['scheduled']) / len(self.summary_stats['original']['scheduled'])
            enh_avg_scheduled = sum(self.summary_stats['enhanced']['scheduled']) / len(self.summary_stats['enhanced']['scheduled'])
            
            orig_avg_success = sum(self.summary_stats['original']['success_rate']) / len(self.summary_stats['original']['success_rate'])
            enh_avg_success = sum(self.summary_stats['enhanced']['success_rate']) / len(self.summary_stats['enhanced']['success_rate'])
            
            orig_avg_time = sum(self.summary_stats['original']['solve_time']) / len(self.summary_stats['original']['solve_time'])
            enh_avg_time = sum(self.summary_stats['enhanced']['solve_time']) / len(self.summary_stats['enhanced']['solve_time'])
            
            print(f"\n📊 PERFORMANCE METRICS:")
            print(f"   Average Students Scheduled:")
            print(f"     Original: {orig_avg_scheduled:.1f}")
            print(f"     Enhanced: {enh_avg_scheduled:.1f}")
            print(f"     Improvement: {enh_avg_scheduled - orig_avg_scheduled:+.1f}")
            
            print(f"\n   Average Success Rate:")
            print(f"     Original: {orig_avg_success:.1f}%")
            print(f"     Enhanced: {enh_avg_success:.1f}%")
            print(f"     Improvement: {enh_avg_success - orig_avg_success:+.1f}%")
            
            print(f"\n   Average Solve Time:")
            print(f"     Original: {orig_avg_time:.3f}s")
            print(f"     Enhanced: {enh_avg_time:.3f}s")
            print(f"     Change: {enh_avg_time - orig_avg_time:+.3f}s")
        
        # Category analysis
        category_performance = defaultdict(lambda: {'enhanced_wins': 0, 'original_wins': 0, 'ties': 0, 'total': 0})
        
        for result in self.results:
            if 'comparison' in result:
                category = result.get('edge_case_type', 'unknown')
                winner = result['comparison'].get('winner', 'unknown')
                
                category_performance[category]['total'] += 1
                if winner == 'enhanced':
                    category_performance[category]['enhanced_wins'] += 1
                elif winner == 'original':
                    category_performance[category]['original_wins'] += 1
                elif winner == 'tie':
                    category_performance[category]['ties'] += 1
        
        print(f"\n📂 CATEGORY PERFORMANCE:")
        for category, stats in category_performance.items():
            total = stats['total']
            if total > 0:
                enh_rate = stats['enhanced_wins'] / total * 100
                orig_rate = stats['original_wins'] / total * 100
                print(f"   {category.replace('_', ' ').title()}:")
                print(f"     Enhanced: {stats['enhanced_wins']}/{total} ({enh_rate:.1f}%)")
                print(f"     Original: {stats['original_wins']}/{total} ({orig_rate:.1f}%)")
                print(f"     Ties: {stats['ties']}/{total}")
        
        # Significant improvements
        significant_improvements = []
        for result in self.results:
            if 'comparison' in result and 'improvement' in result['comparison']:
                improvements = result['comparison']['improvement']
                if improvements.get('scheduled_more', 0) >= 2:
                    significant_improvements.append(
                        f"{result['test_name']}: +{improvements['scheduled_more']} students"
                    )
        
        if significant_improvements:
            print(f"\n🚀 SIGNIFICANT IMPROVEMENTS:")
            for improvement in significant_improvements[:5]:
                print(f"   • {improvement}")
        
        return {
            'total_tests': total_tests,
            'enhanced_wins': enhanced_wins,
            'original_wins': original_wins,
            'ties': ties,
            'failures': failures,
            'category_performance': dict(category_performance),
            'significant_improvements': significant_improvements
        }


def main():
    """Run comprehensive algorithm comparison."""
    print("🚀 Starting comprehensive algorithm comparison...")
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Find edge case test files
    test_dir = Path('test_scenarios')
    edge_test_files = sorted(test_dir.glob('test_edge_*.json'))
    
    print(f"\n📝 Found {len(edge_test_files)} edge case scenarios")
    
    comparison = AlgorithmComparison()
    start_time = time.time()
    
    # Run comparison for each test
    for i, test_file in enumerate(edge_test_files, 1):
        print(f"\n\n🔄 Progress: {i}/{len(edge_test_files)}")
        result = comparison.run_comparison_test(test_file)
        
        time.sleep(0.1)  # Brief pause
    
    total_time = time.time() - start_time
    
    # Generate summary report
    summary = comparison.generate_summary_report()
    
    print(f"\n🏁 Algorithm comparison completed in {total_time:.2f}s")
    
    # Save detailed results
    output_file = f"algorithm_comparison_{time.strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump({
            'summary': summary,
            'total_time': total_time,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'results': comparison.results
        }, f, indent=2)
    
    print(f"\n💾 Detailed comparison results saved to: {output_file}")


if __name__ == '__main__':
    main()