export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(224 24% 18%)',
        input: 'hsl(224 24% 18%)',
        background: 'hsl(228 26% 7%)',
        foreground: 'hsl(216 28% 92%)',
        muted: {
          DEFAULT: 'hsl(224 22% 13%)',
          foreground: 'hsl(220 12% 68%)',
        },
        card: {
          DEFAULT: 'hsl(224 24% 10%)',
          foreground: 'hsl(216 28% 92%)',
        },
        primary: {
          DEFAULT: 'hsl(170 78% 45%)',
          foreground: 'hsl(180 40% 6%)',
        },
        accent: {
          DEFAULT: 'hsl(262 58% 56%)',
          foreground: 'hsl(216 28% 96%)',
        },
        warning: 'hsl(38 94% 55%)',
        danger: 'hsl(355 78% 58%)',
        success: 'hsl(145 70% 45%)',
      },
      boxShadow: {
        panel: '0 18px 60px rgb(0 0 0 / 0.32)',
        glow: '0 0 32px rgb(20 184 166 / 0.28)',
        danger: '0 0 34px rgb(244 63 94 / 0.34)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
