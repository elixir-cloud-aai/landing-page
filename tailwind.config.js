module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        pop: ["Poppins", "sans-serif"],
      },
      colors: {
        elixirblue: "#3DA9F6",
        elixirgreen: "#5ABA62",
        elixiryellow: "#F9CC48",
        elixirred: "#EE5943",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
