# 🚀 Setup Guide - Lesson Scheduling System

This guide provides detailed installation instructions and troubleshooting for the Lesson Scheduling System.

---

## 📋 Prerequisites

### System Requirements
- **Python 3.8 or higher** (Python 3.12+ recommended)
- **pip** (Python package installer) 
- **Git** (for cloning repository)
- **4GB+ RAM** (for larger scheduling scenarios)
- **Terminal/Command Prompt** access

### Platform Support
- ✅ **macOS** (Intel & Apple Silicon)
- ✅ **Linux** (Ubuntu, Debian, CentOS, Arch)
- ✅ **Windows** (10/11 with WSL recommended)

---

## ⚡ Quick Installation (Recommended)

### 🎯 One-Command Setup

```bash
cd api/scheduling
chmod +x setup.sh  # Make executable (first time only)
./setup.sh         # Run automatic setup
```

**What the setup script does:**
1. ✅ Verifies Python 3 is installed
2. ✅ Creates isolated virtual environment
3. ✅ Installs all required dependencies
4. ✅ Shows you test commands to verify installation

### 🧪 Verify Installation

After setup completes, test with:

```bash
source venv/bin/activate
python run.py schedule examples/simple_solvable.json
```

You should see a successful scheduling result! 🎉

---

## 🔧 Manual Installation

If the automatic setup doesn't work, follow these manual steps:

### Step 1: Check Python Installation

```bash
python3 --version
```

**Expected output:** `Python 3.8.x` or higher

**If Python is missing:**
- **macOS:** `brew install python3` or download from [python.org](https://python.org)
- **Ubuntu/Debian:** `sudo apt update && sudo apt install python3 python3-pip`
- **Windows:** Download from [python.org](https://python.org) or use Microsoft Store

### Step 2: Create Virtual Environment

```bash
cd api/scheduling
python3 -m venv venv
```

**What this does:** Creates an isolated Python environment to avoid conflicts with system packages.

### Step 3: Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate
```

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

**Success indicator:** Your prompt should now show `(venv)` prefix.

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

**This installs:**
- `ortools==9.8.3296` - Google optimization solver
- `click==8.1.7` - Command line interface
- `tabulate==0.9.0` - Table formatting
- `colorama==0.4.6` - Cross-platform colored output
- `python-dateutil==2.8.2` - Date/time utilities

### Step 5: Test Installation

```bash
python run.py --help
```

**Expected output:** Help text showing available commands.

---

## 🛠️ Troubleshooting

### Common Installation Issues

#### ❌ "Permission denied: ./setup.sh"

**Solution:**
```bash
chmod +x setup.sh  # Make script executable
./setup.sh
```

#### ❌ "python3: command not found"

**On macOS:**
```bash
# Install Homebrew first if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python3
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

**On Windows:**
- Download Python from [python.org](https://python.org)
- ✅ Check "Add Python to PATH" during installation
- Restart terminal/command prompt

#### ❌ "No module named 'venv'"

**Solution:**
```bash
# Ubuntu/Debian
sudo apt install python3-venv

# Or use alternative
python3 -m pip install virtualenv
python3 -m virtualenv venv
```

#### ❌ "ERROR: Could not install packages due to an EnvironmentError"

**Solution:**
```bash
# Upgrade pip first
python3 -m pip install --upgrade pip

# Then retry dependency installation
pip install -r requirements.txt
```

#### ❌ "Microsoft Visual C++ 14.0 is required" (Windows)

**Solution:**
- Download "Microsoft C++ Build Tools" from Microsoft
- Or install "Desktop development with C++" workload in Visual Studio
- Alternative: Use conda instead of pip

### Runtime Issues

#### ❌ "(venv) not showing in prompt"

**Problem:** Virtual environment not activated

**Solution:**
```bash
# Reactivate environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows
```

#### ❌ "ModuleNotFoundError: No module named 'ortools'"

**Problem:** Dependencies not installed or wrong Python environment

**Solution:**
```bash
# Ensure virtual environment is active
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### ❌ "All students unscheduled" in results

**Problem:** Input data has impossible constraints

**Solution:**
```bash
# Use verbose mode to see detailed analysis
python run.py schedule your-file.json --verbose

# Validate input format first
python run.py validate your-file.json
```

### Advanced Troubleshooting

#### Check Virtual Environment

```bash
# Verify you're in the right environment
which python     # Should show path/to/venv/bin/python
pip list         # Should show installed packages
```

#### Clean Installation

If everything fails, start fresh:

```bash
# Remove existing virtual environment
rm -rf venv

# Start over with manual installation
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### Memory Issues (Large Schedules)

For 30+ students:
```bash
# Increase memory limits (if needed)
export PYTHONPATH="$PYTHONPATH:."
ulimit -v 8000000  # 8GB virtual memory limit
```

---

## 🌐 Platform-Specific Notes

### macOS

**M1/M2 Apple Silicon:**
- OR-Tools has native Apple Silicon support
- If issues occur, try: `arch -arm64 pip install -r requirements.txt`

**Intel Mac:**
- Should work without modifications
- Use Homebrew for Python installation: `brew install python3`

### Linux

**Ubuntu 20.04+:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv build-essential
```

**CentOS/RHEL:**
```bash
sudo yum install python3 python3-pip python3-devel gcc
```

**Arch Linux:**
```bash
sudo pacman -S python python-pip
```

### Windows

**Recommended:** Use WSL (Windows Subsystem for Linux) for best compatibility.

**Native Windows:**
- Use PowerShell or Command Prompt as Administrator
- Ensure Python is added to PATH
- May need Microsoft Visual C++ Build Tools

**WSL Setup:**
```bash
# Install WSL first, then:
sudo apt update && sudo apt install python3 python3-pip python3-venv
```

---

## ⚙️ Environment Configuration

### Virtual Environment Management

**Activate environment:**
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

**Deactivate when done:**
```bash
deactivate
```

**Delete environment:**
```bash
rm -rf venv  # macOS/Linux
rmdir /s venv  # Windows
```

### Development Setup

For code modifications:

```bash
# Install development dependencies (optional)
pip install pytest black mypy

# Run tests
pytest tests/

# Format code
black *.py

# Type checking
mypy scheduler.py
```

---

## 🚨 Getting Help

### Check System Status

```bash
# Verify installation
python --version
pip --version
python run.py --help

# Test basic functionality
python run.py validate examples/simple_solvable.json
python run.py schedule examples/simple_solvable.json
```

### Community Support

1. **Check existing examples** in `examples/` directory
2. **Read error messages carefully** - they often contain solutions
3. **Use `--verbose` flag** for detailed debugging output
4. **Validate input files** before scheduling with `python run.py validate`

### Reporting Issues

If you encounter persistent problems:

1. **Include system information:**
   - Operating system and version
   - Python version (`python3 --version`)
   - Error messages (full stack trace)

2. **Provide reproduction steps:**
   - Exact commands run
   - Input files (if possible)
   - Expected vs actual behavior

---

## ✅ Success Checklist

After installation, you should be able to:

- [ ] **Activate virtual environment** without errors
- [ ] **Run `python run.py --help`** and see command options
- [ ] **Validate example file:** `python run.py validate examples/simple_solvable.json`
- [ ] **Schedule simple example:** `python run.py schedule examples/simple_solvable.json`
- [ ] **See successful scheduling output** with formatted table
- [ ] **Test priority features:** `python run.py schedule examples/priority_example.json`
- [ ] **Test break management:** `python run.py schedule test_scenarios/test_breaks_4hour.json`

If all items pass ✅ - you're ready to use the scheduling system!

---

**Next Steps:** Check out the [API Reference](API_OVERVIEW.md) to understand input formats, or start with the examples in the main [README](README.md).