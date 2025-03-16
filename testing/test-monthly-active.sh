#!/usr/bin/env bash

echo 'trial user'
php setup.php
# JSON file path
json_file="userinfo.json"

# Extract variables using jq
EMAIL=$(jq -r '.email' "$json_file")
PASSWORD=$(jq -r '.password' "$json_file")
USER_ID=$(jq -r '.userId' "$json_file")
CUSTOMER_ID=$(jq -r '.customerId' "$json_file")
LOCALE='de'

export USER_ID
export CUSTOMER_ID
export LOCALE


stripe fixtures './stripe-fixtures/monthly-subscription.json' 
cd ../app
TESTUSER_EMAIL=$EMAIL TESTUSER_PASSWORD=$PASSWORD npm run pw -- --project='monthly-active'
