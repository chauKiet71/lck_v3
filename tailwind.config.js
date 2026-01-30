/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'navy-deep': '#0a1219',
        'navy-surface': '#121e2a',
        'silver-accent': '#cbd5e1',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        'DEFAULT': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px'
      },
    },
  },
  plugins: [],
}
