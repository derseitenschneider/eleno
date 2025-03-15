#!/usr/bin/env bash

echo "Running all subscription state tests..."

# Run trial tests
echo "Running trial tests..."
./test-trial.sh
TRIAL_RESULT=$?

# Run monthly active tests
echo "Running monthly active tests..."
./test-monthly-active.sh
MONTHLY_ACTIVE_RESULT=$?

# ... add more state tests here ...

# Report overall status
echo "-------------------------"
echo "Test Summary:"

if [ $TRIAL_RESULT -eq 0 ]; then
    echo "Trial tests: PASSED"
else
    echo "Trial tests: FAILED"
fi

if [ $MONTHLY_ACTIVE_RESULT -eq 0 ]; then
    echo "Monthly active tests: PASSED"
else
    echo "Monthly active tests: FAILED"
fi

# Reset subscription state
echo "-------------------------"
echo "Resetting to active monthly..."
./test-reset.sh
# Determine overall exit code
if [ $TRIAL_RESULT -ne 0 ] || [ $MONTHLY_ACTIVE_RESULT -ne 0 ]; then
    exit 1 # Overall failure
else
    exit 0 # Overall success
fi
