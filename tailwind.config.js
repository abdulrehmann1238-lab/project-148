/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          bg: 'var(--ink-bg)',
        },
        line: {
          DEFAULT: 'var(--line)',
          2: 'var(--line-2)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          h: 'var(--primary-h)',
          a: 'var(--primary-a)',
          t: 'var(--primary-t)',
        },
        sage: {
          DEFAULT: 'var(--sage)',
          t: 'var(--sage-t)',
        },
        brass: {
          DEFAULT: 'var(--brass)',
          ink: 'var(--brass-ink)',
          t: 'var(--brass-t)',
        },
        success: {
          DEFAULT: 'var(--success)',
          t: 'var(--success-t)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          t: 'var(--warning-t)',
        },
        error: {
          DEFAULT: 'var(--error)',
          t: 'var(--error-t)',
        },
        info: {
          DEFAULT: 'var(--info)',
          t: 'var(--info-t)',
        },
        wp: {
          menu: 'var(--wp-menu)',
          bg: 'var(--wp-bg)',
          blue: 'var(--wp-blue)',
          border: 'var(--wp-border)',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(22,36,43,.06)',
        'sh-2': '0 4px 14px rgba(22,36,43,.08)',
        'sh-3': '0 16px 40px rgba(22,36,43,.14)',
      },
      borderRadius: {
        'xs': '3px',
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'pill': '999px',
      },
      maxWidth: {
        'content': '1240px',
        'article': '68ch',
      }
    },
  },
  plugins: [],
}
