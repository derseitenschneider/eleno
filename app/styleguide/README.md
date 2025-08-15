# Eleno Design System Styleguide

A comprehensive visual documentation of Eleno's design system, components, and patterns.

## 🚀 Quick Start

### View the Styleguide
```bash
# From the app directory
npm run styleguide

# Or open directly in browser
open styleguide/index.html
```

The styleguide will open at `http://localhost:5174`

### Development
The styleguide uses static HTML with Tailwind CSS loaded via CDN. No build process is required - simply edit the HTML files and refresh your browser.

## 📁 Structure

```
styleguide/
├── index.html              # Main landing page
├── assets/
│   └── styleguide.css     # Styleguide-specific styles
├── foundations/           # Design foundations
│   ├── colors.html        # Color system
│   ├── typography.html    # Typography scales
│   ├── spacing.html       # Spacing system
│   └── icons.html         # Icon library
├── components/            # UI Components
│   ├── buttons.html       # Button variants
│   ├── forms.html         # Form elements
│   ├── cards.html         # Card components
│   ├── tables.html        # Table patterns
│   └── modals.html        # Modals & dialogs
└── patterns/              # UI Patterns
    ├── layouts.html       # Layout patterns
    ├── navigation.html    # Navigation patterns
    └── data-display.html  # Data presentation

```

## 🎨 Features

- **Live Examples**: All components shown with actual Eleno styling
- **Dark Mode**: Toggle between light and dark themes
- **Code Snippets**: Copy-paste ready implementation examples
- **Responsive**: Works on all screen sizes
- **Interactive**: See hover, focus, and active states

## 🛠️ For Developers

### Using Components
All components follow the shadcn/ui pattern and are located in `app/src/components/ui/`. 

Example usage:
```tsx
import { Button } from '@/components/ui/button'

<Button variant="outline" size="lg">
  Click me
</Button>
```

### Design Tokens
Colors and spacing use CSS custom properties defined in `app/src/styles/tailwind.css`. These automatically adapt for dark mode.

### Adding New Pages
1. Create a new HTML file in the appropriate directory
2. Copy the basic structure from an existing page
3. Add navigation link in `index.html`
4. No build required - just refresh

## 🤖 For AI Agents

See `.agent-os/style-guide.md` for implementation rules and patterns specifically for AI agents working on the codebase.

## 📚 Related Documentation

- **Main App**: `/app/src/`
- **Components**: `/app/src/components/ui/`
- **Tailwind Config**: `/app/tailwind.config.js`
- **AI Agent Guide**: `/.agent-os/style-guide.md`

## 🔄 Keeping in Sync

When adding new components or patterns to the main application:
1. Document them in the appropriate styleguide section
2. Update the agentic guide if there are new patterns
3. Include usage examples and guidelines

## 📝 Notes

- The styleguide uses Tailwind via CDN for simplicity
- All examples use the same design tokens as production
- Dark mode is handled via the `.dark-mode` class
- The styleguide is purely for documentation - components live in the main app