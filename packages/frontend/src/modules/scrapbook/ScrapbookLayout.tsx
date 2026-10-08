import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Compass, ImageIcon, Link as LinkIcon, LogOut, CheckCircle, Store, ArrowLeft
} from "lucide-react";
import RepresentativeMap from "../map/RepresentativeMap";
import ScrapbookList from "./ScrapbookList";
import DestinationDetail from "../../components/DestinationDetail";
import NewDestinationModal from "../../components/NewDestinationModal";
import ThemeStoreModal, { Theme } from "../../components/ThemeStoreModal";
import SharePreviewModal from "../../components/SharePreviewModal";
import { Destination, MapDrawing } from "../../types";
import { User } from "../../context/AuthContext";
import { injectThemeColors } from "../../utils/themeInjector";
import { toBlob } from "html-to-image";

interface ScrapbookLayoutProps {
  isEditable: boolean;
  username: string;
  destinations: Destination[];
  isLoading: boolean;
  notesToSelf: string;
  onUpdateNotesToSelf?: (notes: string) => void;
  onSaveDestinations?: (destinations: Destination[]) => void;
  isPublic?: boolean;
  onTogglePublic?: () => void;
  onLogout?: () => void;
  themeTitle: string;
  themeSubtitle: string;
  themeId?: string;
  themeColors?: Record<string, string>;
  mapDrawings: MapDrawing[];
  onUpdateTheme?: (title: string, subtitle: string, themeId: string) => void;
  onUpdateMapDrawings?: (drawings: MapDrawing[]) => void;
  currentUser?: User | null;
}

export default function ScrapbookLayout({
  isEditable,
  username,
  destinations,
  isLoading,
  notesToSelf,
  onUpdateNotesToSelf,
  onSaveDestinations,
  isPublic,
  onTogglePublic,
  onLogout,
  themeTitle,
  themeSubtitle,
  themeId,
  themeColors,
  mapDrawings,
  onUpdateTheme,
  onUpdateMapDrawings,
  currentUser
}: ScrapbookLayoutProps) {
  const navigate = useNavigate();
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  
  // Selection/Modal states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isThemeStoreOpen, setIsThemeStoreOpen] = useState(false);
  const [prefilledCoords, setPrefilledCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Sharing states
  const diaryRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

  // Editable "Notes to Self"
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(notesToSelf);
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [localTitle, setLocalTitle] = useState(themeTitle || 'Places');
  const [localSubtitle, setLocalSubtitle] = useState(themeSubtitle || 'My memories and adventures');
  const [localThemeId, setLocalThemeId] = useState(themeId || 'baby_girl');

  useEffect(() => {
    setLocalNotes(notesToSelf);
  }, [notesToSelf]);

  useEffect(() => {
    if (!isEditingTheme && themeColors) {
      injectThemeColors(themeColors);
    }
  }, [isEditingTheme, themeColors]);

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    if (onUpdateNotesToSelf && localNotes !== notesToSelf) {
      onUpdateNotesToSelf(localNotes);
    }
  };

  const handleSaveTheme = () => {
    setIsEditingTheme(false);
    if (onUpdateTheme && (localTitle !== themeTitle || localSubtitle !== themeSubtitle || localThemeId !== themeId)) {
      onUpdateTheme(localTitle, localSubtitle, localThemeId);
    }
  };

  const handleCancelThemeEdit = () => {
    setIsEditingTheme(false);
    setLocalTitle(themeTitle);
    setLocalSubtitle(themeSubtitle);
    setLocalThemeId(themeId || 'baby_girl');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSnapshotAndShare = async () => {
    if (!diaryRef.current) return;
    setIsCapturing(true);
    
    try {
      // Ensure web fonts are completely loaded before rasterizing snapshot
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        await document.fonts.ready;
      }
      
      // Small delay to ensure any UI states (like closing menus) have settled
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const node = diaryRef.current;
      const width = node.offsetWidth;
      const height = node.scrollHeight; // Use scrollHeight to capture everything
      
      const filter = (el: HTMLElement) => {
        return !el.classList?.contains('no-screenshot');
      };
      
      const blob = await toBlob(node, {
        backgroundColor: '#faf8f5',
        pixelRatio: 2,
        cacheBust: true,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          margin: '0'
        },
        filter: filter as unknown as (node: HTMLElement) => boolean
      });
      
      if (!blob) throw new Error('Could not generate image');
      
      const file = new File([blob], 'places.png', { type: 'image/png' });
      const shareUrl = `${window.location.origin}/share/${username}`;
      const shareData = {
        title: `${username}'s Places`,
        text: `Check out my Places map! 🌍✨`,
        url: shareUrl,
        files: [file]
      };
      
      // Try native Web Share API with files if supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        // Fallback: Show modal with generated image
        const imageUrl = URL.createObjectURL(blob);
        setShareImageUrl(imageUrl);
      }
    } catch (err: unknown) {
      console.error('Failed to share:', err);
      if (err instanceof Error) {
        alert('Could not capture the diary: ' + err.message);
      } else {
        alert('Could not capture the diary: ' + String(err));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Save a brand new pinned destination
  const handleSaveNew = (newFields: Omit<Destination, "id" | "stickers">) => {
    if (!onSaveDestinations) return;
    const newDest: Destination = {
      ...newFields,
      id: `dest-${Date.now()}`,
      stickers: [
        { id: `sparkle-init-${Date.now()}`, type: "sparkle", emoji: "✨", x: 25, y: 15, rotate: -10, scale: 1.1 }
      ]
    };
    
    const updatedList = [...destinations, newDest];
    onSaveDestinations(updatedList);
    setShowNewModal(false);
    setPrefilledCoords(null);
    setSelectedDestination(newDest);
  };

  // Update fields/stickers of an existing pinned item
  const handleUpdateDestination = (updatedDest: Destination) => {
    if (!onSaveDestinations) return;
    const updatedList = destinations.map((d) => (d.id === updatedDest.id ? updatedDest : d));
    
    if (selectedDestination?.id === updatedDest.id) {
      setSelectedDestination(updatedDest);
    }
    
    onSaveDestinations(updatedList);
  };

  // Tear a page (delete destination)
  const handleDeleteDestination = (id: string) => {
    if (!onSaveDestinations) return;
    const updatedList = destinations.filter((d) => d.id !== id);
    onSaveDestinations(updatedList);
    setSelectedDestination(null);
  };

  // Map click triggers adding a pin
  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (!isEditable) return;
    setPrefilledCoords(coords);
    setShowNewModal(true);
  };

  return (
    <div ref={diaryRef} className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif pb-16 relative overflow-hidden flex flex-col items-center">
      {/* Background aesthetics */}
      <div className="hidden sm:block absolute top-4 left-6 text-4xl select-none opacity-15 pointer-events-none rotate-12">☕</div>
      <div className="hidden sm:block absolute top-12 right-12 text-4xl select-none opacity-15 pointer-events-none -rotate-12">✈️</div>
      <div className="hidden sm:block absolute bottom-12 left-10 text-4xl select-none opacity-15 pointer-events-none rotate-45">🌻</div>
      <div className="hidden sm:block absolute bottom-20 right-8 text-4xl select-none opacity-15 pointer-events-none -rotate-6">🍦</div>

      <div className="absolute inset-0 bg-[radial-gradient(#e5e1d8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* ACTION BAR */}
        <div className="flex justify-between items-center mb-4 no-screenshot">
          {isEditable ? (
            <>
              <div className="flex gap-2">
                <button 
                  onClick={onTogglePublic}
                  className={`px-4 py-2 rounded-full font-sans font-bold text-xs border shadow-sm transition-all flex items-center gap-2 ${
                  isPublic 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isPublic ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`} />
                {isPublic ? "Public Profile On" : "Private Profile"}
              </button>
              
              <AnimatePresence>
                {isPublic && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-sans font-bold text-xs shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    {copiedLink ? <CheckCircle size={14} /> : <LinkIcon size={14} />}
                    {copiedLink ? "Link Copied!" : "Copy Share Link"}
                  </motion.button>
                )}
                
                {isPublic && (
                  <button 
                    onClick={handleSnapshotAndShare}
                    disabled={isCapturing}
                    className="px-4 py-2 rounded-full bg-brand-500 text-white border border-brand-600 font-sans font-bold text-xs shadow-sm hover:bg-brand-600 transition-all flex items-center gap-2"
                  >
                    {isCapturing ? "📸 Capturing..." : "📸 Snapshot & Share"}
                  </button>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-white text-brand-500 border border-brand-200 font-sans font-bold text-xs shadow-sm hover:bg-brand-50 transition-all flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
            </>
          ) : (
            <div className="w-full flex justify-between items-center gap-2">
              <div>
                {currentUser ? (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="px-4 py-2 rounded-full bg-white text-stone-700 border border-stone-200 font-sans font-bold text-xs shadow-sm hover:bg-stone-50 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back to My Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 rounded-full bg-white text-stone-700 border border-stone-200 font-sans font-bold text-xs shadow-sm hover:bg-stone-50 transition-all flex items-center gap-1.5"
                  >
                    Login / Create Diary
                  </button>
                )}
              </div>
              <button 
                onClick={handleSnapshotAndShare}
                disabled={isCapturing}
                className="px-5 py-2.5 rounded-full bg-brand-500 text-white font-sans font-bold text-sm shadow-md hover:bg-brand-600 transition-all flex items-center gap-2"
              >
                {isCapturing ? "📸 Capturing..." : "📸 Share This Diary"}
              </button>
            </div>
          )}
        </div>

        <div className="relative py-12 px-6 rounded-3xl bg-[#fffdf9] border border-[#e4dfd2] shadow-sm overflow-hidden text-center">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 rotate-1 w-[26rem] max-w-[90%] h-8 bg-brand-200/80 border border-brand-300/40 text-[11px] font-kalam font-bold text-brand-700 tracking-wider flex items-center justify-center shadow-sm px-4 whitespace-nowrap">
            🎀 {username}'s Places 🎀
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
            {isEditable && (
              <div className="absolute -top-4 right-0 z-10 flex gap-2 no-screenshot">
                {isEditingTheme ? (
                  <>
                    <button 
                      onClick={handleCancelThemeEdit}
                      className="text-[10px] font-mono text-stone-500 hover:text-stone-700 bg-stone-50 px-2 py-1 rounded border border-stone-200 shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveTheme}
                      className="text-[10px] font-mono text-brand-500 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded border border-brand-200 shadow-sm"
                    >
                      Save Theme
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditingTheme(true)}
                    className="text-[10px] font-mono text-brand-500 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded border border-brand-200 shadow-sm"
                  >
                    ✏️ Edit Theme
                  </button>
                )}
              </div>
            )}
            <h1 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight flex flex-col items-center justify-center gap-2 leading-snug">
              {isEditingTheme && isEditable ? (
                <>
                  <input 
                    value={localTitle} 
                    onChange={e => setLocalTitle(e.target.value)} 
                    className="text-center font-kalam font-bold tracking-wide bg-transparent border-b border-brand-300 focus:outline-none focus:border-brand-500 text-stone-900 w-full max-w-lg" 
                  />
                  <input 
                    value={localSubtitle} 
                    onChange={e => setLocalSubtitle(e.target.value)} 
                    className="text-center font-kalam text-brand-600 tracking-widest text-2xl sm:text-3xl font-extrabold mt-1 bg-transparent border-b border-brand-300 focus:outline-none focus:border-brand-500 w-full max-w-lg" 
                  />
                  <button
                    onClick={() => setIsThemeStoreOpen(true)}
                    className="mt-4 px-4 py-2 bg-white rounded-full border border-stone-200 text-stone-600 font-sans font-bold text-xs hover:border-brand-300 hover:text-brand-600 shadow-sm transition-all flex items-center gap-2 no-screenshot"
                  >
                    <Store size={14} /> Theme Store
                  </button>
                </>
              ) : (
                <>
                  <span className="text-stone-900 font-kalam font-bold tracking-wide whitespace-nowrap block">
                    {themeTitle}
                  </span>
                  <span className="font-kalam text-brand-600 tracking-widest text-2xl sm:text-3xl font-extrabold block mt-1">
                    {themeSubtitle}
                  </span>
                </>
              )}
            </h1>
            <div className="w-48 h-[1px] bg-stone-300 mx-auto my-4" />
            <p className="font-mono text-[10px] sm:text-xs text-stone-400 tracking-widest uppercase font-bold">
              PLACES • {new Date().getFullYear()} EDITION
            </p>
          </motion.div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fffdf9] p-3 rounded-full border border-stone-200/60 shadow-xs">
          <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest pl-2">view album:</span>
            <div className="bg-stone-100 p-1 rounded-full flex gap-1 border border-stone-200/50 w-full xs:w-auto">
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 xs:flex-none px-5 py-2 rounded-full font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === "map" ? "bg-stone-800 text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Compass className="w-4 h-4 text-brand-400" /> <span>Dreamer's Map</span>
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`flex-1 xs:flex-none px-5 py-2 rounded-full font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === "list" ? "bg-stone-800 text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-cyan-400" /> <span>Photo Journal</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="text-[11px] font-mono font-bold text-stone-600 bg-stone-100 border border-stone-200/80 px-4 py-2 rounded-full">
              🎯 Places to Visit: {destinations.length}
            </div>
            
            {isEditable && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPrefilledCoords(null);
                  setShowNewModal(true);
                }}
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-serif font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 border border-brand-400 transition-all cursor-pointer no-screenshot"
              >
                <span>🎫</span> Add Dream +
              </motion.button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-dashed border-brand-500 animate-spin mb-4" />
            <p className="text-sm font-mono text-stone-500 italic">Reading the vintage travel diaries...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "map" ? (
              <motion.div
                key="map-tab-spread"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT COLUMN */}
                  <div className="col-span-12 md:col-span-4 lg:col-span-2 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 lg:gap-8">
                    <div className="relative bg-[#fefcbf] p-6 pt-8 rounded-xs shadow-md border border-yellow-200 transform -rotate-1 hover:rotate-0 transition-transform duration-200">
                      <div className="absolute -top-3 left-1/2 w-32 h-6 bg-brand-400/30 border-r border-l border-brand-300/20 rotate-[-1deg] transform -translate-x-1/2 shadow-xs" />
                      <h3 className="font-serif text-lg font-extrabold text-stone-800 border-b border-yellow-300/80 pb-2 mb-4 tracking-tight">Dream List</h3>
                      {destinations.length === 0 ? (
                        <p className="text-xs text-stone-500 italic font-sans leading-relaxed">Empty.</p>
                      ) : (
                        <div className="space-y-3 font-serif">
                          {destinations.map((dest) => {
                            const isSelected = selectedDestination?.id === dest.id;
                            const isCompleted = dest.checklist.length > 0 && dest.checklist.every(t => t.checked);
                            return (
                              <div
                                key={dest.id}
                                onClick={() => setSelectedDestination(dest)}
                                className={`group flex items-start gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg transition-all ${
                                  isSelected ? "bg-brand-100/60 text-brand-700 font-bold" : "text-stone-700 hover:text-stone-900 hover:bg-yellow-100/50"
                                }`}
                              >
                                <span className={`text-xs mt-0.5 shrink-0 ${isCompleted ? "text-emerald-600 font-bold" : "text-stone-400"}`}>
                                  {isCompleted ? "●" : "○"}
                                </span>
                                <span className={`font-caveat text-base leading-tight select-none truncate ${isCompleted ? "line-through text-stone-400" : ""}`}>
                                  {dest.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CENTER MAP */}
                  <div className="col-span-12 md:col-span-8 lg:col-span-8 xl:col-span-8 space-y-4">
                    <RepresentativeMap
                      destinations={destinations}
                      onPinClick={(dest) => setSelectedDestination(dest)}
                      onMapClick={handleMapClick}
                      isEditable={isEditable}
                      mapDrawings={mapDrawings}
                      onUpdateMapDrawings={onUpdateMapDrawings}
                    />
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="col-span-12 lg:col-span-2 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8">
                    {/* NOTES TO SELF */}
                    <div className="relative bg-[#f0f9ff] p-5 pt-7 rounded-lg shadow-sm border border-blue-100/60 transform rotate-1">
                      <div className="absolute -top-2.5 left-1/2 w-28 h-5.5 bg-blue-300/25 border-r border-l border-blue-200/20 rotate-[1deg] transform -translate-x-1/2 shadow-xs" />
                      <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5 mb-3">
                        <h4 className="font-serif text-[11px] font-extrabold text-blue-800 tracking-wider uppercase">NOTES TO SELF</h4>
                        {isEditable && (
                          <button 
                            onClick={() => isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)}
                            className="text-[9px] font-mono text-blue-500 hover:text-blue-700 hover:underline"
                          >
                            {isEditingNotes ? "Done" : "✏️ Edit"}
                          </button>
                        )}
                      </div>

                      {isEditingNotes && isEditable ? (
                        <textarea
                          value={localNotes}
                          onChange={(e) => setLocalNotes(e.target.value)}
                          onBlur={handleSaveNotes}
                          className="w-full h-24 bg-transparent border-0 focus:ring-0 font-caveat text-lg leading-snug text-blue-900 focus:outline-none resize-none"
                          autoFocus
                        />
                      ) : (
                        <p className="font-caveat text-lg leading-snug text-blue-700/90 whitespace-pre-line">
                          {localNotes || "No notes yet..."}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ScrapbookList
                  destinations={destinations}
                  onSelect={(dest) => setSelectedDestination(dest)}
                  onAddNew={() => {
                    setPrefilledCoords(null);
                    setShowNewModal(true);
                  }}
                  isEditable={isEditable}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
            onUpdate={handleUpdateDestination}
            onDelete={handleDeleteDestination}
            isEditable={isEditable}
          />
        )}
      
      {isEditable && (
        <ThemeStoreModal 
          isOpen={isThemeStoreOpen}
          onClose={() => setIsThemeStoreOpen(false)}
          currentThemeId={localThemeId}
          onSelectTheme={(theme) => {
            setLocalThemeId(theme.id);
            injectThemeColors(theme.colors);
          }}
        />
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewModal && isEditable && (
          <NewDestinationModal
            initialCoords={prefilledCoords}
            onClose={() => {
              setShowNewModal(false);
              setPrefilledCoords(null);
            }}
            onSave={handleSaveNew}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {shareImageUrl && (
          <SharePreviewModal
            isOpen={!!shareImageUrl}
            onClose={() => setShareImageUrl(null)}
            imageUrl={shareImageUrl}
            shareUrl={`${window.location.origin}/share/${username}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
