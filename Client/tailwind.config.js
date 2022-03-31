module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8357ff",
        secondary: "#DACDFF",
        header: "#191919",
        paragraph: "#323232",
        gray: "#ECECEC",
        yellowPrimary: "#FFE357",
        yellowSecondary: "#FFF7CD",
        redPrimary: "#FF5757",
        redSecondary: "#FFCDCD",
        purpleDark: "#C6B3FF",
      },
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
