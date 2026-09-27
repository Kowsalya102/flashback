/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: {
          DEFAULT: "#12121A",
          hover: "#1A1A26",
          border: "#262636",
        },
        brand: {
          indigo: "#4F46E5",
          cyan: "#06B6D4",
          violet: "#7C3AED",
          emerald: "#10B981",
          amber: "#F59E0B",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(10, 10, 15, 0) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)',
        'cyan-indigo-gradient': 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(79, 70, 229, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-float': 'gridFloat 20s linear infinite',
      },
      keyframes: {
        gridFloat: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        }
      }
    },
  },
  plugins: [],
}
