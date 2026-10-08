import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import RepresentativeMap from "../map/RepresentativeMap";
import ScrapbookList from "./ScrapbookList";
import DestinationDetail from "../../components/DestinationDetail";
import NewDestinationModal from "../../components/NewDestinationModal";
import ThemeStoreModal, { Theme } from "../../components/ThemeStoreModal";
import SharePreviewModal from "../../components/SharePreviewModal";
import { Destination, MapDrawing } from "../../types";
import { User } from "../../context/AuthContext";

import { useShareSnapshot } from "../../hooks/useShareSnapshot";
import { useThemeEditor } from "../../hooks/useThemeEditor";
import { useNotesEditor } from "../../hooks/useNotesEditor";
import { useDestinationModals } from "../../hooks/useDestinationModals";

import ScrapbookHeader from "./components/ScrapbookHeader";
import ScrapbookToolbar from "./components/ScrapbookToolbar";
import ScrapbookNotesSection from "./components/ScrapbookNotesSection";

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
  currentUser,
}: ScrapbookLayoutProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");

  // Custom Hooks
  const {
    diaryRef,
    isCapturing,
    shareImageUrl,
    copiedLink,
    setShareImageUrl,
    handleSnapshotAndShare,
    handleCopyLink,
  } = useShareSnapshot(username);

  const {
    isEditingTheme,
    setIsEditingTheme,
    localTitle,
    setLocalTitle,
    localSubtitle,
    setLocalSubtitle,
    localThemeId,
    handleSaveTheme,
    handleCancelThemeEdit,
  } = useThemeEditor({
    themeTitle,
    themeSubtitle,
    themeId,
    themeColors,
    onUpdateTheme,
  });

  const {
    isEditingNotes,
    setIsEditingNotes,
    localNotes,
    setLocalNotes,
    handleSaveNotes,
  } = useNotesEditor({
    notesToSelf,
    onUpdateNotesToSelf,
  });

  const {
    selectedDestination,
    setSelectedDestination,
    showNewModal,
    setShowNewModal,
    isThemeStoreOpen,
    setIsThemeStoreOpen,
    prefilledCoords,
    setPrefilledCoords,
    handleOpenNewModalWithCoords,
  } = useDestinationModals();

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

  return (
    <div ref={diaryRef} className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif pb-16 relative overflow-hidden flex flex-col items-center">
      {/* Background aesthetics */}
      <div className="hidden sm:block absolute top-4 left-6 text-4xl select-none opacity-15 pointer-events-none rotate-12">☕</div>
      <div className="hidden sm:block absolute top-12 right-12 text-4xl select-none opacity-15 pointer-events-none -rotate-12">✈️</div>
      <div className="hidden sm:block absolute bottom-12 left-10 text-4xl select-none opacity-15 pointer-events-none rotate-45">🌻</div>
      <div className="hidden sm:block absolute bottom-20 right-8 text-4xl select-none opacity-15 pointer-events-none -rotate-6">🍦</div>

      <div className="absolute inset-0 bg-[radial-gradient(#e5e1d8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

      {/* HEADER */}
      <ScrapbookHeader
        isEditable={isEditable}
        username={username}
        isPublic={isPublic}
        onTogglePublic={onTogglePublic}
        copiedLink={copiedLink}
        handleCopyLink={handleCopyLink}
        handleSnapshotAndShare={handleSnapshotAndShare}
        isCapturing={isCapturing}
        onLogout={onLogout}
        currentUser={currentUser}
        isEditingTheme={isEditingTheme}
        setIsEditingTheme={setIsEditingTheme}
        handleSaveTheme={handleSaveTheme}
        handleCancelThemeEdit={handleCancelThemeEdit}
        localTitle={localTitle}
        setLocalTitle={setLocalTitle}
        localSubtitle={localSubtitle}
        setLocalSubtitle={setLocalSubtitle}
        themeTitle={themeTitle}
        themeSubtitle={themeSubtitle}
        setIsThemeStoreOpen={setIsThemeStoreOpen}
      />

      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 space-y-8">
        <ScrapbookToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          destinationsCount={destinations.length}
          isEditable={isEditable}
          onOpenNewModal={() => {
            setPrefilledCoords(null);
            setShowNewModal(true);
          }}
        />

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
                  
                  {/* LEFT COLUMN: DREAM LIST */}
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
                            return (
                              <button
                                key={dest.id}
                                onClick={() => setSelectedDestination(dest)}
                                className={`w-full text-left p-2 rounded-xs border transition-all text-xs flex items-center justify-between group ${
                                  isSelected
                                    ? "bg-brand-50 border-brand-300 font-bold text-brand-900 shadow-2xs"
                                    : "border-transparent hover:bg-yellow-100/60 text-stone-700"
                                }`}
                              >
                                <span className="truncate pr-2">{dest.name}</span>
                                <span className="text-[10px] text-stone-400 font-mono group-hover:text-brand-500">→</span>
                              </button>
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
                      onMapClick={(coords) => {
                        if (!isEditable) return;
                        handleOpenNewModalWithCoords(coords);
                      }}
                      isEditable={isEditable}
                      mapDrawings={mapDrawings}
                      onUpdateMapDrawings={onUpdateMapDrawings}
                    />
                  </div>

                  {/* RIGHT COLUMN: NOTES TO SELF */}
                  <div className="col-span-12 lg:col-span-2 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8">
                    <ScrapbookNotesSection
                      isEditable={isEditable}
                      isEditingNotes={isEditingNotes}
                      setIsEditingNotes={setIsEditingNotes}
                      localNotes={localNotes}
                      setLocalNotes={setLocalNotes}
                      handleSaveNotes={handleSaveNotes}
                    />
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
            onSelectTheme={(theme: Theme) => {
              if (onUpdateTheme) {
                onUpdateTheme(localTitle, localSubtitle, theme.id);
              }
            }}
          />
        )}

        {showNewModal && (
          <NewDestinationModal
            onClose={() => {
              setShowNewModal(false);
              setPrefilledCoords(null);
            }}
            onSave={handleSaveNew}
            initialCoords={prefilledCoords}
          />
        )}

        {shareImageUrl && (
          <SharePreviewModal
            isOpen={Boolean(shareImageUrl)}
            onClose={() => setShareImageUrl(null)}
            imageUrl={shareImageUrl}
            shareUrl={`${window.location.origin}/share/${username}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
