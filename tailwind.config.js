/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Simple Blue 500
        secondary: "#10b981", // Simple Emerald 500
        background: "#f3f4f6", // Gray 100
        surface: "#ffffff",
        error: "#ef4444", // Red 500
      },
    },
  },
  plugins: [],
}
