import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3A8D35',
          600: '#339130',
          700: '#2d7a29',
          800: '#256322',
          900: '#1a4a18',
          950: '#0f2e0e',
        },
        accent: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#5322C0',
          700: '#511CC5',
          800: '#3b0d99',
          900: '#272660',
          950: '#1a1040',
        },
        cta: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#DC4140',
          600: '#c53030',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        dark: {
          DEFAULT: '#223354',
          light: '#353A8D',
        },
        body: '#646E83',
        pink: {
          DEFAULT: '#FE3466',
          soft: '#FE4872',
        },
        teal: '#34E3D3',
        orange: '#FF6B52',
      },
      borderRadius: {
        'pill': '30px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: '#646E83',
            a: {
              color: '#DC4140',
              '&:hover': { color: '#223354' },
            },
            'h1,h2,h3,h4': { color: '#223354' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
