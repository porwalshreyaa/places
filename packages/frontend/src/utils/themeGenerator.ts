/**
 * Converts a hex color string to an RGB array.
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Converts an RGB array to a hex string.
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Interpolates between two colors (0.0 = c1, 1.0 = c2).
 */
function interpolateColor(c1: [number, number, number], c2: [number, number, number], factor: number): [number, number, number] {
  return [
    c1[0] + (c2[0] - c1[0]) * factor,
    c1[1] + (c2[1] - c1[1]) * factor,
    c1[2] + (c2[2] - c1[2]) * factor,
  ];
}

/**
 * Generates a Tailwind-like palette from 50 to 700 from a single base hex (treated as 500).
 */
export function generateThemeShades(baseHex: string): Record<string, string> {
  const baseRgb = hexToRgb(baseHex);
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];

  return {
    '50': rgbToHex(...interpolateColor(baseRgb, white, 0.9)),
    '100': rgbToHex(...interpolateColor(baseRgb, white, 0.8)),
    '200': rgbToHex(...interpolateColor(baseRgb, white, 0.6)),
    '300': rgbToHex(...interpolateColor(baseRgb, white, 0.4)),
    '400': rgbToHex(...interpolateColor(baseRgb, white, 0.2)),
    '500': baseHex,
    '600': rgbToHex(...interpolateColor(baseRgb, black, 0.2)),
    '700': rgbToHex(...interpolateColor(baseRgb, black, 0.4)),
  };
}
