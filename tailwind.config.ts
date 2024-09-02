/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
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
