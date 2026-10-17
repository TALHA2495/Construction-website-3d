/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#171815",
        deep: "#10110f",
        ivory: "#f2f0ea",
        limestone: "#c7c0b4",
        bronze: "#9B8468",
        sage: "#7D8575",
        ink: "#20211E",
        muted: "#77766F",
      },
    },
  },
  plugins: [],
};
