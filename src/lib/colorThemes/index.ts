import type { Setting } from '@/payload-types'

import {
  colorThemePresets,
  type ColorThemePresetSlug,
  type ThemeColorSet,
} from './presets'

const HEX_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_PATTERN.test(value.trim())
}

function normalizeHex(value: string): string {
  const hex = value.trim()
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  return hex
}

function hexToRgb(hex: string): { b: number; g: number; r: number } | null {
  const normalized = normalizeHex(hex).replace('#', '')
  if (normalized.length !== 6) return null

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function getContrastForeground(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#fafafa'

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.58 ? '#171717' : '#fafafa'
}

function mixHex(base: string, target: string, amount: number): string {
  const a = hexToRgb(base)
  const b = hexToRgb(target)
  if (!a || !b) return base

  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * amount)
      .toString(16)
      .padStart(2, '0')

  return `#${mix(a.r, b.r)}${mix(a.g, b.g)}${mix(a.b, b.b)}`
}

function buildCustomSet(theme: Setting): ThemeColorSet {
  const primary = normalizeHex(theme.customPrimary || '#1e293b')
  const secondary = normalizeHex(theme.customSecondary || mixHex(primary, '#ffffff', 0.88))
  const accent = normalizeHex(theme.customAccent || mixHex(primary, '#ffffff', 0.78))

  return {
    primary,
    primaryForeground: theme.customPrimaryForeground
      ? normalizeHex(theme.customPrimaryForeground)
      : getContrastForeground(primary),
    secondary,
    secondaryForeground: theme.customSecondaryForeground
      ? normalizeHex(theme.customSecondaryForeground)
      : getContrastForeground(secondary),
    accent,
    accentForeground: theme.customAccentForeground
      ? normalizeHex(theme.customAccentForeground)
      : getContrastForeground(accent),
    ring: theme.customRing ? normalizeHex(theme.customRing) : primary,
  }
}

function buildCustomDarkSet(light: ThemeColorSet): ThemeColorSet {
  return {
    primary: mixHex(light.primary, '#ffffff', 0.35),
    primaryForeground: getContrastForeground(mixHex(light.primary, '#ffffff', 0.35)),
    secondary: mixHex(light.primary, '#000000', 0.72),
    secondaryForeground: '#f5f5f5',
    accent: mixHex(light.accent, '#000000', 0.55),
    accentForeground: '#f5f5f5',
    ring: mixHex(light.ring ?? light.primary, '#ffffff', 0.35),
  }
}

export function resolveSiteColorTheme(theme?: Setting | null): {
  dark: ThemeColorSet
  light: ThemeColorSet
} {
  if (!theme || theme.source === 'preset') {
    const presetSlug = (theme?.preset as ColorThemePresetSlug | undefined) ?? 'navy'
    const preset = colorThemePresets[presetSlug] ?? colorThemePresets.navy

    return {
      light: preset.light,
      dark: preset.dark,
    }
  }

  const light = buildCustomSet(theme)

  return {
    light,
    dark: buildCustomDarkSet(light),
  }
}

export function buildSiteColorThemeCss(theme?: Setting | null): string {
  const { light, dark } = resolveSiteColorTheme(theme)

  const toVars = (set: ThemeColorSet) => `
  --primary: ${set.primary};
  --primary-foreground: ${set.primaryForeground};
  --secondary: ${set.secondary};
  --secondary-foreground: ${set.secondaryForeground};
  --accent: ${set.accent};
  --accent-foreground: ${set.accentForeground};
  --ring: ${set.ring ?? set.primary};`

  return `:root {${toVars(light)}
}
[data-theme='dark'] {${toVars(dark)}
}`
}

export function validateHexField(value: unknown): true | string {
  if (value == null || value === '') {
    return true
  }

  return isValidHexColor(value) ? true : 'Enter a valid hex color (e.g. #2563eb)'
}
