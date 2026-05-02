// tailwind.config.js - FINAL MERGED VERSION
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange/Black Scheme
        'cream': '#FDE87A',
        'orange-soft': '#EE7D1D',
        'orange-vibrant': '#FF570F',
        'maroon-dark': '#630D00',
        'pure-white': '#FFFFFF',
        'deep-black': '#000000',
        
        // Semantic Names
        'brand-primary': '#FF570F',
        'brand-secondary': '#EE7D1D',
        'brand-accent': '#FDE87A',
        'bg-base': '#000000',
        'bg-surface': '#0a0a0a',
        'text-main': '#FFFFFF',
        'text-muted': '#a1a1aa',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, #630D00 0px, transparent 50%), radial-gradient(at 80% 0%, #FF570F 0px, transparent 50%)',
      },
      keyframes: {
        // ✅ MERGED: All animations
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 87, 15, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 87, 15, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // ✅ MERGED: All animation classes
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeIn': 'fadeIn 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}