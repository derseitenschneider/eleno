# Eleno Agentic Style Guide

**Purpose**: This guide ensures all AI agents apply consistent styling when working on the Eleno codebase.

## 🎯 Quick Reference

### Critical Rules
1. **ALWAYS use Tailwind utility classes** - Never write custom CSS
2. **ALWAYS use design tokens** - Never hardcode colors
3. **ALWAYS follow component patterns** - Use existing shadcn/ui components
4. **ALWAYS test dark mode** - Toggle `.dark-mode` class on root
5. **NEVER use inline styles** - Use Tailwind classes instead

## 🎨 Color System

### Color Token Usage Map

```typescript
// PRIMARY ACTIONS
"bg-primary"                  // Primary buttons, links
"text-primary"                // Links, primary text
"hover:bg-primary-hover"      // Primary button hover
"text-primary-foreground"     // Text on primary background
"ring-primary"                // Focus rings

// BACKGROUNDS (Layered System)
"bg-backgroundPlain"          // Cards, modals (highest level)
"bg-background50"             // Subtle backgrounds
"bg-background100"            // Main app background
"bg-background200"            // Pressed/active states

// SEMANTIC COLORS
"bg-destructive"              // Delete buttons
"text-destructive"            // Error text
"bg-warning"                  // Warning badges
"text-warning"                // Warning text
"bg-secondary"                // Secondary buttons
"bg-muted"                    // Disabled states
"text-muted-foreground"       // Secondary text

// BORDERS
"border-hairline"             // All borders
"divide-hairline"             // Dividers

// NOTE COLORS (Special)
"border-noteGreen"            // Green notes
"border-noteYellow"           // Yellow notes
"border-noteBlue"             // Blue notes
"border-noteRed"              // Red notes
```

### Dark Mode Implementation
```typescript
// Component automatically adapts via CSS variables
<div className="bg-background100 text-foreground">
  // Content adapts to theme
</div>

// DON'T: Never conditionally apply dark mode classes
// ❌ WRONG: className={isDark ? "bg-gray-900" : "bg-white"}
// ✅ RIGHT: className="bg-background100"
```

## 🧩 Component Selection Guide

### Buttons
```typescript
// Decision tree for button variants:
// Is it the primary action? → variant="default"
// Is it destructive? → variant="destructive"
// Is it secondary? → variant="outline" or variant="secondary"
// Is it tertiary/minimal? → variant="ghost"
// Is it a navigation link? → variant="link"

// Examples:
<Button>Save Lesson</Button>                          // Primary
<Button variant="outline">Cancel</Button>             // Secondary
<Button variant="destructive">Delete Student</Button> // Destructive
<Button variant="ghost" size="icon"><X /></Button>    // Icon button
```

### Form Elements
```typescript
// Always use Form component wrapper for forms
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Pattern:
<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Cards & Containers
```typescript
// Card for contained content
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    // Content
  </CardContent>
</Card>

// Simple container
<div className="rounded-lg border border-hairline bg-backgroundPlain p-6">
  // Content
</div>
```

## 📏 Spacing System

### Padding/Margin Scale
```typescript
// Use consistent spacing scale
"p-0"   // 0px
"p-1"   // 0.25rem (4px)
"p-2"   // 0.5rem (8px)
"p-3"   // 0.75rem (12px)
"p-4"   // 1rem (16px)
"p-5"   // 1.25rem (20px)
"p-6"   // 1.5rem (24px)
"p-8"   // 2rem (32px)

// Common patterns
"space-y-4"              // Vertical spacing between elements
"gap-4"                  // Grid/flex gap
"p-6"                    // Card padding
"px-4 py-2"              // Button padding
"mb-4"                   // Section spacing
```

### Responsive Patterns
```typescript
// Mobile-first approach
"w-full sm:w-auto"       // Full width on mobile, auto on desktop
"px-4 sm:px-6"           // Different padding
"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"  // Responsive grid

// Common breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
```

## 🏗️ Common UI Patterns

### Page Layout
```typescript
<div className="container-page">
  <h1 className="mb-[.75em] text-2xl font-semibold text-foreground/90 tracking-tighter">
    Page Title
  </h1>
  <div className="space-y-6">
    {/* Content sections */}
  </div>
</div>
```

### Table Pattern
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Modal/Dialog Pattern
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Loading States
```typescript
// Skeleton for loading
<Skeleton className="h-10 w-full" />

// Spinner in button
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// Mini loader component
<MiniLoader />
```

## 🎓 Domain-Specific Patterns

### Student/Group Lists
- Use DataTable component with columns configuration
- Include search bar with SearchBar component
- Add create button in top-right
- Use badges for status (active/inactive)

### Lesson Components
```typescript
// Lesson item card
<div className="rounded-lg border border-hairline bg-backgroundPlain p-4">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="font-semibold">{lesson.title}</h3>
      <p className="text-sm text-muted-foreground">{lesson.date}</p>
    </div>
    <Badge variant={lesson.completed ? "success" : "outline"}>
      {lesson.status}
    </Badge>
  </div>
</div>
```

### Note Colors Implementation
```typescript
// Note component with color
<div className={cn(
  "p-4 rounded-lg border-l-4",
  color === 'green' && "border-noteGreen bg-noteGreen/5",
  color === 'yellow' && "border-noteYellow bg-noteYellow/5",
  color === 'blue' && "border-noteBlue bg-noteBlue/5",
  color === 'red' && "border-noteRed bg-noteRed/5"
)}>
  {content}
</div>
```

### Mobile Patterns
```typescript
// Drawer for mobile, Dialog for desktop
const isMobile = useIsMobileDevice()
const Component = isMobile ? Drawer : Dialog

// Mobile navigation
<nav className="padding-mobile-nav">
  {/* Accounts for safe area insets */}
</nav>
```

## ❌ Anti-Patterns to Avoid

### DON'T DO THIS:
```typescript
// ❌ Hardcoded colors
<div style={{ backgroundColor: '#4794ae' }}>

// ❌ Custom CSS classes
<div className="my-custom-class">

// ❌ Inline styles
<div style={{ padding: '20px' }}>

// ❌ Non-semantic color usage
<div className="bg-blue-500">

// ❌ Mixing UI libraries
import { Button } from '@mui/material'

// ❌ Creating new color values
<div className="bg-[#123456]">

// ❌ Using arbitrary values when tokens exist
<div className="text-[14px]"> // Use text-sm instead

// ❌ Forgetting mobile responsiveness
<div className="w-[600px]"> // Use w-full max-w-[600px]
```

### DO THIS INSTEAD:
```typescript
// ✅ Design tokens
<div className="bg-primary">

// ✅ Utility classes
<div className="p-5">

// ✅ Semantic colors
<div className="bg-destructive">

// ✅ Existing components
<Button variant="outline">

// ✅ Responsive design
<div className="w-full sm:w-auto">
```

## 🧪 Validation Checklist

Before completing any UI work, verify:

- [ ] All colors use design tokens (no hardcoded values)
- [ ] Component uses shadcn/ui when available
- [ ] Dark mode works (test with .dark-mode class)
- [ ] Mobile responsive (test at 375px width)
- [ ] Focus states visible for keyboard navigation
- [ ] Loading states implemented where needed
- [ ] Error states handled appropriately
- [ ] Follows existing patterns in codebase
- [ ] No custom CSS written
- [ ] TypeScript types are correct

## 📦 Import Patterns

```typescript
// Component imports (alphabetical)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Utility imports
import { cn } from '@/lib/utils'

// Type imports
import type { Student } from '@/types/entities'
```

## 🔍 Quick Lookup

### Find Existing Examples
- Buttons: `src/components/features/students/CreateStudentDialogDrawer.component.tsx`
- Forms: `src/components/features/lessons/CreateLessonForm.component.tsx`
- Tables: `src/components/features/students/studentsTable/`
- Cards: `src/components/features/dashboard/overview/OverviewCard.component.tsx`
- Modals: `src/components/ui/dialog.tsx`
- Mobile: `src/components/features/lessons/LessonItemMobile.component.tsx`

### Key Files
- Colors: `app/src/styles/tailwind.css` (lines 49-142)
- Tailwind Config: `app/tailwind.config.js`
- UI Components: `app/src/components/ui/`
- Utils: `app/src/lib/utils.ts`

## 🤖 Agent Instructions

When creating or modifying UI:

1. **Check for existing component** in `src/components/ui/`
2. **Use the component** with appropriate variant
3. **Apply design tokens** for all colors
4. **Add responsive classes** for mobile
5. **Test dark mode** compatibility
6. **Verify accessibility** (focus states, ARIA labels)
7. **Follow domain patterns** for consistency

Remember: The goal is 100% consistency with the existing design system. When in doubt, find and follow an existing example in the codebase.