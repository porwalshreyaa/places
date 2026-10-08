import { z } from 'zod';

// ==========================================
// 1. DOMAIN INTERFACES
// ==========================================

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ScrapSticker {
  id: string;
  type: string;
  emoji?: string;
  label?: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  description: string;
  image: string;
  notes: string;
  checklist: ChecklistItem[];
  stickers: ScrapSticker[];
}

export type DrawingType = 'pencil' | 'polygon' | 'text' | 'sticker';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface DrawingBase {
  id: string;
  type: DrawingType;
  color: string;
}

export interface PencilDrawing extends DrawingBase {
  type: 'pencil';
  points: LatLngPoint[];
  weight: number;
}

export interface PolygonDrawing extends DrawingBase {
  type: 'polygon';
  points: LatLngPoint[];
  fillColor: string;
  fillOpacity: number;
  weight: number;
}

export interface TextDrawing extends DrawingBase {
  type: 'text';
  point: LatLngPoint;
  text: string;
  fontSize: number;
}

export interface StickerDrawing extends DrawingBase {
  type: 'sticker';
  point: LatLngPoint;
  stickerType: 'shrine' | 'boat' | 'coast' | 'dawn' | 'compass' | 'tree' | 'hills';
  scale: number;
}

export type MapDrawing = PencilDrawing | PolygonDrawing | TextDrawing | StickerDrawing;

export interface Theme {
  id: string;
  name: string;
  creator_id: string | null;
  base_color: string;
  colors: Record<string, string>;
  color_hash: string;
  is_system: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
  is_public: boolean;
  notes_to_self?: string | null;
  map_drawings?: MapDrawing[] | null;
  theme_title?: string | null;
  theme_subtitle?: string | null;
  theme_id?: string | null;
}

// ==========================================
// 2. ZOD VALIDATION SCHEMAS
// ==========================================

export const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username too long"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = authSchema.extend({
  email: z.string().email("Invalid email format")
});

export const checkAvailabilityQuerySchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
});

export const mapDrawingPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const mapDrawingSchema = z.object({
  id: z.string(),
  type: z.string(),
  color: z.string(),
  strokeWidth: z.number().min(1).max(50),
  points: z.array(mapDrawingPointSchema),
});

export const userSettingsSchema = z.object({
  notes_to_self: z.string().optional(),
  is_public: z.boolean().optional(),
  map_drawings: z.array(mapDrawingSchema).optional(),
  theme_title: z.string().optional(),
  theme_subtitle: z.string().optional(),
  theme_id: z.string().optional(),
});

export const rawCoordinatesSchema = z.object({
  lat: z.union([z.number(), z.string()]).nullable().optional(),
  lng: z.union([z.number(), z.string()]).nullable().optional(),
});

export const rawChecklistItemSchema = z.object({
  text: z.string().nullable().optional(),
  checked: z.boolean().nullable().optional(),
});

export const rawStickerSchema = z.object({
  id: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  emoji: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  x: z.number().nullable().optional(),
  y: z.number().nullable().optional(),
  rotate: z.number().nullable().optional(),
  scale: z.number().nullable().optional(),
});

export const rawDestinationSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  coordinates: rawCoordinatesSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  checklist: z.array(rawChecklistItemSchema).nullable().optional(),
  stickers: z.array(rawStickerSchema).nullable().optional(),
});

export const rawDestinationsListSchema = z.array(rawDestinationSchema);
export const destinationsListSchema = z.array(rawDestinationSchema);

export const uploadPayloadSchema = z.object({
  image: z.string().min(1, "Image payload is required"),
  filename: z.string().optional(),
});

export const createThemeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  base_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  colors: z.record(z.string(), z.string().regex(/^#[0-9A-Fa-f]{6}$/))
});

// ==========================================
// 3. INFERRED TYPES & DTO CONTRACTS
// ==========================================

export type AuthPayload = z.infer<typeof authSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type CheckAvailabilityQuery = z.infer<typeof checkAvailabilityQuerySchema>;
export type UserSettingsPayload = z.infer<typeof userSettingsSchema>;
export type RawDestinationInput = z.infer<typeof rawDestinationSchema>;
export type RawDestinationPayload = z.infer<typeof rawDestinationSchema>;
export type RawDestinationsListPayload = z.infer<typeof rawDestinationsListSchema>;
export type UploadPayload = z.infer<typeof uploadPayloadSchema>;
export type CreateThemePayload = z.infer<typeof createThemeSchema>;

export interface AdminStats {
  totalUsers: number;
  totalDestinations: number;
  totalThemes: number;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  role: string;
  is_public: boolean;
  notes_to_self: string | null;
  map_drawings: unknown;
  theme_title: string | null;
  theme_subtitle: string | null;
  theme_id: string | null;
  theme: unknown | null;
}

export interface PublicProfileResponse {
  username: string;
  notes_to_self: string | null;
  map_drawings: unknown;
  theme_title: string | null;
  theme_subtitle: string | null;
  theme_id: string | null;
  theme: unknown | null;
  destinations: unknown[];
}
