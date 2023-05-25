/* eslint-disable @typescript-eslint/no-var-requires */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["WorkSans", ...fontFamily.sans],
      },
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        tertiary: "var(--color-bg-tertiary)",
        orange: "var(--color-orange-primary)",
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        orange: "var(--color-orange-primary)",
      },
      borderColor: {
        primary: "var(--color-border-primary)",
      },
      ringColor: {
        primary: "var(--color-border-primary)",
      },
      divideColor: {
        primary: "var(--color-border-primary)",
      },
      zIndex: {
        "-10": "-10",
        "-20": "-20",
      },
      translate: {
        h1: "12px",
        h2: "8px",
        h3: "6px",
        h4: "4px",
        h5: "2px",
        h6: "2px",
      },
      rotate: {
        "-1.5": "-1.5deg",
      },
      minWidth: {
        40: "40px",
      },
      maxHeight: {
        "3/4": "75vh",
      },
      fontSize: {
        "2xs": "calc(0.125rem)",
        "2sm": "calc(0.95rem)",
        md: "calc(1.125rem)",
        "2md": "calc(1.1825rem)",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["group-focus"],
    },
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [],
};
