/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B8CFEC",
        secondary: "#D0D5F7",
        third:'#D4F0F7',
        forth:'#F6DAE4',
      },
      boxShadow: {
        'custom':'0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
      }
    },
  },
  plugins: [],
});
