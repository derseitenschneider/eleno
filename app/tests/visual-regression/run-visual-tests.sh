#!/bin/bash

# Visual Regression Test Runner
# Usage: ./run-visual-tests.sh [update] [project]
#   update: Pass --update-snapshots to update baselines
#   project: Specify specific project (desktop, mobile, dark-desktop, dark-mobile)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🎨 Running Visual Regression Tests${NC}"
echo "=================================="

UPDATE_FLAG=""
PROJECT=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    update)
      UPDATE_FLAG="--update-snapshots"
      echo -e "${YELLOW}📷 Updating baseline screenshots${NC}"
      ;;
    desktop|mobile|dark-desktop|dark-mobile)
      PROJECT="visual-regression-$arg"
      echo -e "${YELLOW}🎯 Running specific project: $PROJECT${NC}"
      ;;
  esac
done

# Function to run tests for a specific project
run_project() {
  local project_name=$1
  echo -e "${YELLOW}Running $project_name...${NC}"
  
  if npx playwright test $UPDATE_FLAG --project=$project_name; then
    echo -e "${GREEN}✅ $project_name completed successfully${NC}"
    return 0
  else
    echo -e "${RED}❌ $project_name failed${NC}"
    return 1
  fi
}

# Run tests
if [ -n "$PROJECT" ]; then
  # Run specific project
  run_project "$PROJECT"
else
  # Run all visual regression projects
  failed_projects=()
  
  echo -e "${YELLOW}🖥️  Running Desktop Tests (Light Theme)...${NC}"
  if ! run_project "visual-regression-desktop"; then
    failed_projects+=("visual-regression-desktop")
  fi
  
  echo -e "${YELLOW}📱 Running Mobile Tests (Light Theme)...${NC}"
  if ! run_project "visual-regression-mobile"; then
    failed_projects+=("visual-regression-mobile")
  fi
  
  echo -e "${YELLOW}🌙 Running Desktop Tests (Dark Theme)...${NC}"
  if ! run_project "visual-regression-dark-desktop"; then
    failed_projects+=("visual-regression-dark-desktop")
  fi
  
  echo -e "${YELLOW}📱🌙 Running Mobile Tests (Dark Theme)...${NC}"
  if ! run_project "visual-regression-dark-mobile"; then
    failed_projects+=("visual-regression-dark-mobile")
  fi
  
  # Summary
  echo
  echo "=================================="
  if [ ${#failed_projects[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All visual regression tests passed!${NC}"
    exit 0
  else
    echo -e "${RED}❌ Some tests failed:${NC}"
    for project in "${failed_projects[@]}"; do
      echo -e "${RED}  - $project${NC}"
    done
    echo
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo "  - Review the HTML report: npx playwright show-report"
    echo "  - Update baselines if changes are intentional: ./run-visual-tests.sh update"
    echo "  - Check specific project: ./run-visual-tests.sh [desktop|mobile|dark-desktop|dark-mobile]"
    exit 1
  fi
fi