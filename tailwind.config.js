/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#212529",
        secondary: "#343a40",
        tertiary: "#495057",
        quaternary: "#fb8500",
        primaryText: "#8ecae6",
        secondaryText: "#fdfcdc",
        hover: "#fca311",
        selected: "#495057",
      },
    },
  },
  plugins: [],
};
