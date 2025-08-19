"""
Command-line interface for the scheduling system.
"""

import click
import json
import sys
from pathlib import Path
from tabulate import tabulate
from colorama import init, Fore, Style

from models import SchedulingData
from scheduler import LessonScheduler
from conflict_analyzer import ConflictAnalyzer

# Initialize colorama for cross-platform colored output
init()


def print_header(text: str):
    """Print a styled header."""
    print(f"\n{Fore.CYAN}{'=' * len(text)}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{text}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'=' * len(text)}{Style.RESET_ALL}")


def print_success(text: str):
    """Print success message."""
    print(f"{Fore.GREEN}✓ {text}{Style.RESET_ALL}")


def print_error(text: str):
    """Print error message."""
    print(f"{Fore.RED}✗ {text}{Style.RESET_ALL}")


def print_warning(text: str):
    """Print warning message."""
    print(f"{Fore.YELLOW}⚠ {text}{Style.RESET_ALL}")


def print_info(text: str):
    """Print info message."""
    print(f"{Fore.BLUE}ℹ {text}{Style.RESET_ALL}")


def format_schedule_table(scheduled_lessons):
    """Format scheduled lessons as a table."""
    if not scheduled_lessons:
        return "No lessons scheduled."
    
    # Group lessons by day
    days_order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    lessons_by_day = {}
    
    for lesson in scheduled_lessons:
        if lesson.day not in lessons_by_day:
            lessons_by_day[lesson.day] = []
        lessons_by_day[lesson.day].append(lesson)
    
    # Sort lessons within each day by start time
    for day in lessons_by_day:
        lessons_by_day[day].sort(key=lambda x: x.start_time)
    
    # Create table data
    table_data = []
    for day in days_order:
        if day in lessons_by_day:
            for i, lesson in enumerate(lessons_by_day[day]):
                location_name = lesson.location  # Could be enhanced to show location names
                
                day_display = day.title() if i == 0 else ""
                table_data.append([
                    day_display,
                    f"{lesson.start_time}-{lesson.end_time}",
                    lesson.student,
                    location_name,
                    f"{lesson.duration} min"
                ])
    
    headers = ["Day", "Time", "Student", "Location", "Duration"]
    return tabulate(table_data, headers=headers, tablefmt="grid")


def format_conflicts_report(conflicts):
    """Format conflicts as a readable report."""
    if not conflicts:
        return "No conflicts to report."
    
    report = []
    
    for conflict in conflicts:
        report.append(f"\n{Fore.RED}❌ {conflict.student}{Style.RESET_ALL}")
        report.append(f"   Problem: {conflict.description}")
        
        if conflict.suggestions:
            report.append("   Suggestions:")
            for suggestion in conflict.suggestions:
                report.append(f"   → {suggestion}")
    
    return "\n".join(report)


def format_statistics(stats):
    """Format statistics as a readable table."""
    formatted_stats = [
        ["Solve Time", f"{stats['solve_time_seconds']}s"],
        ["Status", stats['status']],
        ["Total Students", stats['total_students']],
        ["Scheduled", stats['scheduled_students']],
        ["Efficiency", f"{stats['schedule_efficiency_percent']}%"],
        ["Solver Iterations", stats['solver_iterations']],
        ["Variables Created", stats['variables_created']]
    ]
    
    if stats.get('location_usage'):
        location_usage = ", ".join([f"{loc}: {count}" for loc, count in stats['location_usage'].items()])
        formatted_stats.append(["Location Usage", location_usage])
    
    return tabulate(formatted_stats, headers=["Metric", "Value"], tablefmt="simple")


@click.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('--output', '-o', type=click.Path(), help='Export schedule to JSON file')
@click.option('--verbose', '-v', is_flag=True, help='Show detailed solver information')
@click.option('--conflicts-only', is_flag=True, help='Only show unscheduled students and conflicts')
@click.option('--format', 'output_format', type=click.Choice(['table', 'json']), 
              default='table', help='Output format')
def schedule(input_file, output, verbose, conflicts_only, output_format):
    """
    Run the lesson scheduling algorithm on the given input file.
    
    INPUT_FILE: JSON file containing teacher availability, student data, and locations.
    """
    
    try:
        # Load scheduling data
        print_info(f"Loading scheduling data from {input_file}...")
        data = SchedulingData.from_json_file(input_file)
        
        if verbose:
            print_info(f"Loaded {len(data.students)} students, {len(data.locations)} locations")
            print_info(f"Teacher has {len(data.teacher.availability)} availability windows")
        
        # Create scheduler and run
        print_info("Running scheduling algorithm...")
        scheduler = LessonScheduler(data)
        result = scheduler.create_schedule()
        
        # Analyze conflicts
        print_info("Analyzing conflicts...")
        analyzer = ConflictAnalyzer(data)
        result = analyzer.analyze_conflicts(result)
        
        # Output results
        if output_format == 'json':
            print(json.dumps(result.to_dict(), indent=2))
            return
        
        # Table format output
        if not conflicts_only:
            print_header("SCHEDULING RESULTS")
            
            if result.scheduled_lessons:
                print_success(f"Successfully Scheduled ({len(result.scheduled_lessons)}/{len(data.students)} students):")
                print(format_schedule_table(result.scheduled_lessons))
            else:
                print_warning("No lessons could be scheduled.")
        
        # Show conflicts
        if result.unscheduled_students:
            if not conflicts_only:
                print()
            
            print_header(f"UNSCHEDULED STUDENTS ({len(result.unscheduled_students)}/{len(data.students)})")
            print(format_conflicts_report(result.conflicts))
        elif not conflicts_only:
            print()
            print_success("All students successfully scheduled!")
        
        # Show statistics
        if not conflicts_only and verbose:
            print_header("STATISTICS")
            print(format_statistics(result.statistics))
        
        # Export to file if requested
        if output:
            with open(output, 'w') as f:
                json.dump(result.to_dict(), f, indent=2)
            print_info(f"Results exported to {output}")
    
    except FileNotFoundError:
        print_error(f"Input file not found: {input_file}")
        sys.exit(1)
    
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON in input file: {e}")
        sys.exit(1)
    
    except Exception as e:
        print_error(f"Scheduling failed: {e}")
        if verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


@click.command()
@click.argument('input_file', type=click.Path(exists=True))
def validate(input_file):
    """
    Validate the format of a scheduling input file.
    
    INPUT_FILE: JSON file to validate.
    """
    try:
        print_info(f"Validating {input_file}...")
        data = SchedulingData.from_json_file(input_file)
        
        # Basic validation
        issues = []
        
        if not data.students:
            issues.append("No students defined")
        
        if not data.locations:
            issues.append("No locations defined")
        
        if not data.teacher.availability:
            issues.append("No teacher availability defined")
        
        # Check student accessibility
        for student in data.students:
            if not student.accessible_locations:
                issues.append(f"Student '{student.name}' has no accessible locations")
            
            invalid_locations = [
                loc for loc in student.accessible_locations
                if not any(l.id == loc for l in data.locations)
            ]
            if invalid_locations:
                issues.append(f"Student '{student.name}' references invalid locations: {invalid_locations}")
            
            if not student.availability:
                issues.append(f"Student '{student.name}' has no availability windows")
        
        # Check teacher location references
        teacher_locations = set(w.location for w in data.teacher.availability)
        invalid_teacher_locations = [
            loc for loc in teacher_locations
            if not any(l.id == loc for l in data.locations)
        ]
        if invalid_teacher_locations:
            issues.append(f"Teacher references invalid locations: {invalid_teacher_locations}")
        
        if issues:
            print_error("Validation failed:")
            for issue in issues:
                print(f"  • {issue}")
            sys.exit(1)
        else:
            print_success("Input file is valid!")
            
            # Show summary
            print_info(f"Summary:")
            print(f"  • {len(data.students)} students")
            print(f"  • {len(data.locations)} locations")
            print(f"  • {len(data.teacher.availability)} teacher availability windows")
            
            total_student_windows = sum(len(s.availability) for s in data.students)
            print(f"  • {total_student_windows} total student availability windows")
    
    except Exception as e:
        print_error(f"Validation failed: {e}")
        sys.exit(1)


@click.group()
def cli():
    """Lesson scheduling system - proof of concept."""
    pass


cli.add_command(schedule)
cli.add_command(validate)


if __name__ == '__main__':
    cli()