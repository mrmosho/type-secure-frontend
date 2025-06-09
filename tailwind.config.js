/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        'ts-purple': {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed'
        },
        'ts-pink': {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777'
        }
      },
      border: {
        DEFAULT: "hsl(var(--border))"
      }
    },
  },
  plugins: [],
}