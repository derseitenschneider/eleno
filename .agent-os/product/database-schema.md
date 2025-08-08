# Database Schema Documentation

> Last Updated: 2025-08-08
> Version: 1.0.0
> Database: Supabase PostgreSQL

## Overview

Eleno uses Supabase PostgreSQL as its primary database with a comprehensive schema designed for music education management. The database supports 276 active users with over 55,000 lesson records and extensive student/teacher relationships.

## Core Tables

### Students Table (`students`)
**Records:** 3,113 active students  
**Purpose:** Central student management with scheduling and preferences

**Key Columns:**
- `id` (bigint, PK): Auto-generated student identifier
- `firstName`, `lastName` (text): Student name fields
- `instrument` (text): Primary instrument studied
- `dayOfLesson` (weekdays enum): German weekday scheduling
- `startOfLesson`, `endOfLesson` (text): Lesson time slots
- `durationMinutes` (smallint): Lesson duration
- `location` (text): Teaching location
- `archive` (boolean): Active/inactive status (default: false)
- `homework_sharing_authorized` (boolean): Parent consent for homework sharing
- `user_id` (uuid, FK): Links to teacher's auth profile

**Relationships:**
- One-to-many with lessons, notes, repertoire, todos
- Many-to-one with auth.users (teacher)

### Lessons Table (`lessons`) 
**Records:** 45,973 documented lessons  
**Purpose:** Complete lesson history with content and homework

**Key Columns:**
- `id` (bigint, PK): Auto-generated lesson identifier
- `lessonContent` (text): Detailed lesson notes and activities
- `homework` (text): Assigned homework description
- `date` (date): Lesson date
- `studentId` (bigint, FK): Links to individual student
- `groupId` (bigint, FK): Links to group lessons
- `homeworkKey` (uuid, unique): Shareable homework access token
- `expiration_base` (date): Homework access expiration calculation
- `status` (lesson_status): 'documented' or 'prepared' state
- `user_id` (uuid, FK): Teacher ownership

**Business Logic:**
- Homework sharing via unique URLs with expiring access
- Dual support for individual and group lessons
- Automatic expiration management for shared content

### Groups Table (`groups`)
**Records:** 80 active groups/bands  
**Purpose:** Ensemble and group lesson management

**Key Columns:**
- `id` (bigint, PK): Auto-generated group identifier
- `name` (text): Group/band name
- `students` (jsonb array): Array of student references
- `dayOfLesson` (weekdays): Group lesson scheduling
- `startOfLesson`, `endOfLesson` (time): Group lesson duration
- `location` (text): Rehearsal/lesson location
- `durationMinutes` (smallint): Session length
- `archive` (boolean): Active status
- `homework_sharing_authorized` (boolean): Group homework consent
- `user_id` (uuid, FK): Teacher ownership

### Notes Table (`notes`)
**Records:** 2,761 teaching notes  
**Purpose:** Multi-category note system with visual organization

**Key Columns:**
- `id` (bigint, PK): Note identifier
- `title`, `text` (text): Note content
- `studentId` (bigint, FK): Individual student notes
- `groupId` (bigint, FK): Group/band notes
- `backgroundColor` (background_colors): Color coding (blue/red/green/yellow)
- `order` (smallint): Drag-and-drop positioning
- `user_id` (uuid, FK): Teacher ownership

**Features:**
- Color-coded categorization for quick visual scanning
- Drag-and-drop reordering with persistent order values
- Supports both individual student and group notes

### Repertoire Table (`repertoire`)
**Records:** 3,917 tracked musical pieces  
**Purpose:** Musical progression and performance tracking

**Key Columns:**
- `id` (bigint, PK): Repertoire entry identifier
- `title` (text): Musical piece name/description
- `startDate` (date): When piece was introduced
- `endDate` (date): When piece was completed/performed
- `studentId` (bigint, FK): Individual student repertoire
- `groupId` (bigint, FK): Group/band repertoire
- `user_id` (uuid, FK): Teacher ownership

**Use Cases:**
- Track student musical progression over time
- Plan recitals and performances
- Monitor learning pace and difficulty progression

### Todos Table (`todos`)
**Records:** 2,844 active tasks  
**Purpose:** Teacher task management system

**Key Columns:**
- `id` (bigint, PK): Todo identifier
- `text` (text): Task description
- `due` (date): Optional due date
- `completed` (boolean): Completion status
- `studentId` (bigint, FK): Student-specific tasks
- `groupId` (bigint, FK): Group-related tasks
- `user_id` (uuid, FK): Teacher ownership

**Categories:**
- General teaching administration
- Student-specific tasks (sheet music, equipment)
- Group/performance preparation
- Concert and recital planning

## System Tables

### Profiles Table (`profiles`)
**Records:** 276 user profiles  
**Purpose:** Extended user information and analytics

**Key Columns:**
- `id` (uuid, PK): Links to auth.users
- `first_name`, `last_name` (text): User identity
- `email` (text, unique): Contact information
- `login_count` (integer): Usage analytics
- `last_lesson_creation` (timestamptz): Activity tracking
- `organization_id` (uuid, FK): Multi-tenant support
- `organization_role` (organization_role): Permission level

### Settings Table (`settings`)
**Records:** 276 user preferences  
**Purpose:** Personalized application configuration

**Key Columns:**
- `user_id` (uuid, unique FK): User preferences
- `lesson_main_layout` (lesson_main_layout): 'regular' or 'reverse' layout

### Stripe Subscriptions Table (`stripe_subscriptions`)
**Records:** 276 subscription records  
**Purpose:** Payment and subscription management

**Key Columns:**
- `user_id` (uuid, unique FK): Account owner
- `stripe_customer_id` (text, unique): Stripe customer reference
- `stripe_subscription_id` (text, unique): Stripe subscription reference
- `payment_status` (text): Payment state
- `subscription_status` (subscription_status): Account status
- `plan` (subscription_plan): Billing plan type
- `period_start`, `period_end` (date): Billing cycle
- `currency` (text): Payment currency
- `failed_payment_attempts` (smallint): Payment retry tracking

**Subscription Plans:**
- `month`: Monthly subscription
- `year`: Annual subscription  
- `lifetime`: One-time payment
- `licensed`: Organizational licensing

### Organizations Table (`organizations`)
**Records:** 1 organization  
**Purpose:** Multi-tenant and institutional support

**Key Columns:**
- `id` (uuid, PK): Organization identifier
- `name` (text): Institution name
- `street`, `street_number`, `zip_code`, `city`, `country`: Address information
- `license_count` (integer): Permitted user count
- `billing_interval` (billing_interval): Payment frequency
- `billing_cycle_start` (date): License billing start
- `admin_contact_email` (text): Primary contact
- `active` (boolean): Organization status

## Communication System

### Messages Table (`messages`)
**Records:** 293 messages  
**Purpose:** In-app messaging system

**Key Columns:**
- `id` (uuid, PK): Message identifier
- `recipient` (uuid, FK): Message recipient
- `subject`, `body` (text): Message content
- `status` (message_status): 'sent', 'read', or 'trash'

### Message Templates Table (`message_templates`)
**Records:** 7 templates  
**Purpose:** Standardized communication templates

**Key Columns:**
- `name` (text, unique): Template identifier
- `subject`, `body` (text): Template content

## Notification System

### Notifications Table (`notifications`)
**Records:** 1 active notification  
**Purpose:** System-wide user notifications

**Key Columns:**
- `identifier` (text, unique): Frontend notification key
- `type` (notification_type): 'survey', 'update', 'news', 'alert'
- `active` (boolean): Notification status
- `expires_at` (date): Expiration date
- `display_frequency` (notification_display_frequency): 'once', 'daily', 'always'

### Notification Views Table (`notification_views`)
**Records:** 81 interaction records  
**Purpose:** User notification interaction tracking

**Key Columns:**
- `notification_id` (bigint, FK): Links to notifications
- `user_id` (uuid, FK): User who interacted
- `viewed_at` (timestamptz): Interaction timestamp
- `action_taken` (notification_action_taken): 'dismissed', 'completed', 'clicked'
- `results` (jsonb): Action-specific data

## Feature Management

### Feature Flags Table (`feature_flags`)
**Records:** 2 feature flags  
**Purpose:** Controlled feature rollouts

**Key Columns:**
- `flag_name` (varchar, unique): Feature identifier
- `enabled` (boolean): Global feature state

### Feature Flag Users Table (`feature_flag_users`)
**Records:** 1 user assignment  
**Purpose:** User-specific feature access

**Key Columns:**
- `flag_id` (integer, FK): Links to feature_flags
- `user_id` (uuid, FK): User with feature access

## Custom Data Types

### Enums

**weekdays:** German weekday scheduling
- Values: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag

**lesson_status:** Lesson preparation states
- Values: documented, prepared

**background_colors:** Note color coding
- Values: blue, red, green, yellow

**subscription_plan:** Billing plan types
- Values: month, year, lifetime, licensed

**subscription_status:** Account status tracking
- Values: active, canceled, trial, expired, licensed

**message_status:** Communication states
- Values: sent, read, trash

**notification_type:** System notification categories
- Values: survey, update, news, alert

**notification_display_frequency:** Display control
- Values: once, daily, always

**notification_action_taken:** User interaction types
- Values: dismissed, completed, clicked

**organization_role:** Permission levels
- Values: admin, member

**billing_interval:** Payment frequency
- Values: month, year

**lesson_main_layout:** UI layout preferences
- Values: regular, reverse

## Database Extensions

**Security & Authentication:**
- `pgjwt`: JSON Web Token API for secure authentication
- `pgcrypto`: Cryptographic functions for data security
- `pgsodium`: Libsodium encryption functions

**Performance & Monitoring:**
- `pg_stat_statements`: Query performance monitoring and optimization
- `pg_net`: Async HTTP capabilities for external integrations

**Automation:**
- `pg_cron`: Job scheduling for automated tasks
- `uuid-ossp`: UUID generation for unique identifiers

**API & Integration:**
- `pg_graphql`: GraphQL support for flexible API queries

## Relationships & Constraints

### Primary Relationships

**Users to Content:**
- `auth.users` → `profiles` (1:1)
- `auth.users` → `students` (1:many)
- `auth.users` → `lessons` (1:many)
- `auth.users` → `groups` (1:many)
- `auth.users` → `notes` (1:many)
- `auth.users` → `repertoire` (1:many)
- `auth.users` → `todos` (1:many)

**Content Relationships:**
- `students` → `lessons` (1:many)
- `students` → `notes` (1:many)  
- `students` → `repertoire` (1:many)
- `students` → `todos` (1:many)
- `groups` → `lessons` (1:many)
- `groups` → `notes` (1:many)
- `groups` → `repertoire` (1:many)
- `groups` → `todos` (1:many)

**System Relationships:**
- `organizations` → `profiles` (1:many)
- `notifications` → `notification_views` (1:many)
- `feature_flags` → `feature_flag_users` (1:many)

### Data Integrity

**Unique Constraints:**
- `lessons.homeworkKey`: Prevents homework URL conflicts
- `stripe_subscriptions.user_id`: One subscription per user
- `profiles.email`: Unique contact information
- `settings.user_id`: One preference set per user

**Check Constraints:**
- `profiles.first_name`: Minimum 3 characters
- Character limits on text fields for performance

## Business Logic Integration

### Homework Sharing System
- `lessons.homeworkKey` generates unique shareable URLs
- `lessons.expiration_base` manages access timeouts
- `students.homework_sharing_authorized` enforces parental consent

### Multi-Tenancy Support
- `organizations` table enables institutional deployments
- `profiles.organization_id` links users to institutions
- `profiles.organization_role` manages permissions

### Subscription Management
- Integration with Stripe via `stripe_subscriptions`
- Trial period management with automatic conversions
- Multiple billing models (monthly/yearly/lifetime/licensed)

### Analytics & Tracking
- `profiles.login_count` for usage analytics
- `profiles.last_lesson_creation` for activity monitoring
- `notification_views` for feature engagement tracking

This schema supports Eleno's comprehensive music teaching platform with robust data integrity, multi-tenancy, and integration capabilities.