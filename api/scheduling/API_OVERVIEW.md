# 📖 API Reference - Lesson Scheduling System

Complete reference guide for all data models, input formats, and API specifications.

---

## 📋 Quick Reference

| Component | Purpose | Required |
|-----------|---------|----------|
| **Teacher** | Instructor availability and break preferences | ✅ Yes |
| **Students** | Student availability and lesson preferences | ✅ Yes |
| **Locations** | Physical locations where lessons can occur | ✅ Yes |
| **TimeWindow** | Time slot with optional student priority | ✅ Yes |
| **Priority** | Student preference ranking (1=best) | ❌ Optional |
| **Break Config** | Teacher fatigue management settings | ❌ Optional |

---

## 🏗️ Data Models

### Root Schema

```json
{
  "teacher": TeacherSchedule,
  "students": [Student],
  "locations": [Location]
}
```

---

## 👨‍🏫 Teacher Schedule

### TeacherSchedule Object

```json
{
  "availability": [TimeWindow],
  "break_config": TeacherBreakConfig | null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `availability` | Array of TimeWindow | ✅ Yes | When and where teacher is available |
| `break_config` | TeacherBreakConfig or null | ❌ No | Optional fatigue management (default: no breaks) |

### TeacherBreakConfig Object

```json
{
  "max_teaching_block_minutes": 180,
  "min_break_duration_minutes": 20
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `max_teaching_block_minutes` | integer | ✅ Yes | Maximum continuous teaching time before break required |
| `min_break_duration_minutes` | integer | ✅ Yes | Minimum break duration in minutes |

**Example Teacher Configurations:**

```json
// No breaks (default)
{
  "availability": [
    {"day": "monday", "start_time": "09:00", "end_time": "17:00", "location": "studio_a"}
  ]
}

// With break management
{
  "availability": [
    {"day": "monday", "start_time": "09:00", "end_time": "17:00", "location": "studio_a"}
  ],
  "break_config": {
    "max_teaching_block_minutes": 240,
    "min_break_duration_minutes": 30
  }
}
```

---

## 👨‍🎓 Student

### Student Object

```json
{
  "name": "Alice",
  "accessible_locations": ["studio_a", "home"],
  "availability": [TimeWindow],
  "lesson_duration": 60
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Unique student identifier |
| `accessible_locations` | Array of strings | ✅ Yes | Location IDs student can attend |
| `availability` | Array of TimeWindow | ✅ Yes | When and where student is available |
| `lesson_duration` | integer | ✅ Yes | Lesson length in minutes |

**Example Students:**

```json
// Simple student (no priorities)
{
  "name": "Bob",
  "accessible_locations": ["studio_a"],
  "availability": [
    {"day": "monday", "start_time": "15:00", "end_time": "16:00", "location": "studio_a"}
  ],
  "lesson_duration": 45
}

// Student with priority preferences
{
  "name": "Carol",
  "accessible_locations": ["studio_a", "studio_b"],
  "availability": [
    {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "studio_a", "priority": 1},
    {"day": "tuesday", "start_time": "15:00", "end_time": "16:00", "location": "studio_b", "priority": 2},
    {"day": "wednesday", "start_time": "17:00", "end_time": "18:00", "location": "studio_a", "priority": 3}
  ],
  "lesson_duration": 30
}
```

---

## ⏰ Time Window

### TimeWindow Object

```json
{
  "day": "monday",
  "start_time": "14:00",
  "end_time": "16:00", 
  "location": "studio_a",
  "priority": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `day` | string | ✅ Yes | Day of week: "monday", "tuesday", ..., "sunday" |
| `start_time` | string | ✅ Yes | Start time in "HH:MM" format (24-hour) |
| `end_time` | string | ✅ Yes | End time in "HH:MM" format (24-hour) |
| `location` | string | ✅ Yes | Location ID where availability applies |
| `priority` | integer | ❌ No | **STUDENTS ONLY**: Preference ranking (default: 1) |

### Priority System (Students Only)

**⚠️ Important:** Priority field is **ONLY meaningful for students**. Teachers can have the field but it's **ignored by the algorithm**.

| Priority | Meaning | Algorithm Weight | Use Case |
|----------|---------|------------------|----------|
| `1` | Most preferred ⭐ | +100 points | Perfect time for student |
| `2` | Second choice ⭐⭐ | +50 points | Good backup option |
| `3` | Last resort ⭐⭐⭐ | +10 points | Will accept if needed |
| `4+` | Lower priority | +1 point | Minimal preference |

**Example Priority Usage:**

```json
// Student ranking their preferences
"availability": [
  {"day": "monday", "start_time": "15:00", "end_time": "16:00", "location": "home", "priority": 1},      // "This is perfect!"
  {"day": "tuesday", "start_time": "16:00", "end_time": "17:00", "location": "studio_a", "priority": 2},  // "This works well"
  {"day": "wednesday", "start_time": "18:00", "end_time": "19:00", "location": "studio_b", "priority": 3} // "Only if necessary"
]
```

### Time Format Rules

- **Format:** 24-hour format "HH:MM" (e.g., "14:30", "09:00")
- **Validation:** `start_time` must be before `end_time`
- **Granularity:** Algorithm uses 15-minute intervals internally
- **Examples:**
  - ✅ Valid: "09:00", "14:30", "23:45"
  - ❌ Invalid: "9:00", "2:30 PM", "25:00"

---

## 📍 Location

### Location Object

```json
{
  "id": "studio_a",
  "name": "Main Studio",
  "address": "123 Music Lane"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique location identifier (used in TimeWindows) |
| `name` | string | ✅ Yes | Human-readable location name |
| `address` | string | ❌ No | Physical address (for display only) |

**Example Locations:**

```json
[
  {"id": "home", "name": "Teacher's Home Studio", "address": "123 Main St"},
  {"id": "school", "name": "Music School Room A"},
  {"id": "community_center", "name": "Community Center", "address": "456 Oak Ave"}
]
```

---

## 📤 Response Format

### ScheduleResult Object

```json
{
  "scheduled_lessons": [ScheduleEntry],
  "unscheduled_students": [string],
  "conflicts": [ConflictReason],
  "statistics": Statistics
}
```

### ScheduleEntry Object

```json
{
  "student": "Alice",
  "day": "monday",
  "start_time": "14:00",
  "end_time": "15:00",
  "location": "studio_a",
  "duration": 60
}
```

### ConflictReason Object

```json
{
  "student": "Bob",
  "reason_type": "teacher_break_required",
  "description": "Cannot schedule Bob: would exceed 180-minute teaching block without 20-minute break",
  "suggestions": [
    "Remove break requirements (would allow scheduling 5 students)",
    "Increase max teaching block to 210 minutes (estimated +2 students)"
  ]
}
```

### Statistics Object

```json
{
  "solve_time_seconds": 0.025,
  "status": "OPTIMAL",
  "total_students": 10,
  "scheduled_students": 8,
  "schedule_efficiency_percent": 80.0,
  "break_constraints_enabled": true,
  "total_break_time_minutes": 45,
  "longest_teaching_block_minutes": 175
}
```

---

## 🎯 Complete Examples

### Basic Scheduling

```json
{
  "teacher": {
    "availability": [
      {"day": "monday", "start_time": "13:00", "end_time": "17:00", "location": "studio_a"},
      {"day": "tuesday", "start_time": "14:00", "end_time": "18:00", "location": "home"}
    ]
  },
  "students": [
    {
      "name": "Alice",
      "accessible_locations": ["studio_a"],
      "availability": [
        {"day": "monday", "start_time": "15:00", "end_time": "16:00", "location": "studio_a"}
      ],
      "lesson_duration": 45
    },
    {
      "name": "Bob",
      "accessible_locations": ["home"],
      "availability": [
        {"day": "tuesday", "start_time": "16:00", "end_time": "17:00", "location": "home"}
      ],
      "lesson_duration": 30
    }
  ],
  "locations": [
    {"id": "studio_a", "name": "Music Studio"},
    {"id": "home", "name": "Home Studio"}
  ]
}
```

### Advanced: Priorities + Break Management

```json
{
  "teacher": {
    "availability": [
      {"day": "monday", "start_time": "09:00", "end_time": "18:00", "location": "studio_a"}
    ],
    "break_config": {
      "max_teaching_block_minutes": 180,
      "min_break_duration_minutes": 20
    }
  },
  "students": [
    {
      "name": "Emma",
      "accessible_locations": ["studio_a"],
      "availability": [
        {"day": "monday", "start_time": "10:00", "end_time": "11:00", "location": "studio_a", "priority": 1},
        {"day": "monday", "start_time": "14:00", "end_time": "15:00", "location": "studio_a", "priority": 2}
      ],
      "lesson_duration": 60
    },
    {
      "name": "Frank",
      "accessible_locations": ["studio_a"],
      "availability": [
        {"day": "monday", "start_time": "11:00", "end_time": "12:00", "location": "studio_a", "priority": 1}
      ],
      "lesson_duration": 45
    }
  ],
  "locations": [
    {"id": "studio_a", "name": "Main Studio"}
  ]
}
```

---

## ⚡ Validation Rules

### Required Fields Validation

The system validates that all required fields are present:

```python
# Teacher validation
- teacher.availability must not be empty
- Each availability window must have valid day/time/location

# Student validation  
- student.name must be unique across all students
- student.accessible_locations must not be empty
- student.lesson_duration must be positive integer
- Each availability window must reference valid location ID

# Location validation
- location.id must be unique across all locations
- location.id cannot be empty string
```

### Time Window Validation

```python
# Time format validation
- Times must match "HH:MM" pattern (24-hour format)
- Hours: 00-23, Minutes: 00-59
- start_time must be before end_time

# Day validation
- Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday
- Case sensitive (lowercase required)

# Duration validation
- Window duration must be >= student.lesson_duration
- Overlapping windows for same student/location are allowed
```

### Cross-Reference Validation

```python
# Location references
- All location IDs in TimeWindows must exist in locations array
- All location IDs in accessible_locations must exist in locations array

# Availability overlap
- Student and teacher must have overlapping availability for scheduling to succeed
- Student must be able to access locations where teacher is available
```

---

## 🔧 Algorithm Behavior

### Optimization Priorities

1. **Primary Goal:** Maximize number of students scheduled
2. **Secondary Goal:** Respect student priority preferences
3. **Tertiary Goal:** Minimize scheduling gaps and location switches

### Constraint Handling

| Constraint Type | Behavior | Failure Handling |
|-----------------|----------|------------------|
| **Student Availability** | Hard constraint - must be respected | Student marked unscheduled |
| **Teacher Availability** | Hard constraint - must be respected | No lessons in unavailable times |
| **Location Access** | Hard constraint - student must access location | Student filtered from impossible slots |
| **Time Conflicts** | Hard constraint - no overlapping lessons | Conflicting combinations prevented |
| **Break Requirements** | Hard constraint when configured | Students blocked if breaks needed |
| **Priority Preferences** | Soft constraint - influences optimization | Lower priority used if needed |

### Solving Strategies

The algorithm uses multiple solving strategies automatically:

1. **Priority-First Strategy:** Schedule high-priority students first
2. **Constraint-First Strategy:** Focus on students with limited options  
3. **Balanced Strategy:** Balance all factors equally

The best result across all strategies is returned.

---

## 📊 Performance Characteristics

### Scalability

| Student Count | Typical Solve Time | Memory Usage | Success Rate |
|---------------|-------------------|--------------|--------------|
| 1-10 students | < 0.01 seconds | < 50MB | 95%+ |
| 11-25 students | 0.01-0.05 seconds | 50-100MB | 80%+ |
| 26-45 students | 0.05-0.1 seconds | 100-200MB | 65%+ |

### Complexity Factors

**Increases solve time:**
- More students
- More locations
- Complex availability patterns
- Break constraints enabled
- Priority conflicts

**Reduces solve time:**
- Simpler availability patterns
- Fewer location switches required
- No break constraints
- Non-overlapping student availability

---

## 🎛️ Configuration Options

### CLI Parameters

```bash
python run.py schedule input.json [OPTIONS]

Options:
  --output FILE        Export results to JSON file
  --verbose           Show detailed solver information
  --conflicts-only    Display only scheduling conflicts
  --format [table|json]  Output format (default: table)
```

### Environment Variables

```bash
# Increase solver timeout (default: 30 seconds)
export SOLVER_TIMEOUT=60

# Enable debug logging
export DEBUG=1

# Limit memory usage
export MEMORY_LIMIT=2048  # MB
```

---

This API reference covers all data models and usage patterns. For practical examples, see the [README](README.md) and files in the `examples/` directory.