# Eleno Organization Management

This document outlines the database functions and workflow for managing teacher licenses within an organization (e.g., a music school) in the Eleno application.

## 1. Overview

This feature allows an organization to purchase and manage licenses for its teachers. When a teacher is added to an organization, their account is converted to a "licensed" plan, which overrides any individual Stripe subscription they may have. The system is designed to be managed by an organization administrator from within the application or by a database administrator directly.

## 2. Core Functions & Workflow

Two main SQL functions handle adding and removing users. They are designed with a security model that allows calls from both the application (via an organization admin) and the Supabase SQL Editor (via a superuser).

### Adding a User to an Organization

This process assigns a user to an organization and converts their plan to "licensed".

- **Function:** `add_user_to_organization(user_id_to_add uuid, org_id uuid, user_role organization_role)`
- **SQL Call:**
  ```sql
  SELECT add_user_to_organization(
    'user-uuid-to-add',
    'organization-uuid',
    'member' -- or 'admin'
  );
  ```

#### Workflow Steps:

1.  An organization admin calls the function from the Eleno app.
2.  The function updates the user's record in the `profiles` table, setting their `organization_id` and `organization_role`.
3.  It then updates their `stripe_subscriptions` record, setting the `plan` to `'licensed'` and `subscription_status` to `'active'`.
4.  **Handling Existing Subscriptions**:
    - If the user already has an active subscription (`'month'` or `'year'`), the function will still perform the updates above but will **return the user's `stripe_customer_id`**.
    - Your application must check for this return value. If a customer ID is returned, you must then use it to **cancel the user's subscription via the Stripe API**.
    - If the user has no active subscription, the function returns `NULL`.

### Removing a User from an Organization

This process reverts a user back to a standard account, effectively removing their "licensed" seat.

- **Function:** `remove_user_from_organization(user_id_to_remove uuid)`
- **SQL Call:**
  ```sql
  SELECT remove_user_from_organization('user-uuid-to-remove');
  ```

#### Workflow Steps:

1.  An organization admin calls the function.
2.  The function sets the `organization_id` and `organization_role` fields on the user's `profile` back to `NULL`.
3.  It sets the `subscription_status` in their `stripe_subscriptions` record to `'canceled'`. The user will need to purchase a new plan to continue using paid features.

## 3. Security Model

The functions are secured to prevent unauthorized access while allowing for administrative control:

- **Application Use**: When called from the app (via RPC), the functions check that the logged-in user (`auth.uid()`) is an `'admin'` of the relevant organization.
- **Admin Use**: When run in the Supabase SQL Editor, the functions detect that the `current_user` is `'postgres'` and bypass the admin check, allowing a database administrator to manage users directly.
