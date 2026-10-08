import { z } from 'zod';

/**
 * Authentication & Registration Zod Schemas
 */
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

/**
 * Interactive Map Drawing Zod Schemas
 */
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

/**
 * User Settings & Preferences Zod Schema
 */
export const userSettingsSchema = z.object({
  notes_to_self: z.string().optional(),
  is_public: z.boolean().optional(),
  map_drawings: z.array(mapDrawingSchema).optional(),
  theme_title: z.string().optional(),
  theme_subtitle: z.string().optional(),
  theme_id: z.string().optional(),
});

/**
 * Destination & Scrapbook Zod Schemas
 */
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

/**
 * File Upload & Media Zod Schema
 */
export const uploadPayloadSchema = z.object({
  image: z.string().min(1, "Image payload is required"),
  filename: z.string().optional(),
});

/**
 * Theme Store Creation Zod Schema
 */
export const createThemeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  base_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  colors: z.record(z.string(), z.string().regex(/^#[0-9A-Fa-f]{6}$/))
});

/**
 * Inferred TypeScript Types from Zod Schemas
 */
export type AuthPayload = z.infer<typeof authSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type UserSettingsPayload = z.infer<typeof userSettingsSchema>;
export type RawDestinationPayload = z.infer<typeof rawDestinationSchema>;
export type RawDestinationsListPayload = z.infer<typeof rawDestinationsListSchema>;
export type UploadPayload = z.infer<typeof uploadPayloadSchema>;
export type CreateThemePayload = z.infer<typeof createThemeSchema>;
