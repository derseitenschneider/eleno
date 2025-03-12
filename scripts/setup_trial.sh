#!/usr/bin/env bash

# Delete stripe customer, create a new one and reset the user in the database.
cd ../api/scripts;
php reset-user.php;

# Run all trial tests.
cd ../../app;
npm run pw -- tests/stripe/common;


