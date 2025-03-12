#!/usr/bin/env bash

# Delete stripe customer, create a new one and reset the user in the database. Use the output of the script to set CUSTOMER_ID.
cd ../api/scripts;
SCRIPT_DIR=$(pwd)
CUSTOMER_ID=$(php "$SCRIPT_DIR/reset-user.php" | tail -n 1);

# Set other necessary env vars and trigger the fixture.
PRICE_ID="price_1Qp79yGqCC0x0XxstXJPUz84";

export CUSTOMER_ID;
export PRICE_ID;

# Run stripe fixture for checkout subscription.
cd ./stripe-fixtures;
echo "Customer id: $CUSTOMER_ID";
echo "Price id: $PRICE_ID";

stripe fixtures ./custom_checkout_subscription.json;
