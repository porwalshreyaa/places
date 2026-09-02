import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import { DoodleSticker } from '../../components/DoodleSticker';
import { useNavigate } from 'react-router-dom';

const tornFashionCornerPath = "polygon(3% 15%, 28% 2%, 55% 8%, 82% 1%, 97% 9%, 95% 35%, 99% 65%, 94% 96%, 72% 92%, 48% 97%, 22% 91%, 2% 96%, 5% 68%, 1% 42%)";

export function RightPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 relative flex flex-col justify-between z-10 overflow-hidden min-h-[480px] lg:min-h-0">
      
      {/* Pattern scrap peeking from right edge */}
      <img 
        src="/images/seamless-geometric-shapes-paper-background_23-2148058172.avif" 
        alt="Geometric pattern scrap" 
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 object-cover transform rotate-12 z-0 opacity-40 drop-shadow-lg mix-blend-multiply rounded-full"
      />

      {/* Subtle graph paper overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />

      {/* Tape on right side */}
      <div className="absolute top-4 right-10 w-24 h-5.5 bg-rose-200/55 border border-rose-300/20 transform rotate-12 z-20" />

      {/* ELEGANT HAND-SIGNED VOYAGE TITLE */}
      <div className="space-y-4">
        
        <div className="relative pb-2">
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
            <span className="text-amber-500 text-xl select-none animate-pulse">✨</span>
          </h1>
        </div>

        {/* Cute subheadings & washi tape */}
        <div 
          className="bg-[#fdf3e7] p-4 shadow-md border-b-2 border-stone-300 transform -rotate-1 relative"
          style={{ clipPath: tornFashionCornerPath }}
        >
          <span className="text-[10px] uppercase font-bold text-amber-600 font-mono tracking-widest flex items-center gap-1">
            <span>📍 Scrapbook Atlas</span>
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          </span>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-caveat mt-1">
            Pasting ticket stubs from Varanasi, vintage stickers from Jaipur, and colorful flower petals from Vrindavan. Build your interactive, customized memory trail on a map.
          </p>
        </div>

        {/* Polaroid photo 2: Jaipur Hawa Mahal sketch/image */}
        <div className="absolute top-1/3 right-4 w-32 sm:w-36 bg-white p-2 pb-3.5 shadow-md border border-stone-200/80 transform rotate-6 z-10 hover:rotate-2 hover:scale-105 transition-all duration-300">
          <div className="aspect-[3/4] bg-stone-100 rounded-sm relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=300&q=80" 
              alt="Jaipur Palace" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-[9px] text-center font-mono font-bold uppercase tracking-widest text-amber-600 mt-1">JAIPUR PINK '26</p>
        </div>

      </div>

      {/* INTERACTIVE BOARDING PASS BOARDING TICKET CTA */}
      <div className="mt-8 relative z-20">
        
        <p className="text-xs text-stone-500 font-caveat mb-3.5 transform -rotate-1 block pl-1">
          🎫 "Let's pin our first destination!"
        </p>

        <motion.button 
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          className="relative bg-[#efece4] text-stone-800 border-2 border-stone-800 rounded-xl shadow-xl p-4 px-6 flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer text-left overflow-hidden w-full max-w-md"
        >
          {/* Left Ticket Punch Hole */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#faf8f4] border-2 border-stone-800 rounded-full z-10" />
          
          {/* Right Ticket Punch Hole */}
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#faf8f4] border-2 border-stone-800 rounded-full z-10" />
          
          {/* Perforation Line */}
          <div className="absolute left-[80px] top-0 bottom-0 border-r-2 border-dashed border-stone-800/30 z-10" />

          {/* Barcode side */}
          <div className="flex flex-col gap-0.5 shrink-0 pr-4 select-none z-0">
            <div className="flex items-center gap-[1.5px]">
              <div className="w-[1.5px] h-10 bg-stone-800"></div>
              <div className="w-[3px] h-10 bg-stone-800"></div>
              <div className="w-[1px] h-10 bg-stone-800"></div>
              <div className="w-[4px] h-10 bg-stone-800"></div>
              <div className="w-[1.5px] h-10 bg-stone-800"></div>
              <div className="w-[2.5px] h-10 bg-stone-800"></div>
              <div className="w-[1px] h-10 bg-stone-800"></div>
            </div>
            <span className="text-[7px] font-mono tracking-widest text-stone-500 text-center">IND-2026</span>
          </div>

          {/* Passenger content side */}
          <div className="flex-1 flex flex-col justify-between h-full pl-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] tracking-widest font-mono font-black text-rose-500">BOARDING TICKET</span>
              <Compass className="w-3.5 h-3.5 text-stone-700 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            
            <h4 className="text-base sm:text-lg font-black tracking-wide leading-none text-stone-900 uppercase flex items-center gap-1.5 mt-1.5">
              <span>START SCRAPBOOK</span>
              <ArrowRight className="w-4 h-4 text-rose-500 shrink-0" />
            </h4>
            
            <p className="text-[8px] text-stone-500 font-mono mt-1">
              SEAT: 12F • DESTINATION: INDIA ATLAS • TICKET NO. 9015
            </p>
          </div>

          {/* Faded Approved Badge */}
          <div className="absolute right-5 bottom-1.5 opacity-15 text-xl font-black select-none pointer-events-none transform -rotate-12 border-2 border-emerald-600 rounded-sm p-0.5 text-emerald-600 leading-none">
            PASSPORT OK
          </div>
        </motion.button>
      </div>

      {/* Right Page Cartoon Stickers & Footer */}
      <div className="mt-6 flex items-end justify-between relative z-20">
        
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

          <DoodleSticker 
            id="doraemon"
            speechText="&quot;Use the Anywhere Door!&quot; 🚪💙"
            speechPosition="left"
            speechBubbleBg="bg-blue-50"
            svgContent={
              <svg viewBox="0 0 100 100" className="w-13 h-13 filter drop-shadow-md transform hover:scale-110 hover:-rotate-6 transition-transform">
                <circle cx="50" cy="50" r="35" fill="#29B6F6" stroke="#2D2D2D" strokeWidth="3" />
                <circle cx="50" cy="53" r="28" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
                <ellipse cx="44" cy="28" rx="6" ry="8" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
                <ellipse cx="56" cy="28" rx="6" ry="8" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5" />
                <circle cx="44" cy="28" r="2.5" fill="#1D1D1D" />
                <circle cx="56" cy="28" r="2.5" fill="#1D1D1D" />
                <circle cx="50" cy="36" r="4.5" fill="#E53935" stroke="#2D2D2D" strokeWidth="2" />
                <path d="M 30,52 Q 50,68 70,52" fill="none" stroke="#2D2D2D" strokeWidth="2.5" />
              </svg>
            }
          />

        </div>

        <div className="text-right text-[9px] text-stone-400 font-mono tracking-widest uppercase">
          ✨ HANDMADE COVERS • CHIC VOGUE
        </div>

      </div>

    </div>
  );
}
