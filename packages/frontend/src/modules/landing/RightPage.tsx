import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DoodleSticker } from '../../components/DoodleSticker';
import { useNavigate } from 'react-router-dom';

export function RightPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 h-full max-h-full p-3 sm:p-4 lg:p-5 relative flex flex-col justify-between z-10 overflow-hidden">
      
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />

      {/* Decorative Washi Tape on top right */}
      <img 
        src="/assets/washi_tape_pink.png" 
        alt="Pink Washi Tape" 
        className="absolute top-1 right-8 w-32 sm:w-40 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-90 drop-shadow-xs"
      />

      {/* Sparkles Set asset top left */}
      <img 
        src="/assets/sparkles_set.png" 
        alt="Sparkles" 
        className="absolute top-1 left-4 w-28 sm:w-32 h-auto object-contain transform -rotate-3 z-10 pointer-events-none opacity-80"
      />

      {/* MAIN SCRAPBOOK PAGE CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col justify-between py-1 gap-2">
        
        {/* 🌟 PROMINENT HERO BOARDING PASS CTA BUTTON */}
        <div className="shrink-0 max-w-xl mx-auto w-full pt-1">
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full relative cursor-pointer group"
          >
            {/* Boarding Pass PNG Asset */}
            <div className="relative shadow-xl group-hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <img 
                src="/assets/boarding_pass.png" 
                alt="Boarding Pass Ticket" 
                className="w-full h-auto object-contain"
              />
              
              {/* High-visibility Action Callout Button overlaid on Boarding Pass */}
              <div className="absolute right-3 bottom-2.5 sm:right-4 sm:bottom-3 bg-rose-600 group-hover:bg-rose-700 text-white font-serif font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg flex items-center gap-2 transform group-hover:scale-105 transition-all">
                <span>START SCRAPBOOK</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Glowing ticket badge top left */}
              <div className="absolute top-2 left-4 bg-amber-500 text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-xs uppercase">
                ★ Click to Board
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sub-description Paper Scrap */}
        <div className="relative bg-[#fefcf7] p-2.5 sm:p-3 shadow-md border border-stone-300/80 rounded-xs transform -rotate-1 max-w-xl mx-auto w-full shrink-0">
          <img 
            src="/assets/pink_wavy_tape.png" 
            alt="Wavy Tape" 
            className="absolute -top-3 left-4 w-24 sm:w-28 h-auto object-contain transform -rotate-2 z-20 pointer-events-none opacity-90"
          />
          <span className="text-[10px] uppercase font-bold text-amber-600 font-mono tracking-widest flex items-center gap-1.5 pt-0.5">
            <span>📍 Interactive Scrapbook Atlas</span>
          </span>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-caveat mt-0.5 font-bold">
            Pasting ticket stubs from Varanasi, vintage stamps from Jaipur, and colorful flower petals from Vrindavan on your custom map.
          </p>
          <img 
            src="/assets/stamp_waves.png" 
            alt="Waves Stamp" 
            className="absolute -bottom-3 -right-2 w-12 sm:w-14 h-auto object-contain transform rotate-6 z-20 pointer-events-none opacity-85"
          />
        </div>

        {/* RICH LAYERED SOUVENIR COLLAGE (JAIPUR POSTCARD & ACCESSORIES) */}
        <div className="relative flex-1 w-full my-1 flex items-center justify-between px-2 sm:px-4 min-h-0">
          
          {/* Jaipur Postcard (Shifted further right) */}
          <div className="relative z-10 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 shrink-0 translate-x-6 sm:translate-x-12">
            <img 
              src="/assets/jaipur_postcard.png" 
              alt="Jaipur Postcard" 
              className="w-52 sm:w-60 lg:w-72 h-auto object-contain rounded-xs shadow-2xl border-2 border-white"
            />
            <img 
              src="/assets/washi_tape_teal.png" 
              alt="Teal Washi Tape" 
              className="absolute -top-3 left-8 w-24 sm:w-30 h-auto object-contain transform -rotate-6 z-20 pointer-events-none opacity-90"
            />
            <img 
              src="/assets/stamp_palm_triangle.png" 
              alt="Palm Stamp" 
              className="absolute -top-3 -left-3 w-13 sm:w-15 h-auto object-contain transform -rotate-12 z-20 pointer-events-none"
            />
            <img 
              src="/assets/travel_ticket_stamp.png" 
              alt="Travel Ticket Stamp" 
              className="absolute -bottom-3 -right-2 w-15 sm:w-18 h-auto object-contain transform rotate-12 z-20 pointer-events-none opacity-90"
            />
          </div>

          {/* 🌟 "JAIPUR STOLE MY HEART" NOTE (SHIFTED A BIT RIGHT) */}
          <div className="relative z-30 transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 shrink-0 translate-x-4 sm:translate-x-8">
            <div className="relative bg-[#fff0f3] px-3 py-2.5 rounded-xs border border-rose-300/80 shadow-xl max-w-[150px] sm:max-w-[170px] text-center">
              <img 
                src="/assets/washi_tape_pink.png" 
                alt="Pink Tape" 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-auto object-contain transform rotate-2 z-40 pointer-events-none"
              />
              <img 
                src="/assets/paperclips.png" 
                alt="Paperclip" 
                className="absolute -top-2.5 -right-2 w-6 sm:w-7 h-auto object-contain transform rotate-12 z-40 pointer-events-none"
              />
              <p className="text-xs sm:text-sm font-caveat font-extrabold text-rose-800 leading-snug pt-1">
                "Jaipur's Pink City stole my heart!" 💕
              </p>
            </div>
          </div>

          {/* Right Side Accessories Cluster (Heart Note + Flowers + Suitcase) */}
          <div className="relative z-20 flex flex-col items-center justify-center space-y-3 shrink-0">
            
            <div className="flex items-center gap-2">
              <img 
                src="/assets/heart_note.png" 
                alt="Heart Note" 
                className="w-14 sm:w-18 h-auto object-contain transform -rotate-6 drop-shadow-md hover:scale-110 transition-transform"
              />
              <img 
                src="/assets/lotus_flower.png" 
                alt="Lotus Flower" 
                className="w-12 sm:w-16 h-auto object-contain transform rotate-12 drop-shadow-xs"
              />
            </div>

            {/* Travel Suitcase Souvenir */}
            <div className="transform rotate-6 hover:scale-105 transition-transform shrink-0">
              <img 
                src="/assets/suitcase.png" 
                alt="Travel Suitcase" 
                className="w-22 sm:w-26 lg:w-30 h-auto object-contain filter drop-shadow-lg"
              />
            </div>

          </div>

        </div>

      </div>

      {/* Right Page Cartoon Sticker, Bottom Right Title & Footer */}
      <div className="flex items-end justify-between relative z-20 pt-1 shrink-0">
        
        {/* Spongebob Cartoon Sticker on Bottom Left */}
        <div className="flex gap-4 items-center">
          <DoodleSticker 
            id="spongebob"
            speechText="&quot;I'm ready to write down adventures!&quot; 🧽"
            speechPosition="right"
            speechBubbleBg="bg-yellow-50"
            svgContent={
              <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-xs transform hover:scale-110 hover:rotate-6 transition-transform">
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
        </div>

        {/* 🌸 ABSOLUTE BOTTOM RIGHT TITLE HEADER ("Voyage to my dreamland") */}
        <div className="flex flex-col items-end pr-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-800 font-caveat leading-tight flex items-center gap-x-2">
            <span className="text-rose-600 font-black relative inline-block transform -rotate-2 hover:rotate-0 transition-transform">
              Voyage
              <span className="absolute left-0 bottom-0.5 w-full h-[3px] bg-amber-300/80 rounded-full pointer-events-none" />
            </span>
            <span className="text-stone-500 font-normal lowercase text-xl">to my</span>
            <span className="text-teal-600 font-black relative inline-block transform rotate-1 hover:rotate-0 transition-transform">
              dreamland
              <span className="absolute left-0 bottom-0.5 w-full h-[3px] bg-rose-300/80 rounded-full pointer-events-none" />
            </span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse inline-block" />
          </h1>
          <div className="text-[10px] text-stone-400 font-mono tracking-widest uppercase font-bold mt-0.5">
            ✨ HANDMADE COVERS • CHIC VOGUE
          </div>
        </div>

      </div>

    </div>
  );
}


