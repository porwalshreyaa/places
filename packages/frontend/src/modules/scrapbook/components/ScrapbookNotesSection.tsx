export interface ScrapbookNotesSectionProps {
  isEditable: boolean;
  isEditingNotes: boolean;
  setIsEditingNotes: (editing: boolean) => void;
  localNotes: string;
  setLocalNotes: (notes: string) => void;
  handleSaveNotes: () => void;
}

export default function ScrapbookNotesSection({
  isEditable,
  isEditingNotes,
  setIsEditingNotes,
  localNotes,
  setLocalNotes,
  handleSaveNotes,
}: ScrapbookNotesSectionProps) {
  return (
    <div className="relative bg-[#f0f9ff] p-5 pt-7 rounded-lg shadow-sm border border-blue-100/60 transform rotate-1">
      <div className="absolute -top-2.5 left-1/2 w-28 h-5.5 bg-blue-300/25 border-r border-l border-blue-200/20 rotate-[1deg] transform -translate-x-1/2 shadow-xs" />
      <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5 mb-3">
        <h4 className="font-serif text-[11px] font-extrabold text-blue-800 tracking-wider uppercase">
          NOTES TO SELF
        </h4>
        {isEditable && (
          <button
            onClick={() => (isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true))}
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
  );
}
