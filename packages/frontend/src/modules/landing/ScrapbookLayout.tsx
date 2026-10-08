import React from 'react';
import { motion } from 'motion/react';
import { LeftPage } from './LeftPage';
import { RightPage } from './RightPage';

export function ScrapbookLayout() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative h-screen max-h-screen w-full bg-[#faf8f4] text-stone-800 font-kalam select-none flex flex-col lg:flex-row overflow-hidden p-2 sm:p-4 lg:p-5"
    >
      {/* Background Notebook Page Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px)] [background-size:100%_22px] pointer-events-none z-0" />

      {/* Left Page (Fills 50% width on LG, fits in h-full) */}
      <LeftPage />

      {/* =========================================================================
          MIDDLE SPIRAL BINDER / ALBUM RINGS
         ========================================================================= */}
      <div className="hidden lg:flex flex-col justify-around absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 h-full z-30 pointer-events-none py-6">
        {[...Array(12)].map((_, i) => (
          <div 
            key={`spiral-${i}`} 
            className="w-10 h-4 bg-linear-to-b from-[#b0bec5] via-[#78909c] to-[#455a64] rounded-full border border-stone-600 shadow-[2px_3px_5px_rgba(0,0,0,0.35)] transform -rotate-6"
          />
        ))}
      </div>

      {/* Right Page (Fills 50% width on LG, fits in h-full) */}
      <RightPage />

    </motion.div>
  );
}
