import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0e14",
          900: "#12161f",
          800: "#1a2030",
          700: "#242b3d",
          600: "#323b52",
          500: "#4a5570",
          400: "#6b7690",
          300: "#98a2b8",
          200: "#c6ccdb",
          100: "#e8ebf1",
        },
        brand: {
          50: "#f2f2ff",
          100: "#e6e5ff",
          200: "#cac8ff",
          300: "#a29dff",
          400: "#7a6dff",
          500: "#5d4bff",
          600: "#4a2fef",
          700: "#3c22c9",
          800: "#301ca0",
          900: "#291b7f",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 18, 30, 0.06), 0 1px 3px 0 rgba(15, 18, 30, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
