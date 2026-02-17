/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // White
        primary: '#dc2626',    // Red-600
        secondary: '#166534',  // Green-800
        text: '#1e293b',       // Slate-800
        muted: '#64748b',      // Slate-500
        border: '#e2e8f0',     // Slate-200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        bangla: ['"Tiro Bangla"', 'serif'],
      },
    },
  },
  plugins: [],
}
