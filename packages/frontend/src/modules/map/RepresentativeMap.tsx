import React, { useState, useEffect } from "react";
import { Destination, MapDrawing } from "../../types";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { PenTool, Hexagon, Type, Eraser, Undo, Redo, Hand, Sticker } from "lucide-react";
import DrawingCanvas from "./DrawingCanvas";
import HoverCardOverlay from "../../components/HoverCardOverlay";
import "leaflet/dist/leaflet.css";

interface MapProps {
  destinations: Destination[];
  onPinClick: (dest: Destination) => void;
  onMapClick: (coords: { lat: number; lng: number }) => void;
  isEditable: boolean;
  mapDrawings?: MapDrawing[];
  onUpdateMapDrawings?: (drawings: MapDrawing[]) => void;
}

// Map clicks
const MapClickHandler = ({ onMapClick, canClick }: { onMapClick: (c: {lat: number, lng: number}) => void, canClick: boolean }) => {
  useMapEvents({
    click(e) {
      if (canClick) {
        onMapClick({ lat: parseFloat(e.latlng.lat.toFixed(4)), lng: parseFloat(e.latlng.lng.toFixed(4)) });
      }
    }
  });
  return null;
};

const RepresentativeMap: React.FC<MapProps> = ({ destinations, onPinClick, onMapClick, isEditable, mapDrawings = [], onUpdateMapDrawings }) => {
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  // Drawing State (synchronized with props)
  const [undoHistory, setUndoHistory] = useState<MapDrawing[][]>([mapDrawings]);
  const [historyStep, setHistoryStep] = useState(0);
  const [activeTool, setActiveTool] = useState<'none' | 'pencil' | 'polygon' | 'text' | 'erase' | 'sticker'>('none');
  const [drawColor, setDrawColor] = useState<string>('#ec4899'); // default pink
  const [activeStickerType, setActiveStickerType] = useState<'shrine' | 'boat' | 'coast' | 'dawn' | 'compass' | 'tree' | 'hills'>('shrine');
  
  useEffect(() => {
    // If external mapDrawings changes completely, we can reset history, but usually we just want to load initial data.
    if (mapDrawings && undoHistory.length === 1 && undoHistory[0].length === 0 && mapDrawings.length > 0) {
      setUndoHistory([mapDrawings]);
    }
  }, [mapDrawings]);

  const drawings = undoHistory[historyStep] || [];

  const updateDrawingsAndNotify = (newDrawings: MapDrawing[]) => {
    const newHistory = undoHistory.slice(0, historyStep + 1);
    newHistory.push(newDrawings);
    setUndoHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    if (onUpdateMapDrawings) {
      onUpdateMapDrawings(newDrawings);
    }
  };

  const onAddDrawing = (drawing: MapDrawing) => {
    updateDrawingsAndNotify([...drawings, drawing]);
  };

  const onRemoveDrawing = (id: string) => {
    updateDrawingsAndNotify(drawings.filter(d => d.id !== id));
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      if (onUpdateMapDrawings) onUpdateMapDrawings(undoHistory[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < undoHistory.length - 1) {
      setHistoryStep(prev => prev + 1);
      if (onUpdateMapDrawings) onUpdateMapDrawings(undoHistory[historyStep + 1]);
    }
  };



  return (
    <div id="representative-map-container" className="relative w-full aspect-[16/10] bg-[#fffdf9] rounded-2xl border-2 border-stone-200/80 shadow-xs overflow-hidden group select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e1d8_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-75 pointer-events-none z-[1]" />
      
      <div className="absolute top-2.5 left-4 text-[9px] font-mono uppercase tracking-widest text-stone-400 z-50 pointer-events-none">Sacred Atlas Lat: 20.59 N</div>
      <div className="absolute bottom-2.5 right-4 text-[9px] font-mono uppercase tracking-widest text-stone-400 z-50 pointer-events-none">Meridian Long: 78.96 E</div>

      {isEditable && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-stone-200 z-[1000] flex items-center gap-2 pointer-events-auto transition-all">
          <button onClick={() => setActiveTool('none')} className={`p-2 rounded-full transition-colors ${activeTool === 'none' ? 'bg-stone-200' : 'hover:bg-stone-100'}`} title="Pan (Grab)"><Hand size={18} className="text-stone-700" /></button>
          <div className="w-px h-6 bg-stone-300 mx-1" />
          <button onClick={() => setActiveTool('pencil')} className={`p-2 rounded-full transition-colors ${activeTool === 'pencil' ? 'bg-brand-100 text-brand-600' : 'hover:bg-stone-100 text-stone-600'}`} title="Pencil"><PenTool size={18} /></button>
          <button onClick={() => setActiveTool('polygon')} className={`p-2 rounded-full transition-colors ${activeTool === 'polygon' ? 'bg-blue-100 text-blue-600' : 'hover:bg-stone-100 text-stone-600'}`} title="Polygon Area"><Hexagon size={18} /></button>
          <button onClick={() => setActiveTool('text')} className={`p-2 rounded-full transition-colors ${activeTool === 'text' ? 'bg-amber-100 text-amber-600' : 'hover:bg-stone-100 text-stone-600'}`} title="Add Text"><Type size={18} /></button>
          <button onClick={() => setActiveTool('sticker')} className={`p-2 rounded-full transition-colors ${activeTool === 'sticker' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-stone-100 text-stone-600'}`} title="Add Sticker"><Sticker size={18} /></button>
          <button onClick={() => setActiveTool('erase')} className={`p-2 rounded-full transition-colors ${activeTool === 'erase' ? 'bg-red-100 text-red-600' : 'hover:bg-stone-100 text-stone-600'}`} title="Erase"><Eraser size={18} /></button>
          <div className="w-px h-6 bg-stone-300 mx-1" />
          
          {activeTool === 'sticker' && (
            <div className="flex gap-1 mr-1 p-1 bg-stone-100 rounded-full border border-stone-200">
              {(['shrine', 'boat', 'coast', 'dawn', 'compass', 'tree', 'hills'] as const).map(s => (
                <button 
                  key={s} 
                  onClick={() => setActiveStickerType(s)}
                  className={`px-2 py-1 text-xs font-bold font-sans rounded-full ${activeStickerType === s ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  {s}
                </button>
              ))}
              <div className="w-px h-5 bg-stone-300 mx-1 mt-0.5" />
            </div>
          )}
          
          <button onClick={handleUndo} disabled={historyStep <= 0} className={`p-2 rounded-full transition-colors ${historyStep <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700'}`} title="Undo"><Undo size={18} /></button>
          <button onClick={handleRedo} disabled={historyStep >= undoHistory.length - 1} className={`p-2 rounded-full transition-colors ${historyStep >= undoHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700'}`} title="Redo"><Redo size={18} /></button>
          
          <div className="w-px h-6 bg-stone-300 mx-1" />
          <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" title="Color" />
        </div>
      )}

      <MapContainer
        center={[22.55, 82.75]}
        zoom={5}
        minZoom={4}
        maxZoom={8}
        zoomControl={false}
        attributionControl={false}
        className={`w-full h-full z-10 ${activeTool === 'none' ? "cursor-grab" : "cursor-crosshair"}`}
        style={{ background: 'transparent' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          opacity={0.6}
        />



        <MapClickHandler onMapClick={onMapClick} canClick={activeTool === 'none'} />

        <DrawingCanvas 
          drawings={drawings} 
          onAddDrawing={onAddDrawing}
          onRemoveDrawing={onRemoveDrawing}
          activeTool={activeTool}
          color={drawColor}
          activeStickerType={activeStickerType}
        />



        {/* Destination Markers */}
        {destinations.map((dest, i) => {
          const colors = ["#ec4899", "#3b82f6", "#eab308", "#14b8a6", "#a855f7", "#f97316"];
          const markerColor = colors[i % colors.length];
          
          const iconHtml = `
            <div style="width: 28px; height: 28px; border-radius: 50%; overflow: hidden; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); background-color: ${markerColor}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
              ${dest.image ? `<img src="${dest.image}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'" />` : ''}
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-destination-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          return (
            <React.Fragment key={dest.id}>
              <Marker
                position={[dest.coordinates.lat, dest.coordinates.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    onPinClick(dest);
                  },
                  mouseover: () => {
                    setHoveredDest(dest);
                  },
                  mouseout: () => {
                    setHoveredDest(null);
                  }
                }}
              />
            </React.Fragment>
          );
        })}
        
        <HoverCardOverlay hoveredDest={hoveredDest} />
      </MapContainer>
    </div>
  );
};
export default RepresentativeMap;
