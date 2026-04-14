/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"IBM Plex Mono"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        mist: "#f5f7fb",
        accent: {
          50: "#fff0e8",
          100: "#ffd9c6",
          200: "#fcb896",
          400: "#eb885d",
          500: "#d15d32",
          600: "#ab4520",
          700: "#843418",
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
