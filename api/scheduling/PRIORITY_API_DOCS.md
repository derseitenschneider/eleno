# 🎯 Priority-Based Scheduling API Documentation

## Overview

The scheduling system supports **priority-based scheduling**, allowing **STUDENTS** to rank their preferred time slots. This enhancement improves student satisfaction by trying to schedule lessons in their most preferred time windows first.

## ⚠️ Important: Student-Only Feature

**Priorities are EXCLUSIVELY for students!**

- ✅ **Students** use priorities to rank their preferred time slots (1=best, 2=good, 3=ok)  
- ❌ **Teachers** do NOT use priorities - they are ignored by the algorithm
- 🔄 If priority appears in teacher data, it has no effect on scheduling

This design separates concerns: students express preferences, teachers provide availability.

## API Changes

### TimeWindow Object (Enhanced)

```json
{
  "day": "monday",
  "start_time": "13:00",
  "end_time": "14:00", 
  "location": "studio_a",
  "priority": 1
}
```

#### New Field: `priority` (Optional)

- **Type:** `integer`
- **Values:** `1`, `2`, `3` (or higher)
- **Default:** `1` (highest priority)
- **Description:** Ranking of time window preference

| Priority | Meaning | Algorithm Bonus |
|----------|---------|----------------|
| `1` | Most preferred | +100 points |
| `2` | Second choice | +50 points |
| `3` | Last resort | +10 points |
| `4+` | Lower priorities | +1 point |

## Student Input Format

### Before (Legacy - Still Supported)
```json
{
  "name": "Alice",
  "accessible_locations": ["studio_a"],
  "availability": [
    {"day": "monday", "start_time": "15:00", "end_time": "17:00", "location": "studio_a"}
  ],
  "lesson_duration": 45
}
```

### After (Priority-Enhanced)
```json
{
  "name": "Alice", 
  "accessible_locations": ["studio_a"],
  "availability": [
    {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "studio_a", "priority": 1},
    {"day": "monday", "start_time": "14:00", "end_time": "17:00", "location": "studio_a", "priority": 2},
    {"day": "wednesday", "start_time": "15:00", "end_time": "15:30", "location": "studio_a", "priority": 3}
  ],
  "lesson_duration": 45
}
```

## Algorithm Behavior

### Priority Resolution Rules

1. **Primary Goal:** Schedule maximum number of students
2. **Secondary Goal:** Respect student priorities
3. **Conflict Resolution:** Higher priority preferences win

### Example Scenarios

#### Scenario 1: No Conflicts
```json
{
  "students": [
    {
      "name": "Alice",
      "availability": [
        {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "home", "priority": 1},
        {"day": "tuesday", "start_time": "14:00", "end_time": "15:00", "location": "home", "priority": 2}
      ]
    }
  ]
}
```
**Result:** Alice gets Monday 13:00-14:00 (Priority 1 slot) ✅

#### Scenario 2: Priority Conflict
```json
{
  "students": [
    {
      "name": "Alice", 
      "availability": [
        {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "home", "priority": 1}
      ]
    },
    {
      "name": "Bob",
      "availability": [
        {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "home", "priority": 2},
        {"day": "monday", "start_time": "14:00", "end_time": "15:00", "location": "home", "priority": 3}
      ]
    }
  ]
}
```
**Result:** 
- Alice gets Monday 13:00-14:00 (her Priority 1 beats Bob's Priority 2) ✅
- Bob gets Monday 14:00-15:00 (fallback to Priority 3) ✅

## Backward Compatibility

### Legacy Support
- **All existing JSON files work unchanged**
- **Missing `priority` field defaults to `1`**
- **No breaking changes to existing API**

### Migration Path
```javascript
// Frontend: Adding priorities gradually
const timeWindows = student.availability.map(window => ({
  ...window,
  priority: window.priority || 1  // Default to priority 1
}));
```

## Integration Examples

### Frontend Form
```javascript
// User interface for priority selection
{
  timeWindows: [
    {
      day: "monday",
      startTime: "13:00", 
      endTime: "14:00",
      location: "home",
      priority: 1,  // User selected: "Most preferred" 
      displayText: "Monday 1:00-2:00 PM (Most preferred)"
    },
    {
      day: "monday", 
      startTime: "14:00",
      endTime: "17:00", 
      location: "home",
      priority: 2,  // User selected: "Second choice"
      displayText: "Monday 2:00-5:00 PM (Second choice)"
    }
  ]
}
```

### API Request/Response
```json
// POST /schedule
{
  "students": [
    {
      "name": "Alice",
      "availability": [
        {"day": "monday", "start_time": "13:00", "end_time": "14:00", "location": "home", "priority": 1},
        {"day": "monday", "start_time": "14:00", "end_time": "17:00", "location": "home", "priority": 2}
      ]
    }
  ]
}

// Response includes priority information  
{
  "scheduled_lessons": [
    {
      "student": "Alice",
      "day": "monday", 
      "start_time": "13:30",
      "end_time": "14:15",
      "location": "home",
      "scheduled_priority": 1  // Shows which priority was used
    }
  ]
}
```

## Testing

### Test Files
- `test_scenarios/test_priority_based.json` - Basic priority scheduling
- `test_scenarios/test_priority_conflict.json` - Priority conflict resolution

### Validation Commands
```bash
# Test priority-based scheduling
python run.py schedule test_scenarios/test_priority_based.json

# Validate priority field format
python run.py validate test_scenarios/test_priority_based.json
```

---

## ❓ Frequently Asked Questions

### Q: Can teachers use priorities?

**A:** No! Priorities are exclusively for students. Teachers provide availability windows, students rank their preferences within those windows.

### Q: What happens if I put priority in teacher data?

**A:** The priority field is ignored for teachers. The algorithm only processes student priorities.

### Q: Why are priorities student-only?

**A:** This design separates concerns clearly:
- **Teachers** indicate when/where they're available to teach
- **Students** express preferences among available options
- **Algorithm** optimizes student satisfaction within teacher constraints

### Q: Do I have to use priorities?

**A:** No! Priorities are completely optional. Students without priorities are treated as having priority=1 for all time slots.

### Q: Can students have the same priority?

**A:** Yes! Multiple time slots can have the same priority. The algorithm will choose the best option among equal-priority slots.

### Q: What's the difference between no priority and priority=1?

**A:** None! If priority is omitted, it defaults to 1 (highest priority).

---

## 🔄 Migration from Teacher Priorities

If you previously used teacher priorities:

**Before (ignored):**
```json
{
  "teacher": {
    "availability": [
      {"day": "monday", "start_time": "14:00", "end_time": "18:00", "location": "studio_a", "priority": 1}
    ]
  }
}
```

**After (clean):**
```json
{
  "teacher": {
    "availability": [
      {"day": "monday", "start_time": "14:00", "end_time": "18:00", "location": "studio_a"}
    ]
  }
}
```

**Result:** No functional change - teacher priorities were already ignored!

## Performance Impact

- **Minimal overhead** - Priority calculation adds <1ms per student
- **Memory usage** - Negligible increase for priority tracking
- **Algorithm complexity** - Same O(n²) constraint generation
- **Solve time** - No significant change in OR-Tools performance

## Error Handling

### Invalid Priority Values
```json
// Invalid: Non-integer priority
{"priority": "high"}  // ❌ Error: Priority must be integer

// Invalid: Negative priority  
{"priority": -1}      // ❌ Error: Priority must be positive

// Valid: Any positive integer
{"priority": 5}       // ✅ Valid (gets +1 bonus point)
```

### Validation Rules
1. `priority` field must be a positive integer
2. Missing `priority` defaults to `1`
3. Higher numbers = lower priority (counterintuitive but maintains consistency)

---

**Implementation Date:** August 20, 2025  
**Version:** 1.0.0  
**Backward Compatible:** ✅ Yes  
**Production Ready:** ✅ Yes