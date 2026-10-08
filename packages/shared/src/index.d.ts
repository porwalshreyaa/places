import { z } from 'zod';
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
    coordinates: {
        lat: number;
        lng: number;
    };
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
export declare const authSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export declare const checkAvailabilityQuerySchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const mapDrawingPointSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
}, z.core.$strip>;
export declare const mapDrawingSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    color: z.ZodString;
    strokeWidth: z.ZodNumber;
    points: z.ZodArray<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const userSettingsSchema: z.ZodObject<{
    notes_to_self: z.ZodOptional<z.ZodString>;
    is_public: z.ZodOptional<z.ZodBoolean>;
    map_drawings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        color: z.ZodString;
        strokeWidth: z.ZodNumber;
        points: z.ZodArray<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    theme_title: z.ZodOptional<z.ZodString>;
    theme_subtitle: z.ZodOptional<z.ZodString>;
    theme_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const rawCoordinatesSchema: z.ZodObject<{
    lat: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
    lng: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
}, z.core.$strip>;
export declare const rawChecklistItemSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checked: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const rawStickerSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    emoji: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    x: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    y: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rotate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    scale: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export declare const rawDestinationSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    country: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    coordinates: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        lat: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
        lng: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
    }, z.core.$strip>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checklist: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checked: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
    stickers: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        emoji: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        x: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        y: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rotate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        scale: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const rawDestinationsListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    country: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    coordinates: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        lat: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
        lng: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
    }, z.core.$strip>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checklist: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checked: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
    stickers: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        emoji: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        x: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        y: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rotate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        scale: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>>;
export declare const destinationsListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    country: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    coordinates: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        lat: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
        lng: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>;
    }, z.core.$strip>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checklist: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        text: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checked: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
    stickers: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        emoji: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        x: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        y: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rotate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        scale: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>>;
export declare const uploadPayloadSchema: z.ZodObject<{
    image: z.ZodString;
    filename: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createThemeSchema: z.ZodObject<{
    name: z.ZodString;
    base_color: z.ZodString;
    colors: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strip>;
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
