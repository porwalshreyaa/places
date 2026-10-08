import { useState, useEffect } from "react";
import { injectThemeColors } from "../utils/themeInjector";

export interface UseThemeEditorProps {
  themeTitle: string;
  themeSubtitle: string;
  themeId?: string;
  themeColors?: Record<string, string>;
  onUpdateTheme?: (title: string, subtitle: string, themeId: string) => void;
}

export interface UseThemeEditorReturn {
  isEditingTheme: boolean;
  setIsEditingTheme: (editing: boolean) => void;
  localTitle: string;
  setLocalTitle: (title: string) => void;
  localSubtitle: string;
  setLocalSubtitle: (subtitle: string) => void;
  localThemeId: string;
  setLocalThemeId: (themeId: string) => void;
  handleSaveTheme: () => void;
  handleCancelThemeEdit: () => void;
}

export function useThemeEditor({
  themeTitle,
  themeSubtitle,
  themeId,
  themeColors,
  onUpdateTheme,
}: UseThemeEditorProps): UseThemeEditorReturn {
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [localTitle, setLocalTitle] = useState(themeTitle || "Places");
  const [localSubtitle, setLocalSubtitle] = useState(
    themeSubtitle || "My memories and adventures"
  );
  const [localThemeId, setLocalThemeId] = useState(themeId || "baby_girl");

  useEffect(() => {
    setLocalTitle(themeTitle || "Places");
    setLocalSubtitle(themeSubtitle || "My memories and adventures");
    setLocalThemeId(themeId || "baby_girl");
  }, [themeTitle, themeSubtitle, themeId]);

  useEffect(() => {
    if (!isEditingTheme && themeColors) {
      injectThemeColors(themeColors);
    }
  }, [isEditingTheme, themeColors]);

  const handleSaveTheme = () => {
    setIsEditingTheme(false);
    if (
      onUpdateTheme &&
      (localTitle !== themeTitle ||
        localSubtitle !== themeSubtitle ||
        localThemeId !== themeId)
    ) {
      onUpdateTheme(localTitle, localSubtitle, localThemeId);
    }
  };

  const handleCancelThemeEdit = () => {
    setIsEditingTheme(false);
    setLocalTitle(themeTitle);
    setLocalSubtitle(themeSubtitle);
    setLocalThemeId(themeId || "baby_girl");
  };

  return {
    isEditingTheme,
    setIsEditingTheme,
    localTitle,
    setLocalTitle,
    localSubtitle,
    setLocalSubtitle,
    localThemeId,
    setLocalThemeId,
    handleSaveTheme,
    handleCancelThemeEdit,
  };
}
