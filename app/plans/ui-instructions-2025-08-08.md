# UI Instructions - 2025-08-08 (Prioritized & Refined)

This document provides detailed, step-by-step instructions for a junior developer to implement the UI changes outlined in the `ui-iteration-2025-08-08.md` file. The tasks are prioritized to tackle the simplest items first and to group related tasks together.

**A Note for the Developer:** Before you start, remember to use the global search functionality in your IDE. It is your most powerful tool for locating the components and code snippets mentioned in these instructions. If a file path is a suggestion, you can confirm it by searching for a unique piece of text from that UI element (e.g., a button label or a title).

---

## Tier 1: Low-Hanging Fruit (Simple, isolated changes)

These are small, visual, or logical fixes that are contained within a single component.

### 1. Timetable: Increase bottom margin

*   **File to modify:** `src/pages/Timetable.page.tsx`
*   **Task:** The bottom margin of the timetable needs to be increased for better spacing.
*   **Instructions:**
    1.  Open `src/pages/Timetable.page.tsx`.
    2.  Locate the main container `div` that wraps the `<Timetable />` component.
    3.  Add a bottom margin utility class to it. For example, `mb-8` should provide adequate spacing.

### 2. Sidebar: blue outline on second element only on startup

*   **File to modify:** `src/layouts/sidebar/AppSidebar.component.tsx`
*   **Task:** A blue focus outline appears on a sidebar element on page load, which is distracting. This needs to be prevented.
*   **Instructions:**
    1.  Open `src/layouts/sidebar/AppSidebar.component.tsx`.
    2.  The issue is likely that an element is being automatically focused. We can prevent this.
    3.  Find the component that renders the list of navigation links. It might be a `nav` or `div` element.
    4.  If you can identify the specific link that gets focus, add the prop `autoFocus={false}` to it. If it's the container, you can try adding it there.

### 3. Lesson when layout upside down: padding under prev lessons missing

*   **File to modify:** `src/pages/Lessons.page.tsx`
*   **Task:** When the lesson layout is inverted, the padding at the bottom of the "previous lessons" section is missing.
*   **Instructions:**
    1.  Open `src/pages/Lessons.page.tsx`.
    2.  Locate the container for the "previous lessons" list. You will likely see a prop or state variable that controls the layout inversion (e.g., `isLayoutInverted`).
    3.  Use the `cn` utility to conditionally apply a padding class (e.g., `pb-4`) to the container when the layout is inverted.

### 4. Switch buttons in delete repertoire item drawer

*   **File to modify:** `src/components/features/repertoire/DeleteRepertoireItem.component.tsx` (Confirm by searching for the text "Möchtest du dieses Repertoirestück wirklich löschen?")
*   **Task:** The primary (delete) and secondary (abort) buttons are in the wrong order.
*   **Instructions:**
    1.  Open the `DeleteRepertoireItem.component.tsx` file.
    2.  You will see the `<DeleteAbortButtons />` component. The `onDelete` and `onAbort` props determine the button order. Simply swap the visual order of the buttons within that component or, if they are passed as children, swap their order in the JSX.

### 5. Separator in create note modal

*   **File to modify:** `src/components/features/notes/CreateNote.component.tsx` (Confirm by searching for the form used to create a new note).
*   **Task:** The form for creating a new note needs a visual separator to improve layout.
*   **Instructions:**
    1.  Open the `CreateNote.component.tsx` file.
    2.  Add a `<Separator />` component (imported from `@/components/ui/separator`) between the last form input and the action buttons at the bottom.

### 6. Check spacing create repertoire item

*   **File to modify:** `src/components/features/repertoire/CreateRepertoireItem.component.tsx`
*   **Task:** The spacing in the create repertoire item form is inconsistent with other forms.
*   **Instructions:**
    1.  Open the `CreateRepertoireItem.component.tsx` file.
    2.  For a good reference, look at `src/components/features/notes/CreateNote.component.tsx`. Notice the spacing between labels, inputs, and buttons.
    3.  Adjust the margin and padding of the form elements in the repertoire form to match the note form's spacing.

### 7. Student drawer: add first and last name to card

*   **File to modify:** `src/components/features/students/StudentDrawer.component.tsx` (This is a likely candidate).
*   **Task:** The student drawer should display the student's full name.
*   **Instructions:**
    1.  Locate the component responsible for rendering the student drawer.
    2.  The `student` object available in this component contains `firstName` and `lastName` properties. Ensure both are being rendered in the drawer's header or title section, likely by concatenating them with a space in between.

### 8. Repertoire item drawer: end datum is startdatum

*   **File to modify:** `src/components/features/repertoire/RepertoireDrawer.component.tsx` (This is a likely candidate).
*   **Task:** A bug is causing the end date to be the same as the start date.
*   **Instructions:**
    1.  Locate the component for the repertoire item drawer.
    2.  Find where the end date is displayed. Trace the `endDate` variable back to its source. It is likely a prop being passed to the component. Ensure the correct prop is being accessed and displayed.

### 9. Group mobile drawer: weird time format, should be H:i

*   **File to modify:** `src/components/features/groups/GroupDrawer.component.tsx` (This is a likely candidate).
*   **Task:** The time is not formatted correctly.
*   **Instructions:**
    1.  Locate the group mobile drawer component.
    2.  Find where the time is rendered. You will likely see a date variable.
    3.  Use the `date-fns` library (already a dependency) to format the time. The format string you need is `'HH:mm'`.

### 10. Update Group drawer: day when empty should not default to monday in select

*   **File to modify:** `src/components/features/groups/UpdateGroup.component.tsx` (This is a likely candidate).
*   **Task:** The day selection in the "Update Group" form incorrectly defaults to Monday.
*   **Instructions:**
    1.  Locate the "Update Group" form component.
    2.  Find the `<Select>` component for the `dayOfLesson` field.
    3.  Check the `defaultValue` or `value` prop. Ensure it is being set to `null` or an empty string if `group.dayOfLesson` is not set, instead of defaulting to "Monday".

---

## Tier 2: Mobile Drawer Unification

These tasks are grouped because they all relate to standardizing the design of mobile drawers. They should be done in order.

### 11. Make sure all buttons in all mobile drawers are full width

*   **Files to modify:** Various drawer components in `src/components/features/*`.
*   **Task:** All buttons in mobile drawers should be full-width for a better mobile experience.
*   **Strategy:** Search for files named `*Drawer.component.tsx` or similar within `src/components/features`. In each of these files, inspect the `<Button>` components.
*   **Instructions:**
    1.  For each drawer component you find, add the `w-full` class to the `<Button>` components that are used as primary or secondary actions.
    2.  The "Abort" or "Cancel" button, if it exists, should always be the last button in the drawer.

### 12. Consistent drawer design: Add Separator for mobile

*   **Files to modify:** The same drawer components identified in the previous step.
*   **Task:** Add a separator between the main content and the action buttons in mobile drawers.
*   **Instructions:**
    1.  In each drawer component, add a `<Separator className="my-4" />` component between the informational content/form and the final block of action buttons. The `my-4` class will provide consistent vertical spacing.

### 13. Unify design mobile drawers

*   **Files to modify:** The same drawer components identified in the previous steps.
*   **Task:** Apply a consistent design language to all mobile drawers.
*   **Instructions:**
    *   **Drawers from the bottom:** These should have a close button with an "X" icon. This is typically part of the `<DialogHeader>` or `<DialogClose>` component.
    *   **Drawers from the side:** These should have a back button with a "Chevron left" icon in the header.
    *   **Drawers with forms or actions:** Ensure they have a secondary "Abort" button (e.g., `<Button variant="ghost">`).
    *   **Informational drawers:** These should *not* have an "Abort" button.

---

## Tier 3: High Complexity

This task involves multiple components and requires careful implementation.

### 14. Implement delete lesson

*   **Files to modify:** `src/components/features/lessons/LessonHeader.tsx`
*   **Task:** Add a button to the lesson header to delete the currently viewed lesson.
*   **Instructions:** The good news is that the logic for this is already built! We just need to add the button and wire it up.
    1.  **State for the Dialog:** In `LessonHeader.tsx`, you will need to manage the open/closed state of the confirmation dialog. Add this state at the top of the component: `const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);`
    2.  **Add a Delete Button:** In the JSX of the `LessonHeader` component, add a `<Button>` that will open the dialog. It should be a `destructive` variant.
    3.  **Implement the Dialog:** Use the existing `<Dialog>` and `<DeleteLesson>` components. The `currentLesson` object, which should be available as a prop in this component, has the `id` you need.
    4.  **Example Implementation:**

        ```tsx
        // Add these imports to LessonHeader.tsx
        import { useState } from 'react';
        import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
        import DeleteLesson from './DeleteLesson.component';
        import { Button } from '@/components/ui/button';
        import { Trash2 } from 'lucide-react';

        // ... inside the LessonHeader component function

        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

        // ... in the JSX for the header, add the button and dialog

        <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Lesson
        </Button>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Lesson</DialogTitle>
                </DialogHeader>
                {/* The `currentLesson` variable should be available in this component's scope */}
                <DeleteLesson lessonId={currentLesson.id} onCloseModal={() => setIsDeleteModalOpen(false)} />
            </DialogContent>
        </Dialog>
        ```