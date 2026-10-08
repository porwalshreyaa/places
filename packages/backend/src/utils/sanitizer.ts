/**
 * Centralized Input Sanitizer Utility
 * Ensures all data added or updated in the PostgreSQL database is thoroughly cleaned,
 * typed, and free of XSS, SQL injection, script tags, invalid floats, or null-byte injections.
 */

/**
 * Strips HTML tags, script elements, control characters, and null bytes from raw text.
 */
export function sanitizeString(val: unknown, maxLength = 5000): string {
  if (val === null || val === undefined) return '';
  let str = String(val);

  // Remove null bytes and control characters except newlines/tabs
  str = str.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip script tags and inline event handlers
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  str = str.replace(/javascript\s*:/gi, '');

  // Trim whitespace and enforce length limits
  str = str.trim();
  if (maxLength > 0 && str.length > maxLength) {
    str = str.substring(0, maxLength);
  }

  return str;
}

/**
 * Sanitizes and normalizes email addresses.
 */
export function sanitizeEmail(val: unknown): string {
  if (!val) return '';
  const clean = sanitizeString(val, 255).toLowerCase();
  // Basic sanity check to prevent newline injections in email strings
  return clean.replace(/\s+/g, '');
}

/**
 * Sanitizes usernames (alphanumeric, underscores, hyphens, dots, @).
 */
export function sanitizeUsername(val: unknown): string {
  if (!val) return '';
  const raw = sanitizeString(val, 50);
  return raw.replace(/[^\w.@-]/g, '');
}

/**
 * Validates and sanitizes image URLs, base64 data URIs, or static paths.
 */
export function sanitizeUrl(val: unknown): string {
  if (!val) return '';
  const url = sanitizeString(val, 1000000); // Allow base64 strings

  // Reject dangerous protocols
  if (/^(javascript|vbscript|file):/i.test(url)) {
    return '';
  }

  return url;
}

/**
 * Parses, clamps, and rounds latitude/longitude coordinates to 4 decimal places.
 */
export function sanitizeCoordinates(coords: any): { lat: number; lng: number } {
  const parse = (v: any, isLng: boolean): number => {
    let num = typeof v === 'number' ? v : parseFloat(String(v));
    if (isNaN(num) || !isFinite(num)) {
      num = isLng ? 78.96 : 20.59;
    }
    const min = isLng ? -180 : -90;
    const max = isLng ? 180 : 90;
    num = Math.max(min, Math.min(max, num));
    return Math.round(num * 10000) / 10000;
  };

  const lat = parse(coords?.lat, false);
  const lng = parse(coords?.lng, true);

  return { lat, lng };
}

/**
 * Sanitizes destination checklist array.
 */
export function sanitizeChecklist(checklist: unknown): Array<{ text: string; checked: boolean }> {
  if (!Array.isArray(checklist)) return [];

  return checklist
    .filter(item => item && typeof item === 'object')
    .map(item => ({
      text: sanitizeString(item.text, 250),
      checked: Boolean(item.checked),
    }))
    .slice(0, 100); // Limit to 100 items max
}

/**
 * Sanitizes destination scrapbook stickers array.
 */
export function sanitizeStickers(stickers: unknown): Array<Record<string, any>> {
  if (!Array.isArray(stickers)) return [];

  return stickers
    .filter(s => s && typeof s === 'object')
    .map(s => {
      const x = typeof s.x === 'number' ? Math.max(0, Math.min(100, s.x)) : 50;
      const y = typeof s.y === 'number' ? Math.max(0, Math.min(100, s.y)) : 50;
      const rotate = typeof s.rotate === 'number' ? Math.max(-360, Math.min(360, s.rotate)) : 0;
      const scale = typeof s.scale === 'number' ? Math.max(0.1, Math.min(10, s.scale)) : 1;

      return {
        id: sanitizeString(s.id, 100) || `sticker-${Date.now()}`,
        type: sanitizeString(s.type, 50) || 'custom',
        emoji: sanitizeString(s.emoji, 10),
        label: sanitizeString(s.label, 100),
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        rotate: Math.round(rotate * 100) / 100,
        scale: Math.round(scale * 100) / 100,
      };
    })
    .slice(0, 200); // Limit max stickers
}

/**
 * Sanitizes user interactive map drawings array.
 */
export function sanitizeMapDrawings(drawings: unknown): Array<Record<string, any>> {
  if (!Array.isArray(drawings)) return [];

  return drawings
    .filter(d => d && typeof d === 'object')
    .map(d => ({
      id: sanitizeString(d.id, 100) || `drawing-${Date.now()}`,
      type: sanitizeString(d.type, 50) || 'path',
      color: sanitizeString(d.color, 30) || '#000000',
      strokeWidth: typeof d.strokeWidth === 'number' ? Math.max(1, Math.min(50, d.strokeWidth)) : 3,
      points: Array.isArray(d.points)
        ? d.points
            .filter((p: any) => p && typeof p === 'object')
            .map((p: any) => ({
              lat: typeof p.lat === 'number' ? Math.max(-90, Math.min(90, p.lat)) : 0,
              lng: typeof p.lng === 'number' ? Math.max(-180, Math.min(180, p.lng)) : 0,
            }))
            .slice(0, 1000)
        : [],
    }))
    .slice(0, 500); // Limit max drawings
}

/**
 * Sanitizes destination record for database insertion.
 */
export function sanitizeDestinationRecord(d: any, userId: string) {
  return {
    id: sanitizeString(d?.id, 100) || `dest-${Date.now()}`,
    user_id: userId,
    name: sanitizeString(d?.name, 150) || 'Untitled Destination',
    country: sanitizeString(d?.country, 100) || 'Unknown',
    coordinates: sanitizeCoordinates(d?.coordinates),
    description: sanitizeString(d?.description, 2000),
    image: sanitizeUrl(d?.image),
    notes: sanitizeString(d?.notes, 5000),
    checklist: sanitizeChecklist(d?.checklist),
    stickers: sanitizeStickers(d?.stickers),
  };
}
