import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DoodleStickerProps {
  id: string;
  speechText: string;
  speechPosition: 'left' | 'right';
  speechBubbleBg: string;
  svgContent: React.ReactNode;
}

export function DoodleSticker({ id, speechText, speechPosition, speechBubbleBg, svgContent }: DoodleStickerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="cursor-pointer relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {svgContent}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute ${speechPosition === 'left' ? 'right-12' : 'left-10'} -top-6 ${speechBubbleBg} border-2 border-stone-800 text-[9px] py-1 px-2 rounded-lg font-mono whitespace-nowrap z-50`}
          >
            {speechText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
