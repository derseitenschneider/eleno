# Changelog

All notable changes to this project will be documented in this file.

## [2025-08-08] - UI Improvements & Mobile Optimizations

### Fixed

- **Timetable**: Reduced bottom margin from `pb-12` to `pb-6` for better spacing
- **Sidebar**: Removed blue outline on "Unterrichten" button that appeared on startup by adding `autoFocus={false}`
- **Lesson Layout**: Fixed padding consistency between regular and inverted layouts by standardizing bottom padding to `pb-6`
- **Delete Repertoire Item**: Swapped button order - "Löschen" now appears first, "Abbrechen" second, and added responsive classes `w-full sm:w-auto` for proper mobile display
- **Create Note Modal**: Added consistent separator with `my-4` spacing between editor and action buttons
- **Student Mobile Drawer**: Split name display into separate fields with German labels - "Vorname" (First name) and "Nachname" (Last name)
- **Repertoire Item Mobile Drawer**: Fixed end date bug - was incorrectly displaying start date instead of end date
- **Group Mobile Drawer**: Implemented proper time formatting using `date-fns` with `HH:mm` format
- **Group & Student Day Selection**: Fixed day selection to not default to Monday when field is empty by changing from `defaultValue` to `value` prop
- **Create Repertoire Item**: Reverted spacing changes - restored original margins (`mb-8 mt-6`, `sm:mb-12`), gap (`gap-16`), and separator spacing (`my-6`)

### Added

- **Delete Lesson Functionality**: Added "Lektion löschen" button to mobile lesson drawer with full delete functionality using bottom-up drawer instead of side drawer
- **Mobile Drawer Consistency**: Ensured all buttons in mobile drawers are full-width with `w-full` classes
- **Mobile Drawer Design**: Unified design across all mobile drawers:
  - Consistent separator spacing (`my-4`)
  - ChevronLeft close buttons for side drawers
  - "Abbrechen" buttons for drawers with actions
  - Proper responsive button widths

### Enhanced

- **Mobile User Experience**: All mobile drawers now follow consistent design patterns with proper button widths, separators, and navigation elements
- **Form Accessibility**: Improved day selection behavior in both Group and Student update forms to prevent unwanted default selections
- **Lesson Management**: Mobile lesson drawer now includes complete CRUD operations (Create, Read, Update, Delete) with proper mobile-optimized UI patterns