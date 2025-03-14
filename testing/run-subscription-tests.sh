#!/usr/bin/env bash
# Test user id
USER_ID='c352cb96-41e4-47ac-81bd-a77bf7865c92'
APP_DIR="$PWD/../app"

# Function to run tests for a state
run_state_tests() {
    local STATE=$1
    local TEST_DIR=$2
    local ORIGINAL_DIR="$PWD" # Store the original directory 

    echo "Testing subscription state: $STATE"
    echo "for user $USER_ID"
    
    # Apply the state using your PHP script that uses SubscriptionStates
    php set-subscription-state.php --state="$STATE" --user="$USER_ID"
    
    cd "$APP_DIR"

    # Run Playwright tests for this state
    npm run pw -- "$TEST_DIR" 
    
    # Store the result
    RESULT=$?
    
    echo "Tests for $STATE completed with status: $RESULT"
    cd "$ORIGINAL_DIR" 
    return $RESULT
}

# Run tests for each subscription state
echo "Running tests for trial subscription..."
run_state_tests "trial" "tests/stripe/common/trial"

echo "Running tests for monthly active subscription..."
run_state_tests "monthly-active" "tests/stripe/common/monthly"
#
# echo "Running tests for expired subscription..."
# run_state_tests "expired" "tests/e2e/expired"

# ... more states

# Clean up
echo "Cleaning up test user..."

echo "All tests completed!"n/
