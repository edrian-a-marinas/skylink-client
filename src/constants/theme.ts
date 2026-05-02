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
    d1: {
      bold:     'text-display-1 font-bold leading-tight',
      semiBold: 'text-display-1 font-semibold leading-tight',
      medium:   'text-display-1 font-medium leading-tight',
      normal:   'text-display-1 font-normal leading-tight',
      light:    'text-display-1 font-light leading-tight',
    },
    d2: {
      bold:     'text-display-2 font-bold leading-tight',
      semiBold: 'text-display-2 font-semibold leading-tight',
      medium:   'text-display-2 font-medium leading-tight',
      normal:   'text-display-2 font-normal leading-tight',
      light:    'text-display-2 font-light leading-tight',
    },
    d3: {
      bold:     'text-display-3 font-bold leading-tight',
      semiBold: 'text-display-3 font-semibold leading-tight',
      medium:   'text-display-3 font-medium leading-tight',
      normal:   'text-display-3 font-normal leading-tight',
      light:    'text-display-3 font-light leading-tight',
    },
  },
  heading: {
    h1: {
      bold:     'text-h1 font-bold leading-tight',
      semiBold: 'text-h1 font-semibold leading-tight',
      medium:   'text-h1 font-medium leading-tight',
      normal:   'text-h1 font-normal leading-tight',
      light:    'text-h1 font-light leading-tight',
    },
    h2: {
      bold:     'text-h2 font-bold leading-tight',
      semiBold: 'text-h2 font-semibold leading-tight',
      medium:   'text-h2 font-medium leading-tight',
      normal:   'text-h2 font-normal leading-tight',
      light:    'text-h2 font-light leading-tight',
    },
    h3: {
      bold:     'text-h3 font-bold leading-tight',
      semiBold: 'text-h3 font-semibold leading-tight',
      medium:   'text-h3 font-medium leading-tight',
      normal:   'text-h3 font-normal leading-tight',
      light:    'text-h3 font-light leading-tight',
    },
    h4: {
      bold:     'text-h4 font-bold leading-tight',
      semiBold: 'text-h4 font-semibold leading-tight',
      medium:   'text-h4 font-medium leading-tight',
      normal:   'text-h4 font-normal leading-tight',
      light:    'text-h4 font-light leading-tight',
    },
    h5: {
      bold:     'text-h5 font-bold leading-tight',
      semiBold: 'text-h5 font-semibold leading-tight',
      medium:   'text-h5 font-medium leading-tight',
      normal:   'text-h5 font-normal leading-tight',
      light:    'text-h5 font-light leading-tight',
    },
    h6: {
      bold:     'text-h6 font-bold leading-tight',
      semiBold: 'text-h6 font-semibold leading-tight',
      medium:   'text-h6 font-medium leading-tight',
      normal:   'text-h6 font-normal leading-tight',
      light:    'text-h6 font-light leading-tight',
    },
  },
  paragraph: {
    lg: {
      bold:     'text-para-lg font-bold leading-normal',
      semiBold: 'text-para-lg font-semibold leading-normal',
      medium:   'text-para-lg font-medium leading-normal',
      normal:   'text-para-lg font-normal leading-normal',
      light:    'text-para-lg font-light leading-normal',
    },
    md: {
      bold:     'text-para-md font-bold leading-normal',
      semiBold: 'text-para-md font-semibold leading-normal',
      medium:   'text-para-md font-medium leading-normal',
      normal:   'text-para-md font-normal leading-normal',
      light:    'text-para-md font-light leading-normal',
    },
    sm: {
      bold:     'text-para-sm font-bold leading-normal',
      semiBold: 'text-para-sm font-semibold leading-normal',
      medium:   'text-para-sm font-medium leading-normal',
      normal:   'text-para-sm font-normal leading-normal',
      light:    'text-para-sm font-light leading-normal',
    },
    xs: {
      bold:     'text-para-xs font-bold leading-normal',
      semiBold: 'text-para-xs font-semibold leading-normal',
      medium:   'text-para-xs font-medium leading-normal',
      normal:   'text-para-xs font-normal leading-normal',
      light:    'text-para-xs font-light leading-normal',
    },
  },
  label: {
    lg: {
      bold:     'text-label-lg font-bold leading-none',
      semiBold: 'text-label-lg font-semibold leading-none',
      medium:   'text-label-lg font-medium leading-none',
      normal:   'text-label-lg font-normal leading-none',
      light:    'text-label-lg font-light leading-none',
    },
    md: {
      bold:     'text-label-md font-bold leading-none',
      semiBold: 'text-label-md font-semibold leading-none',
      medium:   'text-label-md font-medium leading-none',
      normal:   'text-label-md font-normal leading-none',
      light:    'text-label-md font-light leading-none',
    },
    sm: {
      bold:     'text-label-sm font-bold leading-none',
      semiBold: 'text-label-sm font-semibold leading-none',
      medium:   'text-label-sm font-medium leading-none',
      normal:   'text-label-sm font-normal leading-none',
      light:    'text-label-sm font-light leading-none',
    },
    xs: {
      bold:     'text-label-xs font-bold leading-none',
      semiBold: 'text-label-xs font-semibold leading-none',
      medium:   'text-label-xs font-medium leading-none',
      normal:   'text-label-xs font-normal leading-none',
      light:    'text-label-xs font-light leading-none',
    },
  },
} as const