#!/bin/bash

echo "🚀 Setting up Python scheduling system..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    echo "   Visit: https://www.python.org/downloads/"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "⚡ Installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🎯 Quick test commands:"
echo "   source venv/bin/activate"
echo "   python run.py validate examples/simple_solvable.json"
echo "   python run.py schedule examples/simple_solvable.json"
echo "   python run.py schedule examples/location_conflict.json"
echo ""
echo "📖 See README.md for more examples and usage instructions."