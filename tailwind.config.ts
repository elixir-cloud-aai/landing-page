/** @type {import('tailwindcss').Config} */
const professionalSans = [
  'Inter',
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
];

// Colors are defined as OKLCH channels in globals.css so opacity modifiers work.
const token = (name: string) => `oklch(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: professionalSans,
        pop: professionalSans,
        cursive: ['Satisfy', 'cursive'],
      },
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        destructive: token('destructive'),
        success: token('success'),
        warning: token('warning'),
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        elixirblue: '#3DA9F6',
        elixirgreen: '#5ABA62',
        elixiryellow: '#F9CC48',
        elixirred: '#EE5943',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
