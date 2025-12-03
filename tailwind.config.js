/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['system-ui', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 18px 45px rgba(15,23,42,0.85)',
      },
    },
  },
  plugins: [],
}


