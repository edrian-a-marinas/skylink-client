export const colors = {
  action: {
    primary:       'bg-bg-primary text-text-on-primary',
    primaryHover:  'hover:bg-bg-primary-hover',
    primaryPress:  'active:bg-bg-primary-press',
    secondary:     'bg-bg-selected text-text-link',
    ghost:         'border border-primary-50 text-text-link',
  },

  status: {
    success: 'bg-bg-success text-text-success',
    warning: 'bg-bg-warning text-text-warning',
    danger:  'bg-bg-danger text-text-danger',
    info:    'bg-bg-info text-text-info',
  },

  text: {
    primary:   'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary:  'text-text-tertiary',
    disabled:  'text-text-disabled',
    link:      'text-text-link hover:text-text-link-hover',
    inverse:   'text-text-inverse',
    onPrimary: 'text-text-on-primary',
  },

  surface: {
    page:    'bg-bg-page',
    surface: 'bg-bg-surface',
    light:   'bg-bg-surface-light',
    warm:    'bg-bg-surface-warm',
    input:   'bg-bg-input',
  },
} as const

export const typography = {
  display: {
    d1: 'text-display-1 font-bold leading-tight',
    d2: 'text-display-2 font-bold leading-tight',
  },
  heading: {
    h1: 'text-h1 font-bold leading-tight',
    h2: 'text-h2 font-bold leading-tight',
    h3: 'text-h3 font-bold leading-tight',
    h4: 'text-h4 font-bold leading-tight',
    h5: 'text-h5 font-bold leading-tight',
    h6: 'text-h6 font-bold leading-tight',
  },
  paragraph: {
    lg: 'text-para-lg font-normal leading-normal',
    md: 'text-para-md font-normal leading-normal',
    sm: 'text-para-sm font-normal leading-normal',
    xs: 'text-para-xs font-normal leading-normal',
  },
  label: {
    lg: 'text-label-lg font-bold leading-none',
    md: 'text-label-md font-bold leading-none',
    sm: 'text-label-sm font-bold leading-none',
    xs: 'text-label-xs font-bold leading-none',
  },
} as const