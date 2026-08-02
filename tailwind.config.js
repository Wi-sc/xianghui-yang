/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Neutral spine ──────────────────────────────────────────────
        // A single, evenly-stepped gray ramp. Every surface, rule and
        // text tone comes from here, so nothing can drift out of key.
        ink: {
          950: '#08080a', // page
          900: '#0b0b0e',
          850: '#0f0f13', // surface
          800: '#14141a', // surface raised
          700: '#1c1c24', // rule (strong)
          600: '#282832', // rule (hover)
          500: '#5a5a68', // decorative / disabled
          400: '#82828f', // muted text        ~5:1 on ink-950
          300: '#9d9dab', // secondary text    ~6.8:1
          200: '#c4c4cf', // body text
          100: '#e9e9ef', // primary text
        },
        // ── One accent. It means "this is Xianghui / this is live". ────
        accent: {
          DEFAULT: '#34d399',
          dim: '#10b981',
          deep: '#047857',
        },
        // ── One semantic hue, reserved strictly for time & numbers. ────
        signal: '#d5a35c',
      },

      // Modular type scale. Line-height and tracking are baked in so a
      // size can never be used at the wrong rhythm.
      fontSize: {
        '3xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.14em' }],
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.10em' }],
        xs: ['0.75rem', { lineHeight: '1.15rem', letterSpacing: '0.01em' }],
        sm: ['0.8125rem', { lineHeight: '1.45rem' }],
        base: ['0.9375rem', { lineHeight: '1.75rem' }],
        md: ['1.0625rem', { lineHeight: '1.6rem', letterSpacing: '-0.005em' }],
        lg: ['1.1875rem', { lineHeight: '1.7rem', letterSpacing: '-0.01em' }],
        xl: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '2xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '3xl': ['2.75rem', { lineHeight: '2.875rem', letterSpacing: '-0.032em' }],
        '4xl': ['3.75rem', { lineHeight: '3.75rem', letterSpacing: '-0.038em' }],
      },

      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      maxWidth: {
        page: '1120px',
        measure: '62ch', // optimal reading measure for body copy
      },

      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
      },

      boxShadow: {
        // Physical, layered depth instead of a flat black blur.
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.8)',
        lift: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 40px -16px rgba(0,0,0,0.9)',
        modal: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 40px 80px -24px rgba(0,0,0,0.95)',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      animation: {
        blink: 'blink 1.1s steps(1) infinite',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
