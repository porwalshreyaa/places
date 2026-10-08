import React, { useState } from "react";
import { motion } from "motion/react";
import { X, MapPin, Search, Sparkles, Check } from "lucide-react";
import { Destination } from "../types";
import { sanitizeCoordinate } from "../utils/coordinates";

interface EditCoordinatesModalProps {
  destination: Destination;
  onClose: () => void;
  onSave: (updatedDest: Destination) => void;
}

export default function EditCoordinatesModal({
  destination,
  onClose,
  onSave,
}: EditCoordinatesModalProps) {
  const [coordLat, setCoordLat] = useState<number | string>(
    destination.coordinates?.lat ?? 20.59
  );
  const [coordLng, setCoordLng] = useState<number | string>(
    destination.coordinates?.lng ?? 78.96
  );
  const [searchQuery, setSearchQuery] = useState(destination.name || "");
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=5`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLat = sanitizeCoordinate(coordLat, false, 4);
    const cleanLng = sanitizeCoordinate(coordLng, true, 4);

    onSave({
      ...destination,
      coordinates: {
        lat: cleanLat,
        lng: cleanLng,
      },
    });
    onClose();
  };

  return (
    <div id="edit-coordinates-modal" className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-md bg-[#fffefc] rounded-3xl shadow-2xl border-4 border-[#eae5d8] overflow-hidden relative p-6 sm:p-7"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border border-brand-200">
              📍
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                Edit Map Coordinates
              </h3>
              <p className="text-xs text-stone-500 font-serif italic">
                {destination.name} • {destination.country}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* OpenStreetMap Real Location Search */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-600 uppercase mb-1">
              Search Real World Location
            </label>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="E.g., Dwarika, Gujarat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }
                  }}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>
              <button
                type="button"
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching}
                className="px-3.5 py-2.5 bg-brand-400 hover:bg-brand-500 text-white rounded-xl text-xs font-serif font-bold transition-colors shrink-0"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {/* Results dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-36 overflow-y-auto bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200/60 shadow-sm">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newLat = sanitizeCoordinate(parseFloat(res.lat), false, 4);
                      const newLng = sanitizeCoordinate(parseFloat(res.lon), true, 4);
                      setCoordLat(newLat);
                      setCoordLng(newLng);
                      setSearchResults([]);
                    }}
                    className="w-full text-left p-2 text-[11px] text-stone-700 hover:bg-brand-50 hover:text-brand-800 transition-colors block truncate font-serif"
                  >
                    📍 {res.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direct Lat/Lng Inputs */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
            <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-2">
              Exact Coordinates
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-mono text-stone-400 block mb-1">Latitude (-90 to +90)</label>
                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  required
                  value={coordLat}
                  onChange={(e) => setCoordLat(e.target.value)}
                  onBlur={() => setCoordLat(sanitizeCoordinate(coordLat, false, 4))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 font-mono focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-stone-400 block mb-1">Longitude (-180 to +180)</label>
                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  required
                  value={coordLng}
                  onChange={(e) => setCoordLng(e.target.value)}
                  onBlur={() => setCoordLng(sanitizeCoordinate(coordLng, true, 4))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 font-mono focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 font-serif text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-serif font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Check className="w-3.5 h-3.5" /> Save Pin Position
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
