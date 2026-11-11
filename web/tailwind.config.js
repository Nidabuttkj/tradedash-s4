// Colours and font copied from the Super Admin screens (navy sidebar, orange accent, Inter font).
// S5 owns the shared theme (Section 7.3): swap in theirs once shared.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#14284b', 700: '#1c3a66', 900: '#0d1b33' },
        brand: { DEFAULT: '#e8822c', dark: '#d2701d', soft: '#fdeedd' },
        surface: '#f4f7fb',
        head: '#e8eef8',
        line: '#e3e8f0',
        tick: '#1f9d6b',
      },
      fontFamily: { sans: ['Inter', '"Segoe UI"', 'system-ui', 'Arial', 'sans-serif'] },
      boxShadow: { card: '0 2px 10px rgba(20, 40, 75, 0.08)' },
    },
  },
  plugins: [],
}
