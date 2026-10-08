import { z } from 'zod';

export const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username too long"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = authSchema.extend({
  email: z.string().email("Invalid email format")
});

export const userSettingsSchema = z.object({
  notes_to_self: z.string().optional(),
  is_public: z.boolean().optional(),
  map_drawings: z.array(z.any()).optional(), // We'll type map_drawings stronger on frontend
  theme_title: z.string().optional(),
  theme_subtitle: z.string().optional(),
  theme_id: z.string().uuid("Invalid theme ID").optional(),
});

const coordVal = (isLng = false) =>
  z.preprocess((val) => {
    let num = typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(num) || !isFinite(num)) num = isLng ? 78.96 : 20.59;
    const min = isLng ? -180 : -90;
    const max = isLng ? 180 : 90;
    num = Math.max(min, Math.min(max, num));
    return Math.round(num * 10000) / 10000;
  }, z.number());

export const destinationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string().optional(),
  lat: coordVal(false),
  lng: coordVal(true),
  photos: z.array(z.string()).optional(),
  is_completed: z.boolean().optional()
});

export const destinationsListSchema = z.array(destinationSchema);

export const createThemeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  base_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  colors: z.record(z.string(), z.string().regex(/^#[0-9A-Fa-f]{6}$/))
});
