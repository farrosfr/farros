import {
  defineConfig,
  presetIcons,
  presetUno,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

const fg = 'hsl(var(--foreground) / var(--un-text-opacity, 1))'
const fgMuted = 'hsl(var(--muted-foreground) / var(--un-text-opacity, 1))'
const border = 'var(--un-default-border-color)'
const radius = 'var(--radius)'
const bgMuted = 'hsl(var(--muted) / var(--un-bg-opacity, 1))'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetTypography({
      cssExtend: {
        // Title
        'h2,h3,h4,h5,h6': {
          'scroll-margin-top': '4rem'
        },
        // Links
        a: {
          'word-wrap': 'break-word',
          'word-break': 'break-word',
          'overflow-wrap': 'anywhere'
        },
        // Inline code
        ':not(pre) > code': {
          'white-space': 'pre-wrap',
          'word-break': 'break-all',
          padding: '0.3em 0.5em',
          border: `1px solid ${border}`,
          'border-radius': radius,
          'background-color': bgMuted
        },
        ':not(pre)>code::before': {
          content: 'none'
        },
        ':not(pre)>code::after': {
          content: 'none'
        }
      }
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Outfit:300,400,500,600,700',
        serif: 'Playfair Display:400,700',
        mono: 'Fira Code'
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    'i-lucide-sun',
    'i-lucide-moon',
    'i-lucide-monitor'
  ],
  theme: {
    colors: {
      border: 'hsl(var(--border) / <alpha-value>)',
      input: 'hsl(var(--input) / <alpha-value>)',
      ring: 'hsl(var(--ring) / <alpha-value>)',
      background: 'hsl(var(--background) / <alpha-value>)',
      foreground: 'hsl(var(--foreground) / <alpha-value>)',
      primary: {
        DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
        foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
        foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
        foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
        foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
        foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
        foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
      },
      card: {
        DEFAULT: 'hsl(var(--card) / <alpha-value>)',
        foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
      }
    }
  },
  shortcuts: [
    ['flex-center', 'flex items-center justify-center'],
    ['absolute-center', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'],
    ['glass', 'bg-background/80 backdrop-blur-xl border border-border/60 shadow-2xl shadow-black/10 dark:shadow-black/30'],
    ['glass-card', 'bg-card/72 backdrop-blur-xl border border-border/70 shadow-xl shadow-black/5 dark:shadow-black/25 hover:border-primary/45 transition-all duration-300']
  ]
})
