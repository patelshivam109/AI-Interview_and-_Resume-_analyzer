/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        mist: "#f5f7fb",
        accent: {
          50: "#eef4ff",
          100: "#dfe9ff",
          500: "#4f6ef7",
          700: "#3149b8",
        },
      },
      boxShadow: {
        panel: "0 24px 80px -36px rgba(15, 23, 42, 0.32)",
        float: "0 14px 35px -22px rgba(79, 110, 247, 0.45)",
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
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
