import { useState } from "react";
import { motion } from "motion/react";
import { Pin, Calendar, MapPin, Heart, CheckSquare, Edit3 } from "lucide-react";
import { Destination } from "../../types";
import EditCoordinatesModal from "../../components/EditCoordinatesModal";

interface ScrapbookListProps {
  destinations: Destination[];
  onSelect: (destination: Destination) => void;
  onUpdateDestination?: (destination: Destination) => void;
  onAddNew: () => void;
  isEditable: boolean;
}

// Vibrant colors for the washi tape effects
const TAPE_COLORS = [
  "bg-brand-100/90 border-brand-300 text-brand-700 font-extrabold",
  "bg-amber-100/90 border-amber-300 text-amber-800 font-extrabold",
  "bg-teal-100/90 border-teal-300 text-teal-800 font-extrabold",
  "bg-purple-100/90 border-purple-300 text-purple-800 font-extrabold",
  "bg-cyan-100/90 border-cyan-300 text-cyan-800 font-extrabold",
];

// Aesthetic rotation offsets for each polaroid
const CARD_ROTATIONS = [-3, 2, -1, 3, -2, 4, -4];

export default function ScrapbookList({
  destinations,
  onSelect,
  onUpdateDestination,
  onAddNew,
  isEditable,
}: ScrapbookListProps) {
  const [editingCoordsDest, setEditingCoordsDest] = useState<Destination | null>(null);

  return (
    <div className="w-full">
      {/* Whimsical Board Header with a torn page look */}
      <div className="relative mb-8 p-6 bg-[#fffdf5] rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
        {/* Torn paper edge bottom effect using custom styled CSS */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[linear-gradient(45deg,transparent_25%,#f5eedc_25%,#f5eedc_50%,transparent_50%,transparent_75%,#f5eedc_75%)] bg-[length:12px_12px]" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-800 flex items-center gap-2">
              <span>📷</span> Wishlist Photo Journal
            </h3>
            <p className="font-sans text-sm text-stone-500 mt-1 italic">
              "A record of pastel skies, narrow alleys, and dreamy horizons."
            </p>
          </div>
          {isEditable && (
            <motion.button
              whileHover={{ scale: 1.03, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddNew}
              className="px-5 py-2.5 bg-brand-400 hover:bg-brand-500 text-white font-serif font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 border-2 border-white"
            >
              <span>✨</span> Write New Dream Ticket
            </motion.button>
          )}
        </div>
      </div>

      {destinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white/50 rounded-3xl border-4 border-dashed border-stone-200">
          <div className="text-5xl mb-4 animate-bounce">🎈</div>
          <h4 className="font-serif text-lg font-bold text-stone-700">No scrapbook snaps yet!</h4>
          <p className="text-sm text-stone-500 mt-2 max-w-sm">
            {isEditable 
              ? "Click on the magical interactive map or click the \"Write New Dream Ticket\" button to start pinning your beautiful wishlist!"
              : "Your travel album is currently empty. Open your diary in edit mode to begin pinning your future trips."}
          </p>
          {isEditable && (
            <button
              onClick={onAddNew}
              className="mt-6 px-5 py-2 bg-brand-400 text-white font-serif text-xs font-bold rounded-full border border-brand-300 shadow-sm"
            >
              Add Your First Dream Pin
            </button>
          )}
        </div>
      ) : (
        /* Polaroid grid arrangement */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
          {destinations.map((dest, index) => {
            const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
            const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
            
            // Calculate progress on checklist
            const totalTasks = dest.checklist.length;
            const completedTasks = dest.checklist.filter((t) => t.checked).length;
            const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <motion.div
                key={dest.id}
                whileHover={{ scale: 1.04, rotate: rotation + (rotation > 0 ? -2 : 2), zIndex: 10 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSelect(dest)}
                style={{ rotate: `${rotation}deg` }}
                className="bg-white p-4 pb-6 rounded-xs shadow-lg hover:shadow-2xl border border-stone-200/50 cursor-pointer flex flex-col justify-between transition-shadow relative group/card"
              >
                {/* Torn Washi tape at the top of Polaroid */}
                <div className={`absolute -top-3.5 left-1/2 transform -translate-x-1/2 rotate-${rotation > 0 ? "2" : "-2"} w-32 h-6 px-3 py-0.5 border text-[10px] text-center font-mono font-bold tracking-wider select-none ${tapeColor}`}>
                  📍 {dest.country.toUpperCase()}
                </div>

                {/* Polaroid content */}
                <div>
                  {/* Polaroid Photo Frame */}
                  <div className="relative aspect-[4/3] w-full rounded bg-stone-100 overflow-hidden mb-4 shadow-inner border border-stone-100 group/image">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-115"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating little sticker decoration if any exists on this card */}
                    {dest.stickers.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-white/95 rounded-full px-2 py-1 text-[10px] font-mono font-bold text-stone-700 shadow-sm flex items-center gap-1">
                        🎨 <span>{dest.stickers.length} Stickers</span>
                      </div>
                    )}

                    {/* Cute transparent grid pattern on photo for scrapbook feeling */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  </div>

                  {/* Polaroid text section */}
                  <div className="px-1 text-stone-800">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-serif text-lg font-bold tracking-tight leading-snug line-clamp-1 hover:text-brand-500 transition-colors">
                        {dest.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {isEditable && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCoordsDest(dest);
                            }}
                            className="p-1 rounded-full text-stone-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                            title="Edit map coordinates"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                      </div>
                    </div>

                    <p className="font-sans text-xs text-stone-500 line-clamp-3 italic leading-relaxed mb-4">
                      "{dest.description}"
                    </p>
                  </div>
                </div>

                {/* Bottom Stats & Checklists Progress */}
                <div className="border-t border-dashed border-stone-200 pt-3 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-2">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Bucket List Tracker</span>
                    </span>
                    <span>
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>

                  {/* Whimsical heart/circles progress bar */}
                  <div className="relative w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className="h-full bg-gradient-to-r from-brand-300 to-brand-400 transition-all duration-500 ease-out"
                    />
                  </div>
                </div>

                {/* Hand-drawn coffee cup circular stamp in background right corner */}
                <div className="absolute bottom-4 right-4 text-3xl opacity-10 pointer-events-none transform rotate-12 scale-150">
                  ✈️
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {editingCoordsDest && (
        <EditCoordinatesModal
          destination={editingCoordsDest}
          onClose={() => setEditingCoordsDest(null)}
          onSave={(updated) => {
            if (onUpdateDestination) {
              onUpdateDestination(updated);
            }
            setEditingCoordsDest(null);
          }}
        />
      )}
    </div>
  );
}
