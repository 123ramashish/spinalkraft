import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-gold':       '#C9A84C',
        'brand-gold-light': '#E8C96A',
        'brand-green':      '#4CAF50',
        'brand-green-dark': '#388E3C',
        'ink-950': '#020508',
        'ink-900': '#050a0e',
        'ink-800': '#091422',
        'ink-700': '#0D1E36',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans:    ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #C9A84C, #E8C96A, #4CAF50)',
      },
      boxShadow: {
        gold:  '0 0 40px rgba(201,168,76,0.35)',
        green: '0 0 40px rgba(76,175,80,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
