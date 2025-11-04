/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    dark: '#4f46e5',
                    light: '#818cf8',
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                success: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                    light: '#34d399',
                },
                error: {
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                    light: '#f87171',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                    light: '#fbbf24',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '112': '28rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.25)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fadeIn': 'fadeIn 0.3s ease-out',
                'slideUp': 'slideUp 0.3s ease-out',
                'slideDown': 'slideDown 0.3s ease-out',
                'scaleIn': 'scaleIn 0.3s ease-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '25%': { transform: 'translateY(-10px) rotate(1deg)' },
                    '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
                    '75%': { transform: 'translateY(-15px) rotate(1deg)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideUp: {
                    from: { transform: 'translateY(100%)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    from: { transform: 'translateY(-100%)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    from: { transform: 'scale(0.9)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionDuration: {
                '2000': '2000ms',
                '3000': '3000ms',
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.text-balance': {
                    'text-wrap': 'balance',
                },
                '.perspective-1000': {
                    'perspective': '1000px',
                },
                '.transform-style-3d': {
                    'transform-style': 'preserve-3d',
                },
                '.backface-hidden': {
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden',
                },
                '.rotate-y-180': {
                    'transform': 'rotateY(180deg)',
                },
            }
            addUtilities(newUtilities)
        },
    ],
}