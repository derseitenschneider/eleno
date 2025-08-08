# Product Mission

> Last Updated: 2025-08-08
> Version: 1.0.0

## Pitch

Eleno is a comprehensive lesson documentation platform that helps German-speaking instrumental music teachers streamline student management, lesson documentation, homework assignment, and teaching organization by providing an integrated web-based solution with shareable homework links and automated todo management.

## Users

### Primary Customers

- **Private Instrumental Teachers**: Independent music teachers teaching piano, guitar, violin, and other instruments
- **Music Schools**: Educational institutions offering structured instrumental programs
- **Band Coaches**: Teachers managing group lessons and ensemble rehearsals

### User Personas

**Maria - Private Piano Teacher** (35-55 years old)
- **Role:** Independent Piano Instructor
- **Context:** Teaches 20-30 students weekly from home studio, manages individual lesson progression
- **Pain Points:** Manual lesson notes, homework tracking, student progress documentation, todo management for concerts and sheet music
- **Goals:** Streamlined lesson documentation, efficient homework sharing, organized student repertoire tracking

**Thomas - Music School Instructor** (28-45 years old)
- **Role:** Guitar Teacher at Regional Music School
- **Context:** Manages both individual and group lessons, coordinates with school administration
- **Pain Points:** Student absence tracking, coordinated scheduling, bulk communication with parents
- **Goals:** Integrated absence recording, automated scheduling optimization, comprehensive student oversight

**Lisa - Band Coach** (30-50 years old)
- **Role:** Ensemble Director
- **Context:** Manages multiple bands, coordinates group rehearsals and performances
- **Pain Points:** Group coordination, performance preparation, member availability tracking
- **Goals:** Efficient group management, streamlined performance planning, member progress tracking

## The Problem

### Fragmented Teaching Administration

Music teachers currently juggle multiple disconnected tools for lesson notes, homework assignment, and student communication. This results in 2-3 hours weekly of administrative overhead and inconsistent documentation quality.

**Our Solution:** Integrated platform combining lesson documentation, homework management, and teaching organization in one German-optimized interface.

### Inefficient Homework Sharing

Teachers manually create and distribute homework materials, leading to lost assignments and unclear expectations. Students lose access to materials between lessons.

**Our Solution:** Shareable homework links with expiring access (2-week default) ensuring materials reach students securely while maintaining control over distribution.

### Poor Student Progress Tracking

Repertoire progress and lesson history scatter across paper notes and memory, making long-term student development difficult to assess and communicate to parents.

**Our Solution:** Comprehensive repertoire management system tracking past/current songs with integrated lesson history and progress notes.

### Scheduling Complexity

Teachers manually coordinate lesson times with individual students and parents, leading to scheduling conflicts, missed lessons, and inefficient time slot utilization.

**Our Solution:** Automated scheduling system with teacher availability input and student/parent preference forms generating optimal timetables.

## Differentiators

### German Market Focus

Unlike generic international platforms, Eleno provides native German interface and workflows specifically designed for the German-speaking music education market. This results in 40% faster adoption and higher user satisfaction compared to translated alternatives.

### Hybrid Backend Architecture

Unlike purely SaaS solutions, we combine Supabase PostgreSQL with custom PHP API integration, providing both modern real-time features and robust payment processing. This enables seamless Stripe subscription management while maintaining data flexibility.

### Progressive Web App Priority

Unlike mobile-first competitors, we prioritize PWA functionality over native apps, resulting in faster deployment, consistent cross-platform experience, and reduced development overhead while maintaining offline capabilities.

## Key Features

### Core Features

- **Student & Group Management:** Comprehensive individual student profiles and band/group coordination with member tracking
- **Lesson Documentation:** Structured lesson history with searchable notes and progress tracking
- **Homework Assignment:** Shareable links with expiring access (customizable duration, 2-week default)
- **Multi-Note System:** Multiple note categories per student for different aspects of instruction
- **Repertoire Management:** Track past and current songs with progression status and performance readiness

### Organization Features

- **Teacher Todo Lists:** Organized task management for concerts, sheet music procurement, and administrative tasks
- **Absence Recording:** Track student and teacher absences with reasons and makeup lesson coordination
- **Subscription Management:** Integrated Stripe payment processing with automated billing
- **Progressive Web App:** Offline-capable application with desktop and mobile optimization

### Advanced Features

- **Auto-Scheduling System:** Teacher availability input with optimal timetable generation
- **Student/Parent Forms:** Availability input interfaces with notification system for schedule changes
- **Comprehensive Testing:** End-to-end Playwright testing and unit test coverage ensuring reliability