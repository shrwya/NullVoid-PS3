/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0a0d12',
        surface: '#111520',
        surface2: '#161c2a',
        surface3: '#1d2538',
        border: '#1e2a3e',
        border2: '#263348',
        gold: { DEFAULT: '#c9a84c', light: '#e8c56a', dark: '#a07a28' },
        brand: { DEFAULT: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'reveal': 'reveal 0.6s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        reveal: { from: { opacity: 0, transform: 'translateY(24px) scale(0.97)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.6)' } },
        scan: { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(100vh)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
