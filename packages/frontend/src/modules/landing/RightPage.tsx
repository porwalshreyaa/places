import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { DoodleSticker } from '../../components/DoodleSticker';
import { useNavigate } from 'react-router-dom';

export function RightPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 relative flex flex-col justify-between z-10 overflow-hidden min-h-[520px] lg:min-h-0">
      
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />

      {/* Decorative Washi Tape on top right */}
      <img 
        src="/assets/washi_tape_pink.png" 
        alt="Pink Washi Tape" 
        className="absolute top-3 right-8 w-32 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90 drop-shadow-xs"
      />

      {/* Sparkles Set asset top left */}
      <img 
        src="/assets/sparkles_set.png" 
        alt="Sparkles" 
        className="absolute top-2 left-6 w-24 h-auto object-contain transform -rotate-3 z-10 pointer-events-none opacity-80"
      />

      {/* ELEGANT HAND-SIGNED VOYAGE TITLE & HERO SECTION */}
      <div className="space-y-4 relative z-10 pt-2">
        
        <div className="relative pb-1">
          <h1 className="text-3xl sm:text-4.5xl font-extrabold text-stone-800 font-caveat leading-tight flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-rose-600 font-black relative inline-block transform -rotate-1 hover:rotate-0 transition-transform">
              Voyage
              <span className="absolute left-0 bottom-1 w-full h-[4px] bg-amber-300/80 rounded-full pointer-events-none" />
            </span>
            <span className="text-stone-500 font-normal lowercase">to my</span>
            <span className="text-teal-600 font-black relative inline-block transform rotate-1 hover:rotate-0 transition-transform">
              dreamland
              <span className="absolute left-0 bottom-1 w-full h-[4px] bg-rose-300/80 rounded-full pointer-events-none" />
            </span>
          </h1>
        </div>

        {/* Cute subheadings & Paper Scrap Container */}
        <div className="relative bg-[#fefcf7] p-4 shadow-md border border-stone-300/80 rounded-xs transform -rotate-1">
          <img 
            src="/assets/pink_wavy_tape.png" 
            alt="Wavy Tape" 
            className="absolute -top-3 left-4 w-28 h-auto object-contain transform -rotate-2 z-20 pointer-events-none opacity-90"
          />
          <span className="text-[10px] uppercase font-bold text-amber-600 font-mono tracking-widest flex items-center gap-1.5 pt-1">
            <span>📍 Interactive Scrapbook Atlas</span>
          </span>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-caveat mt-1 font-bold">
            Pasting ticket stubs from Varanasi, vintage stamps from Jaipur, and colorful flower petals from Vrindavan. Build your interactive, customized memory trail on a map.
          </p>
          <img 
            src="/assets/stamp_waves.png" 
            alt="Waves Stamp" 
            className="absolute -bottom-3 -right-2 w-16 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-85"
          />
        </div>

        {/* Jaipur Postcard & Heart Note Showcase Row */}
        <div className="grid grid-cols-12 gap-3 items-center pt-2">
          
          {/* Jaipur Postcard */}
          <div className="col-span-7 relative group">
            <div className="relative transform rotate-3 group-hover:rotate-1 group-hover:scale-105 transition-all duration-300">
              <img 
                src="/assets/jaipur_postcard.png" 
                alt="Jaipur Postcard" 
                className="w-full h-auto object-contain rounded-xs shadow-md border border-stone-200"
              />
              <img 
                src="/assets/stamp_palm_triangle.png" 
                alt="Palm Stamp" 
                className="absolute -top-3 -left-3 w-14 h-auto object-contain transform -rotate-12 z-20 pointer-events-none"
              />
            </div>
          </div>

          {/* Heart Note & Lotus Flower */}
          <div className="col-span-5 relative flex flex-col items-center justify-center space-y-2">
            <img 
              src="/assets/heart_note.png" 
              alt="Heart Note" 
              className="w-20 h-auto object-contain transform -rotate-6 drop-shadow-sm hover:scale-110 transition-transform"
            />
            <img 
              src="/assets/lotus_flower.png" 
              alt="Lotus Flower" 
              className="w-16 h-auto object-contain transform rotate-12 drop-shadow-xs"
            />
          </div>

        </div>

      </div>

      {/* REAL BOARDING PASS TICKET AS INTERACTIVE CTA */}
      <div className="mt-4 relative z-20">
        
        <p className="text-xs text-stone-600 font-caveat font-bold mb-2 transform -rotate-1 block pl-1 flex items-center gap-1">
          <span>🎫 "Let's pin our first destination!"</span>
        </p>

        <motion.button 
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          className="relative w-full max-w-md p-0 bg-transparent border-0 cursor-pointer overflow-visible group"
        >
          {/* Boarding Pass PNG Asset Frame */}
          <div className="relative">
            <img 
              src="/assets/boarding_pass.png" 
              alt="Boarding Pass Ticket" 
              className="w-full h-auto object-contain drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
            />

            {/* Click CTA Overlay Button on Ticket */}
            <div className="absolute right-4 bottom-4 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 font-serif font-bold text-xs transform group-hover:scale-105 transition-all">
              <span>START SCRAPBOOK</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Right Page Cartoon Stickers & Souvenirs Footer */}
      <div className="mt-4 flex items-end justify-between relative z-20">
        
        <div className="flex gap-4 items-center">
          
          <DoodleSticker 
            id="spongebob"
            speechText="&quot;I'm ready to write down adventures!&quot; 🧽"
            speechPosition="right"
            speechBubbleBg="bg-yellow-50"
            svgContent={
              <svg viewBox="0 0 100 100" className="w-13 h-13 filter drop-shadow-md transform hover:scale-110 hover:rotate-6 transition-transform">
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
            className="w-16 h-auto object-contain transform rotate-6 drop-shadow-md"
          />

        </div>

        <div className="text-right text-[9px] text-stone-400 font-mono tracking-widest uppercase">
          ✨ HANDMADE COVERS • CHIC VOGUE
        </div>

      </div>

    </div>
  );
}
