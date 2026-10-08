/**
 * Safely parses, clamps, and rounds latitude/longitude coordinates to a specified precision (default 4 decimal places).
 * 4 decimal places provides ~11m precision, which is ideal for map markers without floating point noise.
 */
export function sanitizeCoordinate(val: number | string | null | undefined, isLng = false, decimals = 4): number {
  if (val === null || val === undefined) {
    return isLng ? 78.96 : 20.59;
  }

  let num = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(num) || !isFinite(num)) {
    num = isLng ? 78.96 : 20.59;
  }

  const min = isLng ? -180 : -90;
  const max = isLng ? 180 : 90;
  num = Math.max(min, Math.min(max, num));

  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Formats coordinates for aesthetic UI display (e.g. "28.6139° N, 77.2090° E").
 */
export function formatCoordinatesDisplay(lat: number | string, lng: number | string, decimals = 4): string {
  const cleanLat = sanitizeCoordinate(lat, false, decimals);
  const cleanLng = sanitizeCoordinate(lng, true, decimals);

  const latDir = cleanLat >= 0 ? 'N' : 'S';
  const lngDir = cleanLng >= 0 ? 'E' : 'W';

  return `📍 ${Math.abs(cleanLat).toFixed(decimals)}° ${latDir}, ${Math.abs(cleanLng).toFixed(decimals)}° ${lngDir}`;
}
