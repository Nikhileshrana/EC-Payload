export type ThemeColorSet = {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  ring?: string
}

export type ColorThemePresetSlug =
  | 'navy'
  | 'blue'
  | 'orange'
  | 'pink'
  | 'green'
  | 'purple'
  | 'rose'

export type ColorThemePreset = {
  label: string
  light: ThemeColorSet
  dark: ThemeColorSet
}

export const colorThemePresets: Record<ColorThemePresetSlug, ColorThemePreset> = {
  navy: {
    label: 'Navy',
    light: {
      primary: '#1e293b',
      primaryForeground: '#f8fafc',
      secondary: '#f1f5f9',
      secondaryForeground: '#1e293b',
      accent: '#e2e8f0',
      accentForeground: '#0f172a',
      ring: '#64748b',
    },
    dark: {
      primary: '#e2e8f0',
      primaryForeground: '#0f172a',
      secondary: '#1e293b',
      secondaryForeground: '#f8fafc',
      accent: '#334155',
      accentForeground: '#f8fafc',
      ring: '#94a3b8',
    },
  },
  blue: {
    label: 'Blue',
    light: {
      primary: '#2563eb',
      primaryForeground: '#eff6ff',
      secondary: '#dbeafe',
      secondaryForeground: '#1e3a8a',
      accent: '#bfdbfe',
      accentForeground: '#1e40af',
      ring: '#3b82f6',
    },
    dark: {
      primary: '#60a5fa',
      primaryForeground: '#0c1a3d',
      secondary: '#1e3a8a',
      secondaryForeground: '#dbeafe',
      accent: '#1d4ed8',
      accentForeground: '#eff6ff',
      ring: '#93c5fd',
    },
  },
  orange: {
    label: 'Orange',
    light: {
      primary: '#ea580c',
      primaryForeground: '#fff7ed',
      secondary: '#ffedd5',
      secondaryForeground: '#9a3412',
      accent: '#fed7aa',
      accentForeground: '#c2410c',
      ring: '#f97316',
    },
    dark: {
      primary: '#fb923c',
      primaryForeground: '#431407',
      secondary: '#7c2d12',
      secondaryForeground: '#ffedd5',
      accent: '#9a3412',
      accentForeground: '#fff7ed',
      ring: '#fdba74',
    },
  },
  pink: {
    label: 'Pink',
    light: {
      primary: '#db2777',
      primaryForeground: '#fdf2f8',
      secondary: '#fce7f3',
      secondaryForeground: '#831843',
      accent: '#fbcfe8',
      accentForeground: '#9d174d',
      ring: '#ec4899',
    },
    dark: {
      primary: '#f472b6',
      primaryForeground: '#500724',
      secondary: '#831843',
      secondaryForeground: '#fce7f3',
      accent: '#9d174d',
      accentForeground: '#fdf2f8',
      ring: '#f9a8d4',
    },
  },
  green: {
    label: 'Green',
    light: {
      primary: '#059669',
      primaryForeground: '#ecfdf5',
      secondary: '#d1fae5',
      secondaryForeground: '#065f46',
      accent: '#a7f3d0',
      accentForeground: '#047857',
      ring: '#10b981',
    },
    dark: {
      primary: '#34d399',
      primaryForeground: '#052e16',
      secondary: '#065f46',
      secondaryForeground: '#d1fae5',
      accent: '#047857',
      accentForeground: '#ecfdf5',
      ring: '#6ee7b7',
    },
  },
  purple: {
    label: 'Purple',
    light: {
      primary: '#7c3aed',
      primaryForeground: '#f5f3ff',
      secondary: '#ede9fe',
      secondaryForeground: '#4c1d95',
      accent: '#ddd6fe',
      accentForeground: '#5b21b6',
      ring: '#8b5cf6',
    },
    dark: {
      primary: '#a78bfa',
      primaryForeground: '#2e1065',
      secondary: '#4c1d95',
      secondaryForeground: '#ede9fe',
      accent: '#5b21b6',
      accentForeground: '#f5f3ff',
      ring: '#c4b5fd',
    },
  },
  rose: {
    label: 'Rose',
    light: {
      primary: '#e11d48',
      primaryForeground: '#fff1f2',
      secondary: '#ffe4e6',
      secondaryForeground: '#881337',
      accent: '#fecdd3',
      accentForeground: '#be123c',
      ring: '#f43f5e',
    },
    dark: {
      primary: '#fb7185',
      primaryForeground: '#4c0519',
      secondary: '#881337',
      secondaryForeground: '#ffe4e6',
      accent: '#be123c',
      accentForeground: '#fff1f2',
      ring: '#fda4af',
    },
  },
}

export const colorThemePresetOptions = Object.entries(colorThemePresets).map(([value, preset]) => ({
  label: preset.label,
  value,
}))
