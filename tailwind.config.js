/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Super Ages brand palette (exact values from the brand guide)
        lime: '#C0D20D',        // Primary lime: signature accents
        ink: '#081308',         // Deep black-green: headings, dark sections
        canvas: '#F6FAF6',      // Soft white: page backgrounds
        agri: { DEFAULT: '#1A9959', dark: '#14794A' }, // Agricultural green: actions
        mlime: '#DBE47A',       // Muted lime: secondary highlights
        sage: '#798179',        // Grey-green: supporting text
        botanical: '#88C6A7',   // Botanical green: graphics and charts
        pale: '#F2FDD8',        // Pale botanical: soft panels
        // Derived neutrals (green-biased, for borders and surfaces)
        line: '#DDE5DC',
        mist: '#EDF2EC',
        body: '#3A433A',
        // Semantic states
        attn: '#A6611A',
        danger: '#B42318',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '6px', md: '8px', lg: '10px' },
      maxWidth: { site: '1320px' },
      letterSpacing: { label: '0.14em' },
      keyframes: {
        rise: { '0%': { opacity: '0.001', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideup: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'none', opacity: '1' } },
        kenburns: { '0%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both',
        fade: 'fade .25s ease-out both',
        slideup: 'slideup .3s cubic-bezier(.2,.7,.2,1) both',
        kenburns: 'kenburns 9s cubic-bezier(.2,.6,.2,1) both',
      },
    },
  },
  plugins: [],
};
