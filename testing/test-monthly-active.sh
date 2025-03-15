#!/usr/bin/env bash

# Configuration
USER_ID='c352cb96-41e4-47ac-81bd-a77bf7865c92'
APP_DIR="$PWD/../app"
SUBSCRIPTION_STATE="monthly-active"
PLAYWRIGHT_PROJECT="monthly-active"

# Apply the subscription state
echo "-------------------------"
echo "Setting subscription state to: $SUBSCRIPTION_STATE"
php set-subscription-state.php --state="$SUBSCRIPTION_STATE" --user="$USER_ID"
echo "-------------------------"
# Run Playwright tests
echo "Running Playwright tests for: $SUBSCRIPTION_STATE"
cd "$APP_DIR"
npm run pw -- --project="$PLAYWRIGHT_PROJECT"
cd ..

# Report status
TEST_RESULT=$?
if [ $TEST_RESULT -eq 0 ]; then
    echo "Tests for $SUBSCRIPTION_STATE completed successfully!"
else
    echo "Tests for $SUBSCRIPTION_STATE failed!"
fi

exit $TEST_RESULT
