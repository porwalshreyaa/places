import { useState, useEffect } from "react";

export interface UseNotesEditorProps {
  notesToSelf: string;
  onUpdateNotesToSelf?: (notes: string) => void;
}

export interface UseNotesEditorReturn {
  isEditingNotes: boolean;
  setIsEditingNotes: (editing: boolean) => void;
  localNotes: string;
  setLocalNotes: (notes: string) => void;
  handleSaveNotes: () => void;
}

export function useNotesEditor({
  notesToSelf,
  onUpdateNotesToSelf,
}: UseNotesEditorProps): UseNotesEditorReturn {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(notesToSelf);

  useEffect(() => {
    setLocalNotes(notesToSelf);
  }, [notesToSelf]);

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    if (onUpdateNotesToSelf && localNotes !== notesToSelf) {
      onUpdateNotesToSelf(localNotes);
    }
  };

  return {
    isEditingNotes,
    setIsEditingNotes,
    localNotes,
    setLocalNotes,
    handleSaveNotes,
  };
}
