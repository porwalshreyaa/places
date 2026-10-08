import React, { useState } from 'react';
import { useMapEvents, Polyline, Polygon, Marker } from 'react-leaflet';
import L from 'leaflet';
import { MapDrawing, LatLngPoint, PencilDrawing, PolygonDrawing, TextDrawing, StickerDrawing } from '../../types';

interface DrawingCanvasProps {
  drawings: MapDrawing[];
  onAddDrawing: (drawing: MapDrawing) => void;
  onRemoveDrawing: (id: string) => void;
  activeTool: 'none' | 'pencil' | 'polygon' | 'text' | 'erase' | 'sticker';
  color: string;
  activeStickerType?: 'shrine' | 'boat' | 'coast' | 'dawn' | 'compass' | 'tree' | 'hills';
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ drawings, onAddDrawing, onRemoveDrawing, activeTool, color, activeStickerType }) => {
  const [currentPath, setCurrentPath] = useState<LatLngPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const map = useMapEvents({
    mousedown(e) {
      if (activeTool === 'pencil' || activeTool === 'polygon') {
        map.dragging.disable();
        setIsDrawing(true);
        setCurrentPath([{ lat: e.latlng.lat, lng: e.latlng.lng }]);
      } else if (activeTool === 'text') {
        const text = prompt("Enter text for map:");
        if (text) {
          const newDrawing: TextDrawing = {
            id: Date.now().toString(),
            type: 'text',
            color: color,
            point: { lat: e.latlng.lat, lng: e.latlng.lng },
            text: text,
            fontSize: 24
          };
          onAddDrawing(newDrawing);
        }
      } else if (activeTool === 'sticker' && activeStickerType) {
        const newDrawing: StickerDrawing = {
          id: Date.now().toString(),
          type: 'sticker',
          color: color,
          point: { lat: e.latlng.lat, lng: e.latlng.lng },
          stickerType: activeStickerType,
          scale: 1
        };
        onAddDrawing(newDrawing);
      }
    },
    mousemove(e) {
      if (!isDrawing) return;
      if (activeTool === 'pencil' || activeTool === 'polygon') {
        setCurrentPath(prev => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
      }
    },
    mouseup() {
      if (!isDrawing) return;
      setIsDrawing(false);
      map.dragging.enable();
      
      if (currentPath.length > 1) {
        if (activeTool === 'pencil') {
          const newDrawing: PencilDrawing = {
            id: Date.now().toString(),
            type: 'pencil',
            color: color,
            points: currentPath,
            weight: 3
          };
          onAddDrawing(newDrawing);
        } else if (activeTool === 'polygon') {
          const newDrawing: PolygonDrawing = {
            id: Date.now().toString(),
            type: 'polygon',
            color: color,
            points: currentPath,
            fillColor: color,
            fillOpacity: 0.3,
            weight: 2
          };
          onAddDrawing(newDrawing);
        }
      }
      setCurrentPath([]);
    }
  });

  const handleErase = (id: string) => {
    if (activeTool === 'erase') {
      onRemoveDrawing(id);
    }
  };

  const createTextIcon = (text: string, col: string) => {
    return L.divIcon({
      className: 'custom-drawing-text',
      html: `<div style="color: ${col}; font-family: 'Caveat', cursive; font-size: 24px; font-weight: bold; white-space: nowrap; transform: translate(-50%, -50%); text-shadow: 1px 1px 2px rgba(255,255,255,0.8); pointer-events: auto;">${text}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  const getStickerEmoji = (type: string) => {
    const map: Record<string, string> = {
      shrine: '🛕', boat: '⛵', coast: '🌴', dawn: '🌅', compass: '🧭', tree: '🌲', hills: '⛰️'
    };
    return map[type] || '✨';
  };

  const createStickerIcon = (type: string, scale: number) => {
    const emoji = getStickerEmoji(type);
    return L.divIcon({
      className: 'custom-drawing-sticker',
      html: `<div style="font-size: ${32 * scale}px; line-height: 1; transform: translate(-50%, -50%); pointer-events: auto; text-shadow: 0px 4px 12px rgba(0,0,0,0.15); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2)); transition: transform 0.2s;">${emoji}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  return (
    <>
      {isDrawing && currentPath.length > 0 && activeTool === 'pencil' && (
        <Polyline positions={currentPath.map(p => [p.lat, p.lng])} pathOptions={{ color, weight: 3, lineCap: 'round', lineJoin: 'round' }} />
      )}
      {isDrawing && currentPath.length > 0 && activeTool === 'polygon' && (
        <Polygon positions={currentPath.map(p => [p.lat, p.lng])} pathOptions={{ color, fillColor: color, fillOpacity: 0.3, weight: 2 }} />
      )}

      {drawings.map(d => {
        if (!d) return null;
        if (d.type === 'pencil') {
          if (!Array.isArray(d.points)) return null;
          const validPoints = d.points.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng));
          if (validPoints.length === 0) return null;
          return <Polyline key={d.id} positions={validPoints.map(p => [p.lat, p.lng])} pathOptions={{ color: d.color, weight: d.weight, lineCap: 'round', lineJoin: 'round', interactive: true }} eventHandlers={{ click: () => handleErase(d.id) }} />;
        }
        if (d.type === 'polygon') {
          if (!Array.isArray(d.points)) return null;
          const validPoints = d.points.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng));
          if (validPoints.length === 0) return null;
          return <Polygon key={d.id} positions={validPoints.map(p => [p.lat, p.lng])} pathOptions={{ color: d.color, fillColor: d.fillColor, fillOpacity: d.fillOpacity, weight: d.weight, interactive: true }} eventHandlers={{ click: () => handleErase(d.id) }} />;
        }
        if (d.type === 'text') {
          if (!d.point || typeof d.point.lat !== 'number' || typeof d.point.lng !== 'number' || isNaN(d.point.lat) || isNaN(d.point.lng)) return null;
          return <Marker key={d.id} position={[d.point.lat, d.point.lng]} icon={createTextIcon(d.text, d.color)} eventHandlers={{ click: () => handleErase(d.id) }} />;
        }
        if (d.type === 'sticker') {
          if (!d.point || typeof d.point.lat !== 'number' || typeof d.point.lng !== 'number' || isNaN(d.point.lat) || isNaN(d.point.lng)) return null;
          return <Marker key={d.id} position={[d.point.lat, d.point.lng]} icon={createStickerIcon(d.stickerType, d.scale)} eventHandlers={{ click: () => handleErase(d.id) }} />;
        }
        return null;
      })}
    </>
  );
};

export default DrawingCanvas;
