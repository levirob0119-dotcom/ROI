import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'PingFang SC', 'Noto Sans SC', 'system-ui', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            fontSize: {
                'ds-caption': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 12/20
                'ds-body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14/20
                'ds-body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16/24
                'ds-title-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20/28
                'ds-title': ['1.5625rem', { lineHeight: '2rem', fontWeight: '600' }], // 25/32
                'ds-h2': ['1.9375rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 31/40
                'ds-h1': ['2.4375rem', { lineHeight: '3rem', fontWeight: '700' }], // 39/48
            },
            borderRadius: {
                'sm': '4px',
                DEFAULT: '6px',
                'md': '10px',
                'lg': '14px',
                'xl': '20px',
                'control': '12px',
                'card': '20px',
                'full': '9999px',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                surface: '#F8FAFC',
                text: {
                    primary: '#0F172A',
                    secondary: '#475569',
                },

                // Primary - Brand Blue
                primary: {
                    DEFAULT: '#137FEC', // Brand Blue
                    foreground: '#FFFFFF',
                    hover: '#1170D2'
                },

                // Neutrals (Slate mapping)
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },

                // Semantics
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },

                // Feedback
                success: {
                    DEFAULT: '#16A34A',
                    foreground: '#FFFFFF'
                },
                warning: {
                    DEFAULT: '#D97706',
                    foreground: '#FFFFFF'
                },
                error: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF'
                },
                info: {
                    DEFAULT: '#0EA5E9',
                    foreground: '#FFFFFF'
                }
            },
            boxShadow: {
                'ds-sm': '0 1px 2px rgba(15, 23, 42, 0.06)',
                'ds-md': '0 4px 12px rgba(15, 23, 42, 0.08)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "slide-in": {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "slide-in": "slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "fade-in": "fade-in 0.2s ease-out",
            },
        }
    },
    plugins: [tailwindcssAnimate],
}
