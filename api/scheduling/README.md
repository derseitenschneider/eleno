# Lesson Scheduling System - Proof of Concept

A Python-based automatic lesson scheduling system using Google OR-Tools for constraint satisfaction and optimization.

## Features

- **Multi-location scheduling** with student accessibility constraints
- **Comprehensive conflict analysis** with actionable suggestions
- **OR-Tools constraint programming** for optimal scheduling
- **Detailed CLI interface** with multiple output formats
- **Real-world constraint handling** (availability windows, location matching, time overlaps)

## Quick Start

### Setup

**Option 1: Automatic setup**
```bash
cd api/scheduling
./setup.sh
```

**Option 2: Manual setup**
```bash
cd api/scheduling
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Run Examples

```bash
# Activate environment first (after setup)
source venv/bin/activate

# Test with simple solvable case
python run.py schedule examples/simple_solvable.json

# Test with location conflicts
python run.py schedule examples/location_conflict.json --verbose

# Test with impossible scenario
python run.py schedule examples/impossible_overlap.json

# Export results to JSON
python run.py schedule examples/complex_solvable.json --output result.json

# Show only conflicts
python run.py schedule examples/partial_solution.json --conflicts-only
```

### Validate Input Files

```bash
python run.py validate examples/simple_solvable.json
```

## Input Format

```json
{
  "teacher": {
    "availability": [
      {"day": "monday", "start_time": "14:00", "end_time": "18:00", "location": "studio_a"}
    ]
  },
  "students": [
    {
      "name": "Alice",
      "accessible_locations": ["studio_a"],
      "availability": [
        {"day": "monday", "start_time": "15:00", "end_time": "17:00", "location": "studio_a"}
      ],
      "lesson_duration": 30
    }
  ],
  "locations": [
    {"id": "studio_a", "name": "Main Studio"}
  ]
}
```

## Example Scenarios

1. **`simple_solvable.json`** - Basic scenario with 3 students, optimal solution exists
2. **`complex_solvable.json`** - 8 students across 3 locations with varying constraints
3. **`location_conflict.json`** - Students can't access teacher's available locations
4. **`impossible_overlap.json`** - Too many students competing for the same time slot
5. **`partial_solution.json`** - Some students can be scheduled, others have conflicts

## Output Examples

### Successful Scheduling
```
=== SCHEDULING RESULTS ===
✓ Successfully Scheduled (3/3 students):
┌─────────┬──────────────┬─────────┬──────────────┬──────────┐
│ Day     │ Time         │ Student │ Location     │ Duration │
├─────────┼──────────────┼─────────┼──────────────┼──────────┤
│ Monday  │ 15:00-15:30  │ Alice   │ studio_a     │ 30 min   │
│         │ 16:00-16:45  │ Bob     │ studio_a     │ 45 min   │
│ Tuesday │ 14:00-15:00  │ Carol   │ studio_b     │ 60 min   │
└─────────┴──────────────┴─────────┴──────────────┴──────────┘
```

### Conflict Analysis
```
=== UNSCHEDULED STUDENTS (2/5) ===

❌ David
   Problem: No overlapping availability between student and teacher.
   Suggestions:
   → Student is available: Wednesday 14:00-16:00 at Main Studio
   → Teacher available at Main Studio: Monday 14:00-18:00; Wednesday 15:00-17:00
   → Consider adjusting student or teacher availability to create overlap

❌ Emma
   Problem: Student can only access [Teacher's Home] but teacher is only available at ['Main Studio', 'Practice Room'].
   Suggestions:
   → Ask if student can travel to: Main Studio, Practice Room
   → Ask teacher to add availability at Teacher's Home
```

## CLI Commands

### `schedule` - Run scheduling algorithm
```bash
python run.py schedule INPUT_FILE [OPTIONS]

Options:
  --output, -o PATH         Export schedule to JSON file
  --verbose, -v            Show detailed solver information
  --conflicts-only         Only show unscheduled students
  --format [table|json]    Output format (default: table)
```

### `validate` - Validate input file format
```bash
python run.py validate INPUT_FILE
```

## Architecture

- **`models.py`** - Data structures for students, teachers, locations, and results
- **`scheduler.py`** - OR-Tools constraint programming engine
- **`conflict_analyzer.py`** - Intelligent conflict detection and suggestion generation
- **`cli.py`** - Command-line interface with colorized output

## Constraints Handled

1. **Time Constraints**: Students and teachers must have overlapping availability
2. **Location Constraints**: Students can only attend lessons at accessible locations
3. **Capacity Constraints**: Teacher can only teach one lesson at a time
4. **Duration Constraints**: Lessons must fit within availability windows

## Optimization Objectives

1. **Primary**: Maximize number of scheduled lessons
2. **Secondary**: Minimize gaps between consecutive lessons for the teacher

## Performance

- Handles 20+ students in under 1 second
- Uses 15-minute time slot granularity
- Provides detailed solver statistics and performance metrics