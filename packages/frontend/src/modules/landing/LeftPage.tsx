import React from 'react';
import { DoodleSticker } from '../../components/DoodleSticker';

export function LeftPage() {
  return (
    <div className="flex-1 p-3 sm:p-5 lg:p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-stone-300 relative flex flex-col justify-between z-10 overflow-hidden h-full max-h-full">
      
      {/* Background paper texture & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#8d6e63_0.5px,transparent_0.5px)] [background-size:16px_16px] pointer-events-none opacity-30 z-0" />

      {/* Route Map Scrap peeking from top-left */}
      <img 
        src="/assets/route_map.png" 
        alt="Route Map" 
        className="absolute -left-10 -top-8 w-36 object-contain transform -rotate-12 z-0 opacity-80 drop-shadow-md pointer-events-none"
      />

      {/* Washi tape on top corner */}
      <img 
        src="/assets/washi_tape_striped.png" 
        alt="Washi Tape" 
        className="absolute top-1 left-20 w-28 h-auto object-contain transform -rotate-2 z-20 pointer-events-none opacity-90 drop-shadow-xs"
      />

      {/* Binder Clip top right */}
      <img 
        src="/assets/binder_clips.png" 
        alt="Binder Clip" 
        className="absolute top-1 right-4 w-12 h-auto object-contain transform rotate-6 z-30 pointer-events-none drop-shadow-md"
      />

      <div className="space-y-3 relative z-10 pt-1">
        
        {/* Header / Newspaper Clipping Section */}
        <div className="relative bg-[#fdfaf2] p-3 pt-4 shadow-md border border-stone-300/80 rounded-sm transform rotate-1">
          <img 
            src="/assets/paperclips.png" 
            alt="Paperclip" 
            className="absolute -top-2.5 left-4 w-8 h-auto object-contain transform -rotate-12 z-20 pointer-events-none drop-shadow-sm"
          />

          <div className="border-b border-stone-400/60 pb-0.5 mb-1 flex justify-between items-center text-[8px] font-mono text-stone-500 font-bold uppercase">
            <span>📰 Weekly Travel Vogue</span>
            <span>ESTD 2026 • ISSUE #89</span>
          </div>
          
          <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight uppercase font-mono tracking-tight">
            HOW TO LOOK CHIC WHILE WANDERING INDIA 🇮🇳
          </h3>
          
          <p className="text-[11px] text-stone-700 font-caveat mt-1 leading-snug">
            "Ditch heavy coats! Pack breathable linen, retro oversized glasses, a pastel silk scarf, and a brass-buckled camera bag."
          </p>

          <img 
            src="/assets/stamp_gateway.png" 
            alt="Gateway Stamp" 
            className="absolute -bottom-3 -right-2 w-12 h-auto object-contain transform rotate-12 z-20 opacity-90 drop-shadow-sm pointer-events-none"
          />
        </div>

        {/* POSTCARD & TRAVELER STICKER COLLAGE */}
        <div className="grid grid-cols-12 gap-2 items-center pt-1">
          
          {/* Traveler Sticker & Lotus Stamp */}
          <div className="col-span-5 relative group">
            <img 
              src="/assets/traveler_sticker.png" 
              alt="Traveler Sticker" 
              className="w-full h-auto max-h-44 object-contain transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 drop-shadow-lg"
            />
            <img 
              src="/assets/lotus_stamp.png" 
              alt="Lotus Stamp" 
              className="absolute -bottom-1 -left-1 w-10 h-auto object-contain transform rotate-6 z-20 drop-shadow-xs pointer-events-none"
            />
          </div>

          {/* Himalayas Postcard */}
          <div className="col-span-7 relative group">
            <div className="relative transform rotate-3 group-hover:rotate-1 group-hover:scale-105 transition-all duration-300">
              <img 
                src="/assets/himalayas_postcard.png" 
                alt="Himalayas Postcard" 
                className="w-full h-auto max-h-36 object-contain rounded-xs shadow-md border border-stone-200"
              />
              
              <img 
                src="/assets/washi_tape_teal.png" 
                alt="Teal Tape" 
                className="absolute -top-2.5 right-2 w-20 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90"
              />

              <img 
                src="/assets/stamp_mountains.png" 
                alt="Mountain Stamp" 
                className="absolute bottom-1.5 right-1.5 w-10 h-auto object-contain transform -rotate-6 z-20 pointer-events-none opacity-90"
              />
            </div>
          </div>

        </div>

        {/* Secondary Row: Vrindavan Postcard & Lined Paper Note */}
        <div className="grid grid-cols-12 gap-2 items-center">
          
          {/* Lined Paper Note Scrap */}
          <div className="col-span-6 relative">
            <div className="relative bg-[#fffdf5] p-2.5 shadow-md border border-stone-300/70 rounded-xs transform -rotate-2">
              <img 
                src="/assets/washi_tape_pink.png" 
                alt="Pink Washi Tape" 
                className="absolute -top-2 left-2 w-16 h-auto object-contain transform -rotate-6 z-20 pointer-events-none"
              />
              <p className="text-[11px] text-stone-800 font-caveat font-bold leading-tight pt-1">
                "Collect moments, not things. Chai at sunrise & postcards sent home." ☕
              </p>
            </div>
          </div>

          {/* Vrindavan Postcard */}
          <div className="col-span-6 relative group">
            <div className="transform rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
              <img 
                src="/assets/vrindavan_postcard.png" 
                alt="Vrindavan Postcard" 
                className="w-full h-auto max-h-32 object-contain rounded-xs shadow-md border border-stone-200"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Left Page Footer */}
      <div className="mt-1 flex items-end justify-between relative z-20">
        
        <DoodleSticker 
          id="jake"
          speechText="&quot;Let's explore, mathematical!&quot; 🐕"
          speechPosition="right"
          speechBubbleBg="bg-yellow-100"
          svgContent={
            <svg viewBox="0 0 100 100" className="w-10 h-10 filter drop-shadow-md transform hover:scale-110 hover:rotate-6 transition-transform">
              <path d="M 20,40 C 20,15 80,15 80,40 C 80,65 80,90 50,90 C 20,90 20,65 20,40 Z" fill="#FFC107" stroke="#2D2D2D" strokeWidth="3" />
              <path d="M 15,30 C 10,35 5,50 12,55 C 18,60 22,50 18,40" fill="#FFC107" stroke="#2D2D2D" strokeWidth="3" />
              <path d="M 85,30 C 90,35 95,50 88,55 C 82,60 78,50 82,40" fill="#FFC107" stroke="#2D2D2D" strokeWidth="3" />
              <circle cx="40" cy="40" r="14" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="3" />
              <circle cx="60" cy="40" r="14" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="3" />
              <circle cx="42" cy="40" r="7" fill="#2D2D2D" />
              <circle cx="58" cy="40" r="7" fill="#2D2D2D" />
              <path d="M 33,52 C 33,58 41,64 50,64 C 59,64 67,58 67,52 C 67,46 59,44 50,44 Z" fill="#FFD54F" stroke="#2D2D2D" strokeWidth="3" />
              <ellipse cx="50" cy="48" rx="7" ry="5" fill="#2D2D2D" />
            </svg>
          }
        />

        <img 
          src="/assets/camera.png" 
          alt="Vintage Camera" 
          className="w-12 h-auto object-contain transform -rotate-6 opacity-95 drop-shadow-md"
        />

        <div className="text-right text-[8px] text-stone-400 font-mono tracking-widest uppercase">
          🎨 ARTIST CORNER • NO. 1
        </div>

      </div>

    </div>
  );
}
