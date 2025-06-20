/** @type {import('tailwindcss').Config} */
export const darkMode = ['class']
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
export const prefix = ''
export const theme = {
  fontFamily: {
    body: ['"DM Sans"'],
  },
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
      short: '900px',
    },
  },
  extend: {
    transitionProperty: {
      width: 'width',
    },
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      backgroundPlain: 'hsl(var(--background-plain))',
      background50: 'hsl(var(--background-50))',
      background100: 'hsl(var(--background-100))',
      background200: 'hsl(var(--background-200))',

      noteGreen: 'hsl(var(--border-notes-green))',
      noteYellow: 'hsl(var(--border-notes-yellow))',
      noteBlue: 'hsl(var(--border-notes-blue))',
      noteRed: 'hsl(var(--border-notes-red))',

      hairline: 'hsl(var(--hairline))',
      foreground: 'hsl(var(--foreground))',
      warning: 'hsl(var(--clr-warning))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
        hover: 'hsl(var(--primary-hover))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
    opacity: {
      box: 'var(--opacity-empty-box)',
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
}

import tailwindcssAnimate from 'tailwindcss-animate'
export const plugins = [
  tailwindcssAnimate,
  ({ addUtilities }) => {
    addUtilities({
      '.no-scrollbar': {
        '::-webkit-scrollbar': 'display: none;',
        'scrollbar-width': 'none;',
      },
    })
  },
]
