import { Compass, ImageIcon } from "lucide-react";

export interface ScrapbookToolbarProps {
  activeTab: "map" | "list";
  setActiveTab: (tab: "map" | "list") => void;
  destinationsCount: number;
  isEditable: boolean;
  onOpenNewModal: () => void;
}

export default function ScrapbookToolbar({
  activeTab,
  setActiveTab,
  destinationsCount,
  isEditable,
  onOpenNewModal,
}: ScrapbookToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fffdf9] p-3 rounded-full border border-stone-200/60 shadow-xs">
      <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
        <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest pl-2">
          view album:
        </span>
        <div className="bg-stone-100 p-1 rounded-full flex gap-1 border border-stone-200/50 w-full xs:w-auto">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 xs:flex-none px-5 py-2 rounded-full font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === "map"
                ? "bg-stone-800 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Compass className="w-4 h-4 text-brand-400" /> <span>Dreamer's Map</span>
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 xs:flex-none px-5 py-2 rounded-full font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === "list"
                ? "bg-stone-800 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-brand-400" /> <span>Polaroid Grid</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/50">
          {destinationsCount} {destinationsCount === 1 ? "Memory" : "Memories"} Pinned
        </span>

        {isEditable && (
          <button
            onClick={onOpenNewModal}
            className="px-5 py-2 rounded-full bg-brand-500 text-white font-sans font-bold text-xs shadow-sm hover:bg-brand-600 transition-all flex items-center gap-1.5 no-screenshot"
          >
            ➕ Pin Destination
          </button>
        )}
      </div>
    </div>
  );
}
