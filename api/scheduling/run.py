#!/usr/bin/env python3
"""
Entry point for the scheduling system.
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cli import cli

if __name__ == '__main__':
    cli()