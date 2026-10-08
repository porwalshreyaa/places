import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Save, Trash2, Sparkles, Plus, Image as ImageIcon, Check, CheckSquare, Square,
  RotateCw, ArrowRight, RotateCcw, AlertCircle, HelpCircle, CornerDownRight, CheckCircle
} from "lucide-react";
import { Destination, ScrapSticker, ChecklistItem } from "../types";
import { formatCoordinatesDisplay } from "../utils/coordinates";


interface DestinationDetailProps {
  destination: Destination;
  onClose: () => void;
  onUpdate: (updated: Destination) => void;
  onDelete: (id: string) => void;
  isEditable: boolean;
}

// Built-in cute sticker designs
const STATIC_STICKERS = [
  { type: "heart", label: "❤️ Pink Heart", emoji: "❤️" },
  { type: "sparkle", label: "✨ Magic Sparkle", emoji: "✨" },
  { type: "star", label: "⭐ Yellow Star", emoji: "⭐" },
  { type: "camera", label: "📷 Vintage Cam", emoji: "📷" },
  { type: "airplane", label: "✈️ Paper Plane", emoji: "✈️" },
  { type: "luggage", label: "💼 Retro Case", emoji: "💼" },
  { type: "coffee", label: "☕ Cozy Mug", emoji: "☕" },
  { type: "cloud", label: "☁️ Fluffy Cloud", emoji: "☁️" },
  { type: "icecream", label: "🍦 Pastel Gelato", emoji: "🍦" },
  { type: "tape", label: "🎀 Washi Tape", emoji: "🎀" }
];

export default function DestinationDetail({
  destination,
  onClose,
  onUpdate,
  onDelete,
  isEditable,
}: DestinationDetailProps) {
  // State for modifications
  const [name, setName] = useState(destination.name);
  const [country, setCountry] = useState(destination.country);
  const [description, setDescription] = useState(destination.description);
  const [notes, setNotes] = useState(destination.notes);
  const [image, setImage] = useState(destination.image);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(destination.checklist);
  const [stickers, setStickers] = useState<ScrapSticker[]>(destination.stickers);

  // Drag and drop / local upload state
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Text inputs
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [customStickerEmoji, setCustomStickerEmoji] = useState("");
  const [customStickerText, setCustomStickerText] = useState("");

  // Dragging states
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const polaroidFrameRef = useRef<HTMLDivElement>(null);

  // Update parent when any local field changes so changes are instantly reflected on map previews!
  const triggerSave = (
    currentName = name,
    currentCountry = country,
    currentDesc = description,
    currentNotes = notes,
    currentImg = image,
    currentChecklist = checklist,
    currentStickers = stickers
  ) => {
    const updated: Destination = {
      ...destination,
      name: currentName,
      country: currentCountry,
      description: currentDesc,
      notes: currentNotes,
      image: currentImg,
      checklist: currentChecklist,
      stickers: currentStickers,
    };
    onUpdate(updated);
  };

  // Sticker Canvas Actions
  const handleAddSticker = (type: string, emoji?: string, label?: string) => {
    const newSticker: ScrapSticker = {
      id: `${type}-${Date.now()}`,
      type,
      emoji: emoji || STATIC_STICKERS.find(s => s.type === type)?.emoji,
      label,
      x: 35 + Math.random() * 30, // center areas
      y: 35 + Math.random() * 30,
      rotate: Math.floor(Math.random() * 40) - 20, // -20 to 20 deg
      scale: 1.0,
    };
    const newStickersList = [...stickers, newSticker];
    setStickers(newStickersList);
    triggerSave(name, country, description, notes, image, checklist, newStickersList);
  };

  const handleUpdateSticker = (id: string, updates: Partial<ScrapSticker>) => {
    const updatedList = stickers.map((s) => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });
    setStickers(updatedList);
    triggerSave(name, country, description, notes, image, checklist, updatedList);
  };

  const handleRemoveSticker = (id: string) => {
    const updatedList = stickers.filter((s) => s.id !== id);
    setStickers(updatedList);
    triggerSave(name, country, description, notes, image, checklist, updatedList);
  };

  // Drag sticker math
  const handleStickerMouseDown = (stickerId: string, e: React.MouseEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    setActiveStickerId(stickerId);
    const rect = polaroidFrameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = parseFloat((((moveEvent.clientX - rect.left) / rect.width) * 100).toFixed(1));
      const y = parseFloat((((moveEvent.clientY - rect.top) / rect.height) * 100).toFixed(1));
      
      // Keep bounding limits (0 to 100)
      const boundedX = Math.max(2, Math.min(92, x));
      const boundedY = Math.max(2, Math.min(92, y));

      const updatedList = stickers.map((s) => {
        if (s.id === stickerId) {
          return { ...s, x: boundedX, y: boundedY };
        }
        return s;
      });
      setStickers(updatedList);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      // Trigger update to database when drag ends
      triggerSave(name, country, description, notes, image, checklist, stickers);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Checklist Actions
  const handleToggleChecklist = (index: number) => {
    const updated = checklist.map((item, idx) => {
      if (idx === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setChecklist(updated);
    triggerSave(name, country, description, notes, image, updated);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = {
      text: newChecklistItem.trim(),
      checked: false,
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewChecklistItem("");
    triggerSave(name, country, description, notes, image, updated);
  };

  const handleRemoveChecklistItem = (index: number) => {
    const updated = checklist.filter((_, idx) => idx !== index);
    setChecklist(updated);
    triggerSave(name, country, description, notes, image, updated);
  };

  // File upload logic
  const uploadPhotoFile = async (base64Image: string, fileName: string) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          filename: fileName,
        }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        setImage(data.url);
        triggerSave(name, country, description, notes, data.url);
      } else {
        throw new Error(data.error || "File save failed.");
      }
    } catch (err) {
      console.error("Local upload failed, utilizing raw base64 as fallback:", err);
      // Fallback: Store raw base64 directly so the app still functions perfectly!
      setImage(base64Image);
      triggerSave(name, country, description, notes, base64Image);
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
        uploadPhotoFile(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Oops! Please drop a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        uploadPhotoFile(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };



  return (
    <div id="journal-view-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      {/* Closed journal layout that animates wide open */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 140 }}
        className="bg-[#faf6f0] w-full max-w-5xl rounded-3xl shadow-2xl border-12 border-[#9a7b68] flex flex-col md:flex-row overflow-hidden relative min-h-[85vh] md:min-h-0"
      >
        {/* Metal notebook spiral coils running down the center boundary on large screens */}
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-4 pointer-events-none hidden md:flex flex-col justify-around py-6 z-40">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-8 h-4 rounded-full border-2 border-stone-400 bg-gradient-to-r from-stone-300 via-stone-200 to-stone-400 shadow-md transform -translate-x-2" />
          ))}
        </div>

        {/* ----------------------------------------
            LEFT JOURNAL PAGE (Photo, Canvas, Title)
           ---------------------------------------- */}
        <div id="journal-left-page" className="flex-1 p-6 md:p-8 border-b-2 md:border-b-0 md:border-r border-stone-200 bg-white relative overflow-hidden flex flex-col justify-between">
          {/* Subtle line background for diary look */}
          <div className="absolute inset-0 bg-[linear-gradient(#f4f4f5_1px,transparent_1px)] bg-[size:100%_32px] opacity-20 pointer-events-none" />

          {/* Page Top Header controls */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {isEditable ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    triggerSave(e.target.value, country, description, notes, image, checklist);
                  }}
                  className="font-serif text-2xl font-bold text-stone-800 border-b border-transparent hover:border-dashed hover:border-stone-400 focus:border-brand-400 focus:outline-none bg-transparent w-full transition-all"
                  placeholder="Name of destination..."
                />
              ) : (
                <h2 className="font-serif text-2xl font-bold text-stone-800 leading-tight py-1">{name}</h2>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6 text-xs font-mono tracking-wider">
              <span className="text-stone-400 uppercase">Country:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    triggerSave(name, e.target.value, description, notes, image, checklist);
                  }}
                  className="bg-transparent border-b border-transparent hover:border-dashed hover:border-stone-400 focus:border-brand-400 focus:outline-none text-brand-500 font-bold uppercase py-0.5 focus:text-brand-600 transition-all"
                  placeholder="Country Name..."
                />
              ) : (
                <span className="text-brand-500 font-bold uppercase py-0.5">{country}</span>
              )}
            </div>

            {/* Polaroid Frame & Draggable Sticker Canvas */}
            <div 
              id="polaroid-canvas-area"
              ref={polaroidFrameRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative mx-auto aspect-square w-full max-w-[340px] bg-white p-4 pb-12 rounded-xs shadow-xl border border-stone-200/50 flex flex-col justify-between select-none ${
                isDraggingOver ? "ring-4 ring-dashed ring-brand-300 bg-brand-50/50" : ""
              }`}
            >
              {/* Cute tape placed at top left */}
              <div className="absolute -top-3.5 left-4 rotate-6 w-20 h-5 bg-teal-200/40 border border-teal-300/20 text-[8px] text-center font-mono text-teal-700">
                ⭐ PHOTO Snaps
              </div>

              {/* Photo Area with standard Referrer Policy */}
              <div className="relative flex-1 rounded bg-stone-100 overflow-hidden border border-stone-200 shadow-inner group/photo">
                {isUploading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100">
                    <div className="w-8 h-8 rounded-full border-4 border-brand-300 border-t-brand-500 animate-spin" />
                    <p className="text-[10px] font-mono text-stone-500 mt-2">Uploading local snap...</p>
                  </div>
                ) : (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* DRAGGABLE STICKERS RENDERED ON PHOTO */}
                {stickers.map((st) => (
                  <div
                    key={st.id}
                    onMouseDown={(e) => handleStickerMouseDown(st.id, e)}
                    style={{
                      left: `${st.x}%`,
                      top: `${st.y}%`,
                      transform: `translate(-50%, -50%) rotate(${st.rotate}deg) scale(${st.scale})`,
                      cursor: activeStickerId === st.id ? "grabbing" : "grab",
                    }}
                    className={`absolute select-none z-30 transition-shadow ${
                      activeStickerId === st.id ? "shadow-lg scale-110" : "hover:shadow-md"
                    }`}
                  >
                    {/* Render sticker by type */}
                    <div className="relative group/sticker bg-white/95 border-2 border-stone-300 rounded-full py-1 px-2 text-xs flex items-center gap-1 font-serif select-none select-none max-w-[130px] shadow-sm">
                      <span className="text-sm shrink-0">{st.emoji}</span>
                      {st.label && (
                        <span className="text-[8px] font-semibold text-stone-700 font-mono truncate leading-tight select-none">
                          {st.label}
                        </span>
                      )}

                      {/* Small Quick-Rotate or Delete triggers overlay */}
                      {isEditable && (
                        <div className="absolute -top-3.5 -right-3.5 scale-75 flex gap-1 bg-white border border-stone-200 rounded-full px-1 shadow-sm opacity-0 group-hover/sticker:opacity-100 transition-opacity z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateSticker(st.id, { rotate: st.rotate + 15 });
                            }}
                            className="p-0.5 hover:bg-stone-100 rounded text-stone-500"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSticker(st.id);
                            }}
                            className="p-0.5 hover:bg-brand-100 rounded text-brand-500"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Drop image invitation banner if none is dragged */}
                {isEditable && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer pointer-events-none group-hover/photo:pointer-events-auto">
                    <label className="flex flex-col items-center justify-center text-center p-4 cursor-pointer text-white">
                      <ImageIcon className="w-8 h-8 mb-1.5" />
                      <span className="text-xs font-semibold">Replace Photo snap</span>
                      <span className="text-[10px] opacity-75 mt-0.5 font-mono">Drop image file or Click here</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Hand-written Label below photo */}
              <div className="text-center mt-2.5">
                {isEditable ? (
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      triggerSave(name, country, e.target.value, notes, image, checklist);
                    }}
                    className="font-caveat text-xl font-bold italic text-stone-700 bg-transparent border-b border-stone-100 hover:border-dashed focus:border-brand-400 focus:outline-none w-full text-center transition-all"
                    placeholder="Describe your cozy dream..."
                  />
                ) : (
                  <p className="font-caveat text-xl font-bold italic text-stone-700 w-full text-center py-1">
                    "{description}"
                  </p>
                )}
              </div>

              {/* Grid outline lines on the frame background */}
              <div className="absolute bottom-1 right-3 text-[9px] font-mono text-stone-400 select-none">
                {formatCoordinatesDisplay(destination.coordinates?.lat, destination.coordinates?.lng, 4)}
              </div>
            </div>

            {uploadError && (
              <div className="text-xs text-brand-500 mt-2 flex items-center gap-1.5 justify-center font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Quick sticker box sheet */}
          {isEditable && (
            <div className="mt-6 border-t border-dashed border-stone-200 pt-4 bg-stone-50/50 p-3 rounded-2xl border border-stone-200">
              <h5 className="text-[11px] font-mono font-bold text-stone-600 mb-2 uppercase tracking-wide flex items-center justify-between">
                <span>🎨 Scrapbook Sticker Box</span>
                <span className="text-[9px] text-stone-400 font-normal">Click a sticker to paste on photo! Drag to re-position</span>
              </h5>
              
              {/* Inline Custom sticker addition (Unified alignment & heights) */}
              <div className="flex gap-1.5 mb-3 items-center">
                <input
                  type="text"
                  placeholder="Emoji (e.g. 🎒)"
                  maxLength={2}
                  value={customStickerEmoji}
                  onChange={(e) => setCustomStickerEmoji(e.target.value)}
                  className="w-12 h-9 text-center text-xs rounded-lg bg-white border border-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-brand-300"
                />
                <input
                  type="text"
                  placeholder="Sticker Label (e.g. Dream)"
                  value={customStickerText}
                  onChange={(e) => setCustomStickerText(e.target.value)}
                  className="flex-1 h-9 text-xs px-3 rounded-lg bg-white border border-stone-300 font-serif focus:outline-none focus:ring-1 focus:ring-brand-300"
                />
                <button
                  onClick={() => {
                    if (!customStickerEmoji) return;
                    handleAddSticker("custom", customStickerEmoji, customStickerText || undefined);
                    setCustomStickerEmoji("");
                    setCustomStickerText("");
                  }}
                  className="h-9 px-3.5 bg-stone-800 text-white rounded-lg text-xs font-serif flex items-center justify-center gap-1 hover:bg-stone-700 transition-colors cursor-pointer select-none"
                >
                  <Plus className="w-3.5 h-3.5" /> Cut
                </button>
              </div>

              {/* Built-in quick sticker buttons */}
              <div className="flex flex-wrap gap-1.5">
                {STATIC_STICKERS.map((st) => (
                  <button
                    key={st.type}
                    onClick={() => handleAddSticker(st.type, st.emoji, st.label.split(" ").slice(1).join(" "))}
                    className="bg-white border border-stone-200 text-stone-700 text-[10px] hover:border-brand-300 px-2 py-1 rounded-full flex items-center gap-1 shadow-xs transition-colors hover:bg-brand-50"
                  >
                    <span>{st.emoji}</span>
                    <span className="font-serif text-[9px] text-stone-600">{st.label.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ----------------------------------------
            RIGHT JOURNAL PAGE (Diary notes, Checklist, AI Genie)
           ---------------------------------------- */}
        <div id="journal-right-page" className="flex-1 p-6 md:p-8 bg-[#fffdfa] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(#f4f4f5_1px,transparent_1px)] bg-[size:100%_32px] opacity-20 pointer-events-none" />

          {/* Diary note content */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Lined Lined notepad area */}
            <div className="relative">
              <h4 className="font-serif text-base font-bold text-stone-800 mb-2 flex items-center gap-2">
                <span>📝</span> Cozy Diary Notes
              </h4>
              <div className="relative bg-[#fdfaf2] border border-[#f5eedc] rounded-2xl p-4 shadow-sm">
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    triggerSave(name, country, description, e.target.value, image, checklist);
                  }}
                  rows={4}
                  className="w-full text-xl text-stone-700 font-caveat leading-[28px] focus:outline-none bg-transparent resize-none border-none font-bold"
                  placeholder="Record food to eat, cafes to see, packing list thoughts, or cute travel moments here..."
                  readOnly={!isEditable}
                />
                {/* Lined sheet effect */}
                <div className="absolute inset-x-0 top-[28px] bottom-0 bg-[repeating-linear-gradient(transparent,transparent_27px,#eae5d8_27px,#eae5d8_28px)] pointer-events-none opacity-40" />
              </div>
            </div>

            {/* Bucket List Checklist Tracker */}
            <div>
              <h4 className="font-serif text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
                <span>🎯</span> Dream Bucket Checklist
              </h4>

              {/* Bucket checklist list */}
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-2 mb-3">
                {checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 bg-stone-50 hover:bg-stone-100/50 rounded-lg transition-colors border border-stone-200/40"
                  >
                    <button
                      onClick={isEditable ? () => handleToggleChecklist(index) : undefined}
                      className={`flex items-start gap-2.5 text-left text-sm ${isEditable ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {item.checked ? (
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded border-2 border-stone-300 hover:border-brand-300 shrink-0 mt-0.5 bg-white" />
                      )}
                      <span className={`text-stone-700 font-serif leading-tight ${item.checked ? "line-through text-stone-400" : ""}`}>
                        {item.text}
                      </span>
                    </button>
                    {isEditable && (
                      <button
                        onClick={() => handleRemoveChecklistItem(index)}
                        className="text-stone-400 hover:text-brand-500 p-1 rounded-full hover:bg-brand-50 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {checklist.length === 0 && (
                  <p className="text-xs text-stone-400 italic py-2 text-center">Your travel wishlist is currently clean and fresh! Add a secret target below.</p>
                )}
              </div>

              {/* Checklist Input box (Balanced and aligned h-10) */}
              {isEditable && (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="E.g., Try lavender ice cream..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                    className="flex-1 h-10 text-xs px-3.5 rounded-xl bg-stone-100 border border-stone-200 font-serif focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-300 transition-all"
                  />
                  <button
                    onClick={handleAddChecklistItem}
                    className="h-10 px-4 bg-[#9a7b68] text-white rounded-xl text-xs font-serif font-bold hover:bg-[#866957] transition-colors shrink-0 cursor-pointer select-none"
                  >
                    Pin Task
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Diary Page Footer Actions */}
          <div className="mt-8 border-t border-stone-200 pt-5 flex items-center justify-between gap-4">
            {isEditable ? (
              <button
                onClick={() => {
                  if (confirm(`Do you really want to tear this scrapbook page for "${name}" out of your diary?`)) {
                    onDelete(destination.id);
                  }
                }}
                className="px-4 py-2 hover:bg-brand-50 text-brand-500 hover:text-brand-600 rounded-xl text-xs font-serif font-semibold border border-transparent hover:border-brand-100 transition-all flex items-center gap-1.5 animate-fade-in"
              >
                <Trash2 className="w-4 h-4" /> Tear Page
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-800 text-white hover:bg-stone-700 rounded-xl text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              {isEditable ? <Save className="w-4 h-4" /> : <Check className="w-4 h-4" />} Close Journal
            </button>
          </div>
        </div>

        {/* Global absolute X closure button outside the pages */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 shadow-md border border-stone-200 hover:rotate-90 transition-transform duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
