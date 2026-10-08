import React, { useState } from "react";
import { motion } from "motion/react";
import { X, MapPin, Image as ImageIcon, Sparkles, AlertCircle, UploadCloud } from "lucide-react";
import { Destination } from "../types";
import { api } from "../utils/api";
import { sanitizeCoordinate } from "../utils/coordinates";

interface NewDestinationModalProps {
  initialCoords: { lat: number; lng: number } | null;
  onClose: () => void;
  onSave: (newDest: Omit<Destination, "id" | "stickers">) => void;
}

// Curated stunning high-quality pastel travel background images
const PRESET_IMAGES = [
  {
    name: "Paris Sunset",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    color: "from-brand-100 to-brand-200"
  },
  {
    name: "Kyoto Temple",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    color: "from-orange-100 to-amber-200"
  },
  {
    name: "Venice Canal",
    url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
    color: "from-sky-100 to-blue-200"
  },
  {
    name: "Santorini Village",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    color: "from-cyan-100 to-sky-200"
  },
  {
    name: "Swiss Alp Cabin",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    color: "from-emerald-100 to-teal-200"
  },
  {
    name: "Bali Palm Beach",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    color: "from-purple-100 to-brand-200"
  }
];

export default function NewDestinationModal({
  initialCoords,
  onClose,
  onSave,
}: NewDestinationModalProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("India");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [coordLat, setCoordLat] = useState<number | string>(
    initialCoords ? sanitizeCoordinate(initialCoords.lat, false, 4) : 20.59
  );
  const [coordLng, setCoordLng] = useState<number | string>(
    initialCoords ? sanitizeCoordinate(initialCoords.lng, true, 4) : 78.96
  );
  
  // Choose photo
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle local photo upload (base64)
  const handlePhotoUpload = async (base64Str: string, filename: string) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const data = await api.post<{ success: boolean; url?: string; error?: string }>("/api/upload", { image: base64Str, filename });
      if (data.success && data.url) {
        setCustomImage(data.url);
        setImage(data.url);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.warn("Express upload failed, utilizing raw base64 string directly:", err);
      // Fallback: use raw base64
      setCustomImage(base64Str);
      setImage(base64Str);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handlePhotoUpload(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Oops! Drop an image file, please.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handlePhotoUpload(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) {
      alert("Please fill out the Destination Name and Country, dreamer!");
      return;
    }

    const parsedLat = sanitizeCoordinate(coordLat, false, 4);
    const parsedLng = sanitizeCoordinate(coordLng, true, 4);

    onSave({
      name: name.trim(),
      country: country.trim(),
      description: description.trim() || "A dreamy corner of the world waiting for our wandering steps.",
      notes: notes.trim() || "Plan to wander under pastel skies, take loads of snapshots, and collect postcards.",
      coordinates: { lat: parsedLat, lng: parsedLng },
      image: image,
      checklist: [
        { text: `Explore the alleys of ${name.trim()}`, checked: false },
        { text: "Take lots of polaroid snapshots", checked: false },
        { text: "Find a local bookstore or library", checked: false }
      ]
    });
  };

  return (
    <div id="new-destination-modal" className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      {/* Boarding pass container */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-2xl bg-[#fffefc] rounded-3xl shadow-2xl border-4 border-[#eae5d8] overflow-hidden relative flex flex-col md:flex-row"
      >
        {/* Left Side decorative pass accent */}
        <div className="bg-[#9a7b68] text-white p-6 md:w-48 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-dashed border-[#eae5d8] relative">
          <div>
            <div className="font-serif text-xl font-bold tracking-widest text-center border-b border-white/20 pb-2 mb-2">
              WANDERLUST
            </div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-center text-stone-200">
              BOARDING PASS
            </div>
          </div>

          {/* Dotted travel map mini sketch */}
          <div className="my-6 border-2 border-white/20 rounded-xl p-3 text-center bg-white/5">
            <div className="text-2xl animate-spin" style={{ animationDuration: "12s" }}>🗺️</div>
            <div className="font-serif text-xs italic text-stone-100 mt-2">Dream Ticket #0826</div>
          </div>

          <div className="text-[9px] font-mono text-center text-stone-200">
            "We travel not to escape life, but for life not to escape us."
          </div>

          {/* Responsive punched notches utilizing body background for high-fidelity illusion */}
          {/* Desktop view notches (vertical divider ends) */}
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[#faf8f5] border border-[#eae5d8] shadow-inner hidden md:block" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#faf8f5] border border-[#eae5d8] shadow-inner hidden md:block" />
          
          {/* Mobile view notches (horizontal divider ends) */}
          <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#faf8f5] border border-[#eae5d8] shadow-inner md:hidden" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#faf8f5] border border-[#eae5d8] shadow-inner md:hidden" />
        </div>

        {/* Right main entry Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-800 flex items-center gap-1.5">
                <span>🎫</span> Draft New Dream Ticket
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Amalfi Coast, Mt Fuji"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Italy, Japan"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                  Tagline / Cozy Vision Description
                </label>
                <input
                  type="text"
                  placeholder="E.g., Floating down canals, eating gelato under lemon trees..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              {/* Pin Coordinates math on representative map */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                    Map Pin Location (Lat/Lng)
                  </span>
                  {initialCoords ? (
                    <span className="text-[9px] text-brand-500 font-bold bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                      ★ Prefilled from map click!
                    </span>
                  ) : (
                    <span className="text-[9px] text-stone-400 italic">Adjust coordinates</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono text-stone-400 block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={coordLat}
                      onChange={(e) => setCoordLat(e.target.value)}
                      onBlur={() => setCoordLat(sanitizeCoordinate(coordLat, false, 4))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-stone-400 block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={coordLng}
                      onChange={(e) => setCoordLng(e.target.value)}
                      onBlur={() => setCoordLng(sanitizeCoordinate(coordLng, true, 4))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                  </div>
                </div>
              </div>

              {/* PHOTO SELECTION AREA */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-500 uppercase mb-2">
                  Scrapbook Photo Snap
                </label>

                {/* Preset Snap selections */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setImage(preset.url);
                        setCustomImage(null);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        image === preset.url && !customImage
                          ? "border-brand-500 ring-2 ring-brand-100 scale-105"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[7px] text-white text-center py-0.5 truncate select-none">
                        {preset.name.split(" ")[0]}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Local photo uploader zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors relative ${
                    isDragOver ? "border-brand-400 bg-brand-50/50" : "border-stone-300 hover:border-brand-300 bg-stone-50"
                  }`}
                >
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
                        <span className="text-[10px] text-stone-500 font-mono mt-2">Writing local image...</span>
                      </div>
                    ) : customImage ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded overflow-hidden border border-stone-200">
                          <img src={customImage} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-emerald-600 font-bold block">★ Custom Photo Attached</span>
                          <span className="text-[8px] text-stone-400 font-mono">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-500">
                        <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                        <span className="text-[10px] font-semibold text-stone-600">Drag & Drop real local photograph</span>
                        <span className="text-[8px] text-stone-400 mt-0.5">Or click to select file</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadError && (
                  <div className="text-xs text-brand-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket actions footer (Aligned and balanced h-10 height) */}
          <div className="mt-8 border-t border-stone-200 pt-5 flex justify-end gap-3 items-center">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 text-stone-500 hover:text-stone-700 font-serif text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-brand-400 hover:bg-brand-500 text-white font-serif font-bold text-xs rounded-full border border-brand-300 shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
            >
              <Sparkles className="w-3.5 h-3.5" /> Glue Into Scrapbook
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
