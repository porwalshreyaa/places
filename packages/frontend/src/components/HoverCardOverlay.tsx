import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { Destination } from '../types';

interface HoverCardOverlayProps {
  hoveredDest: Destination | null;
}

const HoverCardOverlay: React.FC<HoverCardOverlayProps> = ({ hoveredDest }) => {
  const map = useMap();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!hoveredDest) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const point = map.latLngToContainerPoint([hoveredDest.coordinates.lat, hoveredDest.coordinates.lng]);
      setPosition({ x: point.x, y: point.y });
    };

    updatePosition();
    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    
    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
    };
  }, [hoveredDest, map]);

  return (
    <AnimatePresence>
      {hoveredDest && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 15 }}
          transition={{ duration: 0.15 }}
          className="absolute z-[2000] bg-white p-2.5 pb-4 rounded-xs shadow-2xl border-4 border-white max-w-[170px] pointer-events-none select-none"
          style={{
            left: `${position.x - 85}px`,
            top: `${position.y - 155}px`,
            borderBottomWidth: '10px'
          }}
        >
          {/* Washi tape on tooltip */}
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 rotate-3 w-16 h-4 bg-brand-100/90 border border-brand-200/50 backdrop-blur-sm text-[7px] text-center font-mono font-bold text-brand-700 select-none">
            ★ PINNED ★
          </div>

          <div className="relative aspect-square w-full rounded bg-stone-100 overflow-hidden mb-1.5 border border-stone-200">
            <img
              src={hoveredDest.image}
              alt={hoveredDest.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center font-caveat text-xs font-bold text-stone-800 leading-tight truncate">
            {hoveredDest.name}
          </div>
          <div className="text-center font-caveat text-[10px] text-brand-500 mt-0.5 tracking-wider uppercase font-bold">
            {hoveredDest.country}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoverCardOverlay;
