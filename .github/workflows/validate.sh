#!/bin/bash

# GitHub Actions Workflow Validation Script
# This script validates the workflow YAML files for syntax and best practices

set -e

echo "🔍 Validating GitHub Actions Workflows..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to validate YAML syntax
validate_yaml() {
    local file=$1
    echo -n "📋 Validating $file... "
    
    if command -v yamllint &> /dev/null; then
        if yamllint "$file" &> /dev/null; then
            echo -e "${GREEN}✅ Valid${NC}"
            return 0
        else
            echo -e "${RED}❌ Invalid YAML${NC}"
            yamllint "$file"
            return 1
        fi
    elif python3 -c "import yaml" &> /dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('$file'))" &> /dev/null; then
            echo -e "${GREEN}✅ Valid${NC}"
            return 0
        else
            echo -e "${RED}❌ Invalid YAML${NC}"
            python3 -c "import yaml; yaml.safe_load(open('$file'))"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No YAML validator found (install yamllint or ensure python3 with yaml is available)${NC}"
        return 0
    fi
}

# Function to check workflow best practices
check_best_practices() {
    local file=$1
    echo "🔍 Checking best practices for $file..."
    
    local issues=0
    
    # Check for node version consistency
    if grep -q "node-version:" "$file"; then
        local node_versions=$(grep "node-version:" "$file" | awk '{print $2}' | tr -d '"' | sort -u)
        local version_count=$(echo "$node_versions" | wc -l)
        if [ "$version_count" -gt 1 ]; then
            echo -e "${YELLOW}⚠️  Multiple Node.js versions found: $node_versions${NC}"
            issues=$((issues + 1))
        fi
    fi
    
    # Check for cache usage
    if grep -q "npm install" "$file" && ! grep -q "actions/cache" "$file"; then
        echo -e "${YELLOW}⚠️  npm install found without caching${NC}"
        issues=$((issues + 1))
    fi
    
    # Check for artifact retention
    if grep -q "actions/upload-artifact" "$file"; then
        if ! grep -A 5 "actions/upload-artifact" "$file" | grep -q "retention-days"; then
            echo -e "${YELLOW}⚠️  Upload artifact without retention-days${NC}"
            issues=$((issues + 1))
        fi
    fi
    
    # Check for timeout settings on long-running jobs
    if grep -q "playwright\|pw:" "$file" && ! grep -A 10 -B 10 "playwright\|pw:" "$file" | grep -q "timeout-minutes"; then
        echo -e "${YELLOW}⚠️  Playwright tests without timeout-minutes${NC}"
        issues=$((issues + 1))
    fi
    
    if [ $issues -eq 0 ]; then
        echo -e "${GREEN}✅ Best practices check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  $issues potential issues found${NC}"
    fi
    
    return $issues
}

# Function to check for required secrets
check_secrets() {
    local file=$1
    echo "🔐 Checking secret usage in $file..."
    
    local secrets=$(grep -o 'secrets\.[A-Z_]*' "$file" | sort -u || true)
    if [ -n "$secrets" ]; then
        echo "📝 Required secrets for this workflow:"
        echo "$secrets" | sed 's/secrets\./  - /'
    else
        echo -e "${GREEN}✅ No secrets required${NC}"
    fi
}

# Main validation
workflow_dir="$(dirname "$0")"
cd "$workflow_dir"

total_files=0
valid_files=0
total_issues=0

echo "📁 Workflow directory: $workflow_dir"
echo ""

for workflow in *.yml *.yaml; do
    if [ -f "$workflow" ]; then
        echo "----------------------------------------"
        echo "📄 Processing: $workflow"
        echo "----------------------------------------"
        
        total_files=$((total_files + 1))
        
        # Validate YAML syntax
        if validate_yaml "$workflow"; then
            valid_files=$((valid_files + 1))
            
            # Check best practices
            check_best_practices "$workflow"
            issues=$?
            total_issues=$((total_issues + issues))
            
            # Check secrets
            check_secrets "$workflow"
        fi
        
        echo ""
    fi
done

# Summary
echo "========================================"
echo "📊 Validation Summary"
echo "========================================"
echo "📁 Total files processed: $total_files"
echo "✅ Valid YAML files: $valid_files"
echo "⚠️  Total issues found: $total_issues"

if [ $valid_files -eq $total_files ] && [ $total_issues -eq 0 ]; then
    echo -e "${GREEN}🎉 All workflows are valid and follow best practices!${NC}"
    exit 0
elif [ $valid_files -eq $total_files ]; then
    echo -e "${YELLOW}✅ All workflows have valid YAML, but $total_issues best practice issues found${NC}"
    exit 0
else
    echo -e "${RED}❌ Some workflows have validation errors${NC}"
    exit 1
fi