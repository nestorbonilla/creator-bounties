/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /** primary */
        "nyellow": "#E8C808",
        "nred": "#D53C5E",
      }
    },
  },
  plugins: [],
}
