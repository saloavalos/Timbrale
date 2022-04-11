// Palette of colors
// Remember to add .json extension, so that the value of colors updates
// automatically when I update any color in the palette of colors
const colors = require("./src/style/colors.json");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: colors,
      fonFamily: {
        sans: ['"Open Sans"', "sans-serif"],
      },
      keyframes: {
        shake: {
          "25%": { transform: "translateX(4px)" },
          "50%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "input-shake-animation": "shake 300ms ease-in-out",
      },
    },
  },
  plugins: [],
};
