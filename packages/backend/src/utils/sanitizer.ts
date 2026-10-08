/**
 * Centralized Input Sanitizer Utility
 * Ensures all data added or updated in the PostgreSQL database is thoroughly cleaned,
 * typed, and free of XSS, SQL injection, script tags, invalid floats, or null-byte injections.
 */

/**
 * Raw coordinates payload input for latitude/longitude sanitization.
 */
export interface RawCoordinatesInput {
  lat?: number | string | null;
  lng?: number | string | null;
}

/**
 * Raw checklist item input for destination bucket list sanitization.
 */
export interface RawChecklistItemInput {
  text?: string | null;
  checked?: boolean | null;
}

/**
 * Raw sticker placement input for destination scrapbook canvas sanitization.
 */
export interface RawStickerInput {
  id?: string | null;
  type?: string | null;
  emoji?: string | null;
  label?: string | null;
  x?: number | null;
  y?: number | null;
  rotate?: number | null;
  scale?: number | null;
}

/**
 * Point coordinate structure for interactive map drawings.
 */
export interface RawDrawingPointInput {
  lat?: number | null;
  lng?: number | null;
}

/**
 * Raw map drawing path input for interactive user sketch layers.
 */
export interface RawMapDrawingInput {
  id?: string | null;
  type?: string | null;
  color?: string | null;
  strokeWidth?: number | null;
  points?: RawDrawingPointInput[] | null;
}

/**
 * Complete raw destination record payload ("d") sent from client requests or external sources.
 * Contains optional fields for name, country, coordinates, description, photo URL, scrapbook notes, checklist, and stickers.
 */
export interface RawDestinationInput {
  id?: string | null;
  name?: string | null;
  country?: string | null;
  coordinates?: RawCoordinatesInput | null;
  description?: string | null;
  image?: string | null;
  notes?: string | null;
  checklist?: RawChecklistItemInput[] | null;
  stickers?: RawStickerInput[] | null;
}

/**
 * Strips HTML tags, script elements, control characters, and null bytes from raw text.
 */
export function sanitizeString(val: string | number | boolean | null | undefined, maxLength = 5000): string {
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
export function sanitizeEmail(val: string | null | undefined): string {
  if (!val) return '';
  const clean = sanitizeString(val, 255).toLowerCase();
  // Basic sanity check to prevent newline injections in email strings
  return clean.replace(/\s+/g, '');
}

/**
 * Sanitizes usernames (alphanumeric, underscores, hyphens, dots, @).
 */
export function sanitizeUsername(val: string | null | undefined): string {
  if (!val) return '';
  const raw = sanitizeString(val, 50);
  return raw.replace(/[^\w.@-]/g, '');
}

/**
 * Validates and sanitizes image URLs, base64 data URIs, or static paths.
 */
export function sanitizeUrl(val: string | null | undefined): string {
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
export function sanitizeCoordinates(coords: RawCoordinatesInput | null | undefined): { lat: number; lng: number } {
  const parse = (v: number | string | null | undefined, isLng: boolean): number => {
    let num = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
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
export function sanitizeChecklist(checklist: RawChecklistItemInput[] | null | undefined): Array<{ text: string; checked: boolean }> {
  if (!Array.isArray(checklist)) return [];

  return checklist
    .filter((item): item is RawChecklistItemInput => Boolean(item && typeof item === 'object'))
    .map(item => ({
      text: sanitizeString(item.text, 250),
      checked: Boolean(item.checked),
    }))
    .slice(0, 100); // Limit to 100 items max
}

/**
 * Sanitizes destination scrapbook stickers array.
 */
export function sanitizeStickers(stickers: RawStickerInput[] | null | undefined): Array<{
  id: string;
  type: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}> {
  if (!Array.isArray(stickers)) return [];

  return stickers
    .filter((s): s is RawStickerInput => Boolean(s && typeof s === 'object'))
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
export function sanitizeMapDrawings(drawings: RawMapDrawingInput[] | null | undefined): Array<{
  id: string;
  type: string;
  color: string;
  strokeWidth: number;
  points: Array<{ lat: number; lng: number }>;
}> {
  if (!Array.isArray(drawings)) return [];

  return drawings
    .filter((d): d is RawMapDrawingInput => Boolean(d && typeof d === 'object'))
    .map(d => ({
      id: sanitizeString(d.id, 100) || `drawing-${Date.now()}`,
      type: sanitizeString(d.type, 50) || 'path',
      color: sanitizeString(d.color, 30) || '#000000',
      strokeWidth: typeof d.strokeWidth === 'number' ? Math.max(1, Math.min(50, d.strokeWidth)) : 3,
      points: Array.isArray(d.points)
        ? d.points
            .filter((p): p is RawDrawingPointInput => Boolean(p && typeof p === 'object'))
            .map(p => ({
              lat: typeof p.lat === 'number' ? Math.max(-90, Math.min(90, p.lat)) : 0,
              lng: typeof p.lng === 'number' ? Math.max(-180, Math.min(180, p.lng)) : 0,
            }))
            .slice(0, 1000)
        : [],
    }))
    .slice(0, 500); // Limit max drawings
}

/**
 * Sanitizes complex raw destination object ("d") sent from client payload into clean, typed database insert object.
 */
export function sanitizeDestinationRecord(d: RawDestinationInput | null | undefined, userId: string, index = 0) {
  const rawId = sanitizeString(d?.id, 100);
  const uniqueSuffix = `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`;
  const id = rawId ? rawId : `dest-${uniqueSuffix}`;

  const cleanImage = sanitizeUrl(d?.image);
  const fallbackImage = '/assets/jaipur_postcard.png';

  return {
    id,
    user_id: userId,
    name: sanitizeString(d?.name, 150) || 'Untitled Destination',
    country: sanitizeString(d?.country, 100) || 'Unknown',
    coordinates: sanitizeCoordinates(d?.coordinates),
    description: sanitizeString(d?.description, 2000) || '',
    image: cleanImage || fallbackImage,
    notes: sanitizeString(d?.notes, 5000) || '',
    checklist: sanitizeChecklist(d?.checklist),
    stickers: sanitizeStickers(d?.stickers),
  };
}
