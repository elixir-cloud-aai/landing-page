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
        elixirblue: '#3DA9F6',
        elixirgreen: '#5ABA62',
        elixiryellow: '#F9CC48',
        elixirred: '#EE5943',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
};
