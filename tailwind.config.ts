import type { Config } from 'tailwindcss';

// Every colour, radius and font points at a CSS variable from src/styles/themes.css,
// so switching <html data-theme> re-skins the whole site without touching components.
const v = (name: string) => `var(--${name})`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        primary: v('primary'),
        accent: v('accent'),
        hi: v('hi'),
        bg: v('bg'),
        dark: v('dark'),
        ink: v('text'),
        muted: v('muted'),
        line: v('line'),
        line2: v('line2'),
        surface: v('surface'),
        tint: v('tint'),
        tag: v('tag-text'),
        link: v('link'),
        sec: v('sec'),
        'sec-hover': v('sec-hover-bg'),
        btn: v('btn'),
        'btn-hover': v('btn-hover'),
        'btn-press': v('btn-press'),
        'btn-text': v('btn-text'),
        'on-dark': v('on-dark'),
        'on-dark-muted': v('on-dark-muted'),
        star: v('star'),
        ok: v('ok'),
        'ok-bg': v('ok-bg'),
        badge: v('badge-bg'),
        'badge-text': v('badge-text'),
        step: v('step-bg'),
        'step-text': v('step-text'),
        'stats-bg': v('stats-bg'),
        'stats-num': v('stats-num'),
        'stats-label': v('stats-label'),
        whatsapp: v('whatsapp')
      },
      fontFamily: {
        heading: v('font-heading'),
        body: v('font-body'),
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      fontSize: {
        h1: v('h1'),
        h2: v('h2'),
        h3: v('h3'),
        base: v('fs'),
        lead: v('fs-l'),
        stat: v('stat-num')
      },
      borderRadius: {
        card: v('r'),
        sm: v('rs'),
        btn: v('br'),
        field: v('field-r'),
        tile: v('tile-r'),
        gal: v('gal-r'),
        arch: v('arch')
      },
      maxWidth: { site: v('max') },
      boxShadow: {
        card: v('shadow'),
        'card-hover': v('shadow-hover'),
        float: '0 30px 60px -30px rgba(0,0,0,.6)',
        sheet: '0 24px 40px -20px rgba(0,0,0,.35)'
      },
      spacing: { gut: v('gut'), 'sec-y': v('sec-y'), header: v('header-h') }
    }
  },
  plugins: []
};

export default config;
