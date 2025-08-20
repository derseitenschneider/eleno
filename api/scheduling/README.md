# 🎯 Lesson Scheduling System

A Python-based automatic lesson scheduling system using Google OR-Tools for constraint satisfaction and optimization.

---

## ✨ Features

- **🏠 Multi-location scheduling** with student accessibility constraints
- **⭐ Student priority preferences** - Students rank their preferred time slots
- **🛑 Teacher break management** (NEW!) - Optional fatigue prevention with configurable breaks
- **🧠 Smart conflict analysis** with actionable suggestions when scheduling fails
- **⚡ OR-Tools optimization** for mathematically optimal solutions
- **🖥️ Detailed CLI interface** with multiple output formats and verbose logging
- **🌍 Real-world constraints** (availability windows, location matching, time overlaps)

---

## 🚀 Quick Start

### ⚙️ Installation

**🎯 Automatic Setup (Recommended)**

```bash
cd api/scheduling
chmod +x setup.sh  # Make executable (first time only)
./setup.sh         # Installs everything automatically
```

The setup script will:
- ✅ Check Python 3 installation
- ✅ Create virtual environment  
- ✅ Install all dependencies
- ✅ Show you test commands

**Manual Setup (Alternative)**

```bash
cd api/scheduling
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 🧪 Test Examples

```bash
# Activate environment (after setup)
source venv/bin/activate

# 🏃‍♂️ Quick test - simple scheduling
python run.py schedule examples/simple_solvable.json

# ⭐ Student priority preferences
python run.py schedule examples/priority_example.json

# 🛑 Teacher break management (NEW!)
python run.py schedule test_scenarios/test_breaks_4hour.json

# 🌍 Real-world priority scenario
python run.py schedule examples/real_world_priority.json

# 🔍 Debug with verbose output
python run.py schedule examples/location_conflict.json --verbose

# 💾 Export to JSON
python run.py schedule examples/complex_solvable.json --output result.json

# ⚠️ Show conflicts only
python run.py schedule examples/partial_solution.json --conflicts-only
```

### ✅ Validate Input Files

```bash
python run.py validate examples/simple_solvable.json
```

---

## 📖 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation and troubleshooting
- **[API Reference](API_OVERVIEW.md)** - Complete data models and format specifications
- **[Student Priorities](PRIORITY_API_DOCS.md)** - How students rank their preferred times
- **[Teacher Breaks](BREAK_MANAGEMENT_API_DOCS.md)** - Fatigue prevention and break configuration
- **[Test Report](COMPREHENSIVE_TEST_REPORT.md)** - Algorithm testing and performance results

---

## 📋 Input Format

### Basic Example

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
        {"day": "monday", "start_time": "15:00", "end_time": "16:00", "location": "studio_a", "priority": 1},
        {"day": "monday", "start_time": "16:00", "end_time": "17:00", "location": "studio_a", "priority": 2}
      ],
      "lesson_duration": 30
    }
  ],
  "locations": [
    {"id": "studio_a", "name": "Main Studio"}
  ]
}
```

### With Teacher Break Management

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
  "students": [...],
  "locations": [...]
}
```

### Key Fields

#### Student Priority System (Optional)
- **`priority: 1`** - Most preferred time slot ⭐
- **`priority: 2`** - Second choice ⭐⭐  
- **`priority: 3`** - Last resort option ⭐⭐⭐

**Important:** Priority field is **ONLY for students**! Teachers don't use priorities.

#### Teacher Break Configuration (Optional)
- **`max_teaching_block_minutes`** - Maximum continuous teaching time before requiring a break
- **`min_break_duration_minutes`** - Minimum break length in minutes
- **Default:** No breaks (teachers can teach continuously)

---

## 🔧 CLI Usage

```bash
# Basic scheduling
python run.py schedule <input-file.json>

# Available options
--output <file.json>     # Export results to JSON
--verbose               # Detailed debugging output
--conflicts-only        # Show only scheduling conflicts
--format table|json     # Output format (default: table)

# File validation
python run.py validate <input-file.json>
```

### Example Outputs

**✅ Success:**
```
✓ Successfully Scheduled (3/3 students):
+--------+-------------+-----------+------------+------------+
| Day    | Time        | Student   | Location   | Duration   |
+========+=============+===========+============+============+
| Monday | 14:00-14:30 | Alice     | studio_a   | 30 min     |
+--------+-------------+-----------+------------+------------+
| Monday | 15:00-16:00 | Bob       | studio_a   | 60 min     |
+--------+-------------+-----------+------------+------------+
```

**⚠️ Conflicts:**
```
⚠ Scheduling Conflicts (2 students couldn't be scheduled):

❌ Charlie: teacher_break_required
   Cannot schedule: would exceed 180-minute teaching block without 20-minute break
   
   💡 Suggestions:
   • Remove break requirements (would allow scheduling 5 students)  
   • Increase max teaching block to 210 minutes (estimated +2 students)
   • Reduce minimum break to 15 minutes (estimated +1 students)
```

---

## 🧪 Algorithm Details

### Optimization Strategy
- **Google OR-Tools** constraint programming solver
- **Multi-objective optimization**: Maximize scheduled students + respect priorities + minimize gaps
- **Multiple solving strategies** with automatic best-result selection
- **Real-time conflict analysis** with actionable suggestions

### Performance
- **Speed**: Schedules 45+ students in <0.1 seconds
- **Accuracy**: 100% constraint compliance, 35% full-pass rate on complex scenarios
- **Reliability**: Zero crashes or errors across comprehensive test suite

### Constraint Types
1. **Student availability** windows and location accessibility
2. **Teacher availability** and location constraints  
3. **Time conflict prevention** (no overlapping lessons)
4. **Student priority preferences** (when specified)
5. **Teacher break requirements** (when configured)
6. **Location capacity** and switching minimization

---

## 🎯 Use Cases

### ✅ Perfect For:
- **Music teachers** with multiple students and locations
- **Tutoring services** with complex scheduling needs
- **Small educational businesses** requiring optimization
- **Anyone with location + time + preference constraints**

### 📊 Tested Scenarios:
- Up to **45 students** simultaneously
- **Multiple locations** with accessibility constraints
- **Priority conflicts** and preference resolution
- **Teacher fatigue** management with break enforcement
- **Real-world complexity** with partial solutions

---

## 🔍 Troubleshooting

### Common Issues

**"No module named 'click'"**
```bash
source venv/bin/activate  # Activate virtual environment first
```

**"Permission denied: ./setup.sh"**
```bash
chmod +x setup.sh  # Make script executable
```

**"All students unscheduled"**
- Check that student and teacher availability windows overlap
- Verify students can access the specified locations
- Use `--verbose` flag to see detailed conflict analysis

### Get Help
- Run `python run.py --help` for CLI options
- Check the [Setup Guide](SETUP_GUIDE.md) for detailed troubleshooting
- Review example files in `examples/` directory

---

## 📈 Development Status

### ✅ Phase 1: Core Scheduling (Complete)
- Multi-location constraint satisfaction
- Student priority preferences  
- Comprehensive conflict analysis

### ✅ Phase 2: Teacher Wellbeing (Complete)
- Optional break management
- Fatigue prevention
- Smart configuration suggestions

### 🔄 Phase 3: Advanced Features (Future)
- Dynamic rescheduling for cancellations
- Multi-teacher coordination
- Heuristic preprocessing for 100+ students

---

**Built with:** Python 3.8+ • Google OR-Tools • Click CLI • Comprehensive Testing  
**License:** Educational/Proof of Concept  
**Performance:** Handles 45+ students in milliseconds with optimal solutions