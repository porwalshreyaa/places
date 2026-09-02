export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ScrapSticker {
  id: string;
  type: string; // "heart" | "sparkle" | "star" | "camera" | "tape" | "airplane" | "luggage" | "coffee" | "cloud" | "custom"
  emoji?: string; // If it's a custom or AI suggested emoji sticker
  label?: string; // If it's a text/sticker quote
  x: number; // percentage or px within the container
  y: number;
  rotate: number; // degrees of rotation
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
  created_at: string;
}
