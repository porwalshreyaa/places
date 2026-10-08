import React from 'react';
import { DoodleSticker } from '../../components/DoodleSticker';

export function LeftPage() {
  return (
    <div className="flex-1 h-full max-h-full p-3 sm:p-4 lg:p-5 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-stone-300 relative flex flex-col justify-between z-10 overflow-hidden">
      
      {/* Background paper texture & subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#8d6e63_0.6px,transparent_0.6px)] [background-size:16px_16px] pointer-events-none opacity-25 z-0" />

      {/* Decorative Washi Tape top left corner peeking */}
      <img 
        src="/assets/washi_tape_striped.png" 
        alt="Washi Tape" 
        className="absolute -top-1 left-8 w-32 sm:w-40 h-auto object-contain transform -rotate-3 z-20 pointer-events-none drop-shadow-xs"
      />

      {/* Binder Clip top right */}
      <img 
        src="/assets/binder_clips.png" 
        alt="Binder Clip" 
        className="absolute top-1 right-6 w-14 sm:w-16 h-auto object-contain transform rotate-6 z-30 pointer-events-none drop-shadow-xs"
      />

      {/* MAIN SCRAPBOOK PAGE CONTENT WRAPPER */}
      <div className="relative z-10 flex-1 flex flex-col justify-between py-1 gap-2">
        
        {/* Newspaper Clipping Header Section */}
        <div className="relative bg-[#fdfaf2] p-3 sm:p-3.5 pt-3.5 shadow-md border border-stone-300/90 rounded-xs transform -rotate-1 max-w-xl mx-auto w-full shrink-0">
          <img 
            src="/assets/paperclips.png" 
            alt="Paperclip" 
            className="absolute -top-3 left-6 w-8 sm:w-9 h-auto object-contain transform -rotate-12 z-20 pointer-events-none"
          />

          <div className="border-b border-stone-400/60 pb-1 mb-1 flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">📰 Weekly Travel Vogue</span>
            <span>ESTD 2026 • ISSUE #89</span>
          </div>
          
          <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-stone-900 leading-tight uppercase font-mono tracking-tight">
            HOW TO LOOK CHIC WHILE WANDERING INDIA 🇮🇳
          </h3>
          
          <p className="text-xs sm:text-sm text-stone-700 font-caveat mt-0.5 leading-snug font-medium">
            "Ditch heavy coats! Pack breathable linen, retro tortoise-shell glasses, and a vintage camera bag. Comfort meets pure romance in Rajasthan's golden dunes."
          </p>

          <img 
            src="/assets/stamp_gateway.png" 
            alt="Gateway Stamp" 
            className="absolute -bottom-3 -right-2 w-14 sm:w-16 h-auto object-contain transform rotate-12 z-20 opacity-90 pointer-events-none"
          />
        </div>

        {/* RICH SCRAPBOOK COLLAGE CONTAINER (Centered Vrindavan Postcard) */}
        <div className="relative flex-1 w-full my-1 flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-4 min-h-0">
          
          {/* Route Map Scrap (Tucked behind top-left collage) */}
          <img 
            src="/assets/route_map.png" 
            alt="Route Map Scrap" 
            className="absolute left-0 top-0 w-36 sm:w-44 lg:w-48 object-contain transform -rotate-6 z-0 opacity-50 pointer-events-none"
          />

          {/* 🌟 VRINDAVAN POSTCARD (CENTERED HERO PHOTO ON LEFT PAGE) */}
          <div className="relative z-20 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 shrink-0">
            <img 
              src="/assets/vrindavan_postcard.png" 
              alt="Vrindavan Postcard" 
              className="w-48 sm:w-56 lg:w-64 h-auto object-contain rounded-xs shadow-2xl border-2 border-white"
            />
            <img 
              src="/assets/washi_tape_pink.png" 
              alt="Pink Tape" 
              className="absolute -top-3.5 left-6 w-24 sm:w-28 h-auto object-contain transform -rotate-6 z-30 pointer-events-none opacity-90"
            />
            <img 
              src="/assets/elephant_stamp.png" 
              alt="Elephant Stamp" 
              className="absolute -bottom-3 -left-2 w-14 sm:w-16 h-auto object-contain transform -rotate-12 z-30 pointer-events-none"
            />
            <img 
              src="/assets/lotus_stamp.png" 
              alt="Lotus Stamp" 
              className="absolute top-2 -right-3 w-11 sm:w-13 h-auto object-contain transform rotate-12 z-30 pointer-events-none"
            />
          </div>

          {/* Himalayas Postcard (Layered alongside on the right) */}
          <div className="relative z-10 transform rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-300 shrink-0 translate-y-3 sm:translate-y-5">
            <img 
              src="/assets/himalayas_postcard.png" 
              alt="Himalayas Postcard" 
              className="w-38 sm:w-46 lg:w-52 h-auto object-contain rounded-xs shadow-xl border-2 border-white"
            />
            <img 
              src="/assets/washi_tape_teal.png" 
              alt="Teal Tape" 
              className="absolute -top-3 right-3 w-20 sm:w-24 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90"
            />
            <img 
              src="/assets/stamp_mountains.png" 
              alt="Mountain Stamp" 
              className="absolute -bottom-2 -right-2 w-12 sm:w-14 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90"
            />
          </div>

          {/* Traveler Character Sticker (Standing on bottom left) */}
          <div className="absolute left-0 sm:left-1 bottom-0 z-30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto">
            <img 
              src="/assets/traveler_sticker.png" 
              alt="Traveler Sticker" 
              className="w-32 sm:w-40 lg:w-44 h-auto object-contain filter drop-shadow-xl"
            />
          </div>

        </div>

        {/* Bottom Note & Souvenirs Row (Fills bottom area of Left Page) */}
        <div className="relative max-w-xl mx-auto w-full flex items-center justify-between gap-2 shrink-0">
          
          {/* Lined Paper Handwritten Quote */}
          <div className="flex-1 relative bg-[#fffdf5] p-2.5 sm:p-3 shadow-md border border-stone-300/80 rounded-xs transform -rotate-1">
            <img 
              src="/assets/washi_tape_floral.png" 
              alt="Floral Washi Tape" 
              className="absolute -top-2.5 left-6 w-24 sm:w-28 h-auto object-contain transform -rotate-3 z-20 pointer-events-none"
            />
            <p className="text-xs sm:text-sm text-stone-800 font-caveat font-bold leading-relaxed pt-1 pr-6">
              "Collect moments, not things. Chai at sunrise, train rides across green hills, and postcards sent home." ☕
            </p>
            <img 
              src="/assets/chai_cup.png" 
              alt="Chai Cup" 
              className="absolute -bottom-2 -right-1 w-11 sm:w-13 h-auto object-contain transform rotate-12 drop-shadow-xs"
            />
          </div>

          {/* Vintage Camera Souvenir */}
          <img 
            src="/assets/camera.png" 
            alt="Vintage Camera" 
            className="w-16 sm:w-20 lg:w-22 h-auto object-contain transform -rotate-8 opacity-95 drop-shadow-md shrink-0"
          />

        </div>

      </div>

      {/* Left Page Footer & Cartoon Sticker */}
      <div className="flex items-end justify-between relative z-20 pt-1 shrink-0">
        <DoodleSticker 
          id="jake"
          speechText="&quot;Let's explore, mathematical!&quot; 🐕"
          speechPosition="right"
          speechBubbleBg="bg-yellow-100"
          svgContent={
            <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-xs transform hover:scale-110 hover:rotate-6 transition-transform">
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

        <div className="text-right text-[10px] text-stone-400 font-mono tracking-widest uppercase font-bold">
          🎨 ARTIST CORNER • NO. 1
        </div>
      </div>

    </div>
  );
}

