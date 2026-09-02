import React from 'react';
import { DoodleSticker } from '../../components/DoodleSticker';

const tornWideNewsPath = "polygon(1% 2%, 15% 1%, 32% 4%, 48% 1%, 64% 3%, 82% 1%, 99% 3%, 97% 24%, 100% 48%, 98% 70%, 99% 96%, 85% 94%, 68% 97%, 52% 93%, 35% 96%, 18% 93%, 2% 95%, 3% 72%, 1% 48%, 4% 24%)";
const paperTapePath = "polygon(3% 15%, 97% 5%, 95% 85%, 2% 95%)";

export function LeftPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-dashed border-stone-300 relative flex flex-col justify-between z-10 overflow-hidden min-h-[450px] lg:min-h-0">
      
      {/* Torn scrap peeking from left edge */}
      <img 
        src="/images/green-torn-graph-paper.png" 
        alt="Torn green graph paper" 
        className="absolute -left-16 top-1/4 w-48 object-cover transform -rotate-6 z-0 opacity-90 drop-shadow-md mix-blend-multiply"
      />

      {/* Subtle page background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#8d6e63_0.5px,transparent_0.5px)] [background-size:16px_16px] pointer-events-none opacity-40 z-0" />

      {/* Torn Tape on top */}
      <div 
        className="absolute top-2 left-6 w-36 h-6.5 bg-yellow-200/50 border border-yellow-300/30 text-[9px] font-mono flex items-center justify-center text-yellow-800/80 tracking-widest uppercase shadow-xs transform -rotate-2 z-10"
        style={{ clipPath: paperTapePath }}
      >
        📌 AIRMAIL • PRIORITAIRE
      </div>

      <div className="space-y-4 relative z-20">
        
        {/* Header / Newspaper Clipping Section */}
        <div 
          className="bg-[#f3edd5] p-4 shadow-md border border-stone-300/60 transform rotate-1"
          style={{ clipPath: tornWideNewsPath }}
        >
          {/* News Header */}
          <div className="border-b border-stone-400 pb-1 mb-2 flex justify-between items-center text-[9px] font-mono text-stone-500 font-bold uppercase">
            <span>📰 Weekly Travel Vogue</span>
            <span>ESTD 2026 • ISSUE #89</span>
          </div>
          
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight uppercase font-mono tracking-tight">
            HOW TO LOOK CHIC WHILE WANDERING INDIA 🇮🇳
          </h3>
          
          <p className="text-xs text-stone-600 font-caveat mt-1.5 leading-relaxed">
            "Ditch the heavy coats! Pack breathable linen, retro oversized tortoise-shell glasses, a pastel silk scarf, and a brass-buckled vintage camera bag. Comfort meets pure cinematic romance in Rajasthan's golden dunes."
          </p>
        </div>

        {/* FASHION TRAVEL MODEL ILLUSTRATION & PHOTO COLLAGE (Row) */}
        <div className="grid grid-cols-12 gap-3 items-center">
          
          {/* Custom High-Fidelity Vector Fashion Travel Model Illustration (Sketch) */}
          <div className="col-span-6 bg-white p-2 shadow-lg border border-stone-200/60 transform -rotate-3 hover:rotate-0 hover:scale-103 transition-all duration-300">
            <div className="aspect-[4/5] bg-[#fffcf5] border border-dashed border-stone-300 rounded-sm relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-1 border border-stone-200/40 rounded-xs pointer-events-none" />
              <svg viewBox="0 0 100 120" className="w-full h-full p-2" xmlns="http://www.w3.org/2000/svg">
                <path d="M 15 50 C 15 45, 30 35, 50 35 C 70 35, 85 45, 85 50 C 85 55, 75 58, 50 58 C 25 58, 15 55, 15 50 Z" fill="#ebcfa2" stroke="#4a3b32" strokeWidth="1.5" />
                <path d="M 35 48 C 35 30, 65 30, 65 48" fill="#d2b48c" stroke="#4a3b32" strokeWidth="1.5" />
                <path d="M 35 47 Q 50 49 65 47" fill="none" stroke="#e06c75" strokeWidth="3" />
                <path d="M 65 47 L 72 65 M 65 47 L 68 62" stroke="#e06c75" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 40 48 Q 50 42 60 48" fill="none" />
                <path d="M 43 55 Q 50 78 57 55" fill="#fdf2e9" stroke="#4a3b32" strokeWidth="1" />
                <path d="M 47 70 L 47 80 M 53 70 L 53 80" stroke="#4a3b32" strokeWidth="1" />
                <path d="M 41 59 C 41 57, 48 57, 49 59 C 50 61, 44 64, 41 59 Z" fill="#2d2d2d" stroke="#4a3b32" strokeWidth="1.5" />
                <path d="M 59 59 C 59 57, 52 57, 51 59 C 50 61, 56 64, 59 59 Z" fill="#2d2d2d" stroke="#4a3b32" strokeWidth="1.5" />
                <path d="M 49 59 L 51 59" stroke="#4a3b32" strokeWidth="1.5" />
                <path d="M 49 67 Q 50 68 51 67" stroke="#e06c75" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M 50 62 L 50 64" stroke="#4a3b32" strokeWidth="0.8" />
                <path d="M 39 48 Q 30 65 36 78 M 61 48 Q 70 65 64 78" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 38 78 Q 50 82 62 78 L 65 110 L 35 110 Z" fill="#f1d6d6" stroke="#4a3b32" strokeWidth="1.2" />
                <path d="M 35 78 C 42 84, 58 84, 65 78 L 70 95 C 65 92, 55 92, 48 95 Z" fill="#e5989b" stroke="#4a3b32" strokeWidth="1" />
                <path d="M 33 65 Q 40 98 48 98" fill="none" stroke="#4a3b32" strokeWidth="1" strokeDasharray="2,2" />
                <path d="M 42 92 H 58 V 104 H 42 Z" fill="#9e9e9e" stroke="#2d2d2d" strokeWidth="1" />
                <circle cx="50" cy="98" r="4" fill="#424242" stroke="#2d2d2d" strokeWidth="1" />
                <rect x="44" y="90" width="4" height="2" fill="#e06c75" />
              </svg>

              <div className="absolute bottom-1 right-2 text-[8px] uppercase tracking-wider font-mono bg-yellow-200/90 text-stone-700 px-1 py-0.5 rounded border border-yellow-300">
                👗 Travel Chic '26
              </div>
            </div>
          </div>

          {/* Polaroid Travel Memory: Vrindavan Holi celebration */}
          <div className="col-span-6 bg-white p-2 pb-4 shadow-lg border border-stone-200/80 transform rotate-3 hover:rotate-0 hover:scale-103 transition-all duration-300">
            <div className="aspect-square bg-stone-100 rounded-sm relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=400&q=80" 
                alt="Vrindavan Holi" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1 left-1 bg-amber-500 text-[8px] text-white px-1 py-0.5 rounded font-bold font-mono">
                COLOR RUSH
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-500">🌸 Vrindavan Fest</span>
              <p className="text-[9px] text-stone-500 font-caveat">"Tons of flower petals!"</p>
            </div>
          </div>

        </div>

      </div>

      {/* Left Page Cartoon Stickers & Doodles Footer */}
      <div className="mt-6 flex items-end justify-between relative z-20">
        
        <DoodleSticker 
          id="jake"
          speechText="&quot;Let's explore, mathematical!&quot; 🐕"
          speechPosition="right"
          speechBubbleBg="bg-yellow-100"
          svgContent={
            <svg viewBox="0 0 100 100" className="w-14 h-14 filter drop-shadow-md transform hover:scale-110 hover:rotate-6 transition-transform">
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

        <DoodleSticker 
          id="shinchan"
          speechText="&quot;I want to explore too, Action Mask! 🦸‍♂️&quot;"
          speechPosition="left"
          speechBubbleBg="bg-red-100"
          svgContent={
            <svg viewBox="0 0 100 100" className="w-14 h-14 filter drop-shadow-md transform hover:scale-110 hover:-rotate-6 transition-transform">
              <path d="M 30,25 C 55,10 85,25 80,45 C 77,55 70,62 55,62 C 48,62 45,67 40,65 C 30,62 15,55 18,42 Z" fill="#FADBD8" stroke="#2D2D2D" strokeWidth="3" />
              <path d="M 33,26 C 38,20 45,21 48,25" fill="none" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
              <path d="M 58,27 C 65,22 72,24 75,29" fill="none" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="43" cy="36" rx="6.5" ry="8" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
              <ellipse cx="66" cy="38" rx="6.5" ry="8" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
              <ellipse cx="45" cy="36" rx="3.5" ry="4.5" fill="#1A1A1A" />
              <ellipse cx="68" cy="38" rx="3.5" ry="4.5" fill="#1A1A1A" />
              <path d="M 52,48 C 55,52 60,48 58,45" fill="none" stroke="#2D2D2D" strokeWidth="2.5" />
              <circle cx="73" cy="48" r="4.5" fill="#F1948A" opacity="0.8" />
            </svg>
          }
        />

        <div className="text-right text-[10px] text-stone-400 font-mono tracking-widest uppercase">
          🎨 ARTIST CORNER • NO. 1
        </div>

      </div>

    </div>
  );
}
