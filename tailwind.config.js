/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'monospace'],
        pixelify: ['var(--font-pixelify)', 'sans-serif'],
        vt323: ['var(--font-vt323)', 'monospace'],
      },
      borderWidth: {
        6: '6px',
      },
      animation: {
        shellIn: 'shellIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
        contentFade: 'contentFade 0.35s ease forwards',
        spin: 'spin 0.7s linear infinite',
      },
      keyframes: {
        shellIn: {
          from: { 
            opacity: '0',
            transform: 'translateY(18px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        contentFade: {
          from: {
            opacity: '0',
            transform: 'translateX(12px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
