/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: { color: theme('colors.brand.600'), '&:hover': { color: theme('colors.brand.800') } },
            'h1,h2,h3,h4': { color: theme('colors.slate.900'), fontWeight: '700' },
            code: { color: theme('colors.brand.700'), backgroundColor: theme('colors.slate.100'), borderRadius: '0.25rem', padding: '0.1em 0.3em' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: theme('colors.slate.900'), color: theme('colors.slate.100') },
            blockquote: { borderLeftColor: theme('colors.brand.400'), color: theme('colors.slate.600') },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.300'),
            a: { color: theme('colors.brand.400'), '&:hover': { color: theme('colors.brand.300') } },
            'h1,h2,h3,h4': { color: theme('colors.slate.100') },
            code: { color: theme('colors.brand.300'), backgroundColor: theme('colors.slate.800') },
            pre: { backgroundColor: theme('colors.slate.950') },
            blockquote: { borderLeftColor: theme('colors.brand.500'), color: theme('colors.slate.400') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
