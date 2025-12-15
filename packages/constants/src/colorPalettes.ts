export const colorPalettes = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'danger',
  'success',
  'warning',
] as const

export const colorPaletteLevels = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const

export type ColorPalette = (typeof colorPalettes)[number]
