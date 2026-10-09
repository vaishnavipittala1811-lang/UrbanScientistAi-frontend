/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#070A11',
          900: '#0B0F19',
          850: '#111726',
          800: '#161F33',
          700: '#222F4C',
          600: '#334155',
        },
        telangana: {
          emerald: '#10B981',
          teal: '#0D9488',
          amber: '#F59E0B',
          coral: '#EF4444',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
