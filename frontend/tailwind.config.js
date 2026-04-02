/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Sora"', '"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        mist: "#f5f7fb",
        accent: {
          50: "#eff5ff",
          100: "#dfeaff",
          200: "#c2d4ff",
          400: "#6d8dff",
          500: "#4f6ef7",
          600: "#3852cf",
          700: "#2d419f",
        },
      },
      boxShadow: {
        panel: "0 28px 90px -36px rgba(15, 23, 42, 0.28)",
        float: "0 18px 45px -28px rgba(79, 110, 247, 0.45)",
        ambient: "0 22px 70px -42px rgba(15, 23, 42, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-soft": {
          "0%, 100%": {
            opacity: "0.7",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.03)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
