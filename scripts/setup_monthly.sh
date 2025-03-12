#!/usr/bin/env bash

# Delete stripe customer, create a new one and reset the user in the database. Use the output of the script to set CUSTOMER_ID.
cd ../api/scripts;
SCRIPT_DIR=$(pwd)
CUSTOMER_ID=$(php "$SCRIPT_DIR/reset-subscription.php" | tail -n 1);

# Set other necessary env vars and trigger the fixture.
PRICE_ID="price_1Qp79yGqCC0x0XxstXJPUz84";
USER_ID="c352cb96-41e4-47ac-81bd-a77bf7865c92";
LOCALE="de"

export CUSTOMER_ID;
export PRICE_ID;
export USER_ID;
export LOCALE;

# Run stripe fixture for checkout subscription.
cd ./stripe-fixtures;
echo "Customer id: $CUSTOMER_ID";
echo "Price id: $PRICE_ID";
echo "User id: $USER_ID";
echo "Locale: $LOCALE";

stripe fixtures ./custom_checkout_subscription.json;
