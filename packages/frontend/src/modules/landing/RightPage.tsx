import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DoodleSticker } from '../../components/DoodleSticker';
import { useNavigate } from 'react-router-dom';

export function RightPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-3 sm:p-5 lg:p-6 relative flex flex-col justify-between z-10 overflow-hidden h-full max-h-full">
      
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />

      {/* Decorative Washi Tape on top right */}
      <img 
        src="/assets/washi_tape_pink.png" 
        alt="Pink Washi Tape" 
        className="absolute top-2 right-6 w-28 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90 drop-shadow-xs"
      />

      {/* Sparkles Set asset top left */}
      <img 
        src="/assets/sparkles_set.png" 
        alt="Sparkles" 
        className="absolute top-1 left-4 w-20 h-auto object-contain transform -rotate-3 z-10 pointer-events-none opacity-80"
      />

      {/* 1. HEADER SECTION */}
      <div className="relative z-10 pt-1">
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-stone-800 font-caveat leading-tight flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-rose-600 font-black relative inline-block transform -rotate-1">
            Voyage
            <span className="absolute left-0 bottom-1 w-full h-[3px] bg-amber-300/80 rounded-full pointer-events-none" />
          </span>
          <span className="text-stone-500 font-normal lowercase">to my</span>
          <span className="text-teal-600 font-black relative inline-block transform rotate-1">
            dreamland
            <span className="absolute left-0 bottom-1 w-full h-[3px] bg-rose-300/80 rounded-full pointer-events-none" />
          </span>
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse inline-block" />
        </h1>
      </div>

      {/* 2. PROMINENT & HIGH-VISIBILITY CTA BOARDING PASS (Front & Center!) */}
      <div className="my-2 relative z-30">
        <p className="text-xs text-stone-600 font-caveat font-bold mb-1 transform -rotate-1 block pl-1 flex items-center gap-1">
          <span>🎫 "Your passport to wandering is ready!"</span>
        </p>

        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          className="relative w-full max-w-sm p-0 bg-transparent border-0 cursor-pointer overflow-visible group block"
        >
          {/* Boarding Pass PNG Asset Frame */}
          <div className="relative">
            <img 
              src="/assets/boarding_pass.png" 
              alt="Boarding Pass Ticket" 
              className="w-full h-auto max-h-36 object-contain drop-shadow-2xl group-hover:drop-shadow-[0_15px_25px_rgba(244,63,94,0.35)] transition-all"
            />

            {/* HIGH-VISIBILITY POPPING CTA BUTTON OVERLAY */}
            <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg ring-2 ring-rose-300/60 flex items-center gap-2 font-serif font-black text-xs sm:text-sm tracking-wide transform group-hover:scale-108 transition-all duration-200">
              <span>START SCRAPBOOK</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* 3. FEATURED POSTCARD & STORY SCRAP (Scaled for 0-scroll viewport) */}
      <div className="grid grid-cols-12 gap-3 items-center relative z-10">
        
        {/* Story Paper Scrap */}
        <div className="col-span-6 relative">
          <div className="relative bg-[#fefcf7] p-3 shadow-md border border-stone-300/80 rounded-xs transform -rotate-1">
            <img 
              src="/assets/pink_wavy_tape.png" 
              alt="Wavy Tape" 
              className="absolute -top-2.5 left-2 w-20 h-auto object-contain transform -rotate-2 z-20 pointer-events-none opacity-90"
            />
            <span className="text-[9px] uppercase font-bold text-amber-600 font-mono tracking-widest flex items-center gap-1 pt-0.5">
              <span>📍 Scrapbook Atlas</span>
            </span>
            <p className="text-stone-700 text-[11px] leading-tight font-caveat mt-1 font-bold">
              Pasting ticket stubs from Varanasi, vintage stamps from Jaipur, and colorful flower petals from Vrindavan.
            </p>
          </div>
        </div>

        {/* Jaipur Postcard (Scaled compactly) */}
        <div className="col-span-6 relative group">
          <div className="relative transform rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
            <img 
              src="/assets/jaipur_postcard.png" 
              alt="Jaipur Postcard" 
              className="w-full h-auto max-h-36 object-contain rounded-xs shadow-md border border-stone-200"
            />
            <img 
              src="/assets/stamp_palm_triangle.png" 
              alt="Palm Stamp" 
              className="absolute -top-2 -left-2 w-10 h-auto object-contain transform -rotate-12 z-20 pointer-events-none"
            />
          </div>
        </div>

      </div>

      {/* 4. FOOTER & STICKERS */}
      <div className="mt-1 flex items-end justify-between relative z-20">
        <div className="flex gap-3 items-center">
          <DoodleSticker 
            id="spongebob"
            speechText="&quot;I'm ready to write down adventures!&quot; 🧽"
            speechPosition="right"
            speechBubbleBg="bg-yellow-50"
            svgContent={
              <svg viewBox="0 0 100 100" className="w-10 h-10 filter drop-shadow-md transform hover:scale-110 hover:rotate-6 transition-transform">
                <rect x="20" y="15" width="60" height="55" rx="4" fill="#FFF176" stroke="#2D2D2D" strokeWidth="3" />
                <circle cx="38" cy="34" r="10" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
                <circle cx="62" cy="34" r="10" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
                <circle cx="38" cy="34" r="3.5" fill="#29B6F6" />
                <circle cx="62" cy="34" r="3.5" fill="#29B6F6" />
                <path d="M 50,34 Q 53,38 50,42" fill="none" stroke="#2D2D2D" strokeWidth="2.5" />
                <path d="M 31,45 C 38,55 62,55 69,45" fill="none" stroke="#2D2D2D" strokeWidth="3" />
                <rect x="44" y="49" width="5" height="5" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2" />
                <rect x="51" y="49" width="5" height="5" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2" />
              </svg>
            }
          />

          <img 
            src="/assets/suitcase.png" 
            alt="Travel Suitcase" 
            className="w-12 h-auto object-contain transform rotate-6 drop-shadow-md"
          />
        </div>

        <div className="text-right text-[8px] text-stone-400 font-mono tracking-widest uppercase">
          ✨ HANDMADE COVERS • CHIC VOGUE
        </div>
      </div>

    </div>
  );
}
