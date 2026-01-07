/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#330df2",
        "primary-dark": "#1a0b7e",
        secondary: "#f59e0b",
        background: "#f8fafc",
        surface: "#ffffff",
        text: "#0f172a",
        "text-muted": "#64748b",
        danger: "#f2460d",
        action: "#258cf4"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        'cartoon': ['Titan One', 'cursive'],
        'rounded': ['Fredoka', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'chaos': 'chaos 0.5s infinite linear',
        'glitch': 'glitch 0.3s infinite steps(2, start)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'chaos': {
           '0%': { transform: 'translate(0, 0) rotate(0deg)' },
           '25%': { transform: 'translate(0.5px, -0.5px) rotate(1deg)' },
           '50%': { transform: 'translate(-0.5px, 0.5px) rotate(-1deg)' },
           '75%': { transform: 'translate(-0.5px, -0.5px) rotate(0.5deg)' },
           '100%': { transform: 'translate(0.5px, 0.5px) rotate(-0.5deg)' },
        },
        'glitch': {
          '0%': { opacity: '1', transform: 'translate(0)' },
          '50%': { opacity: '0.7', transform: 'translate(-1px, 0)' },
          '51%': { opacity: '0.4', transform: 'translate(1px, 0)' },
          '100%': { opacity: '1', transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [],
}
