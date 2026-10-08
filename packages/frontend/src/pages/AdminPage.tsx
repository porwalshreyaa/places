import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ScrapbookLayout from '../modules/scrapbook/ScrapbookLayout';
import { Destination, MapDrawing, Theme } from '../types';
import { injectThemeColors, resetThemeColors } from '../utils/themeInjector';
import { api } from '../utils/api';

export default function AdminPage() {
  const { user, token, logout, updateUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.theme?.colors) {
      injectThemeColors(user.theme.colors);
    } else {
      resetThemeColors();
    }
  }, [user?.theme]);

  useEffect(() => {
    if (token) {
      fetchDestinations();
    }
  }, [token]);

  const fetchDestinations = async () => {
    try {
      const data = await api.get<Destination[]>("/api/destinations");
      if (Array.isArray(data)) {
        setDestinations(data);
      }
    } catch (error) {
      console.error("Failed to load wishlist destinations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDestinations = async (updatedList: Destination[]) => {
    const previousList = destinations;
    setDestinations(updatedList);
    try {
      await api.post("/api/destinations", updatedList);
    } catch (error) {
      console.error("Failed to persist wishlist destinations:", error);
      setDestinations(previousList);
      alert("⚠️ Failed to save destinations to server! Changes have been reverted.");
    }
  };

  const handleUpdateNotes = async (notes: string) => {
    const previousNotes = user?.notes_to_self || "";
    updateUser({ notes_to_self: notes });
    try {
      await api.put("/api/user-settings", { notes_to_self: notes });
    } catch (error) {
      console.error("Failed to persist notes:", error);
      updateUser({ notes_to_self: previousNotes });
      alert("⚠️ Failed to save notes to server! Changes have been reverted.");
    }
  };

  const handleUpdateTheme = async (title: string, subtitle: string, theme_id?: string) => {
    const previousState = {
      theme_title: user?.theme_title,
      theme_subtitle: user?.theme_subtitle,
      theme_id: user?.theme_id
    };
    const updates: Record<string, string> = { theme_title: title, theme_subtitle: subtitle };
    if (theme_id) updates.theme_id = theme_id;
    
    updateUser(updates);
    try {
      const data = await api.put<{ theme?: Theme }>("/api/user-settings", updates);
      if (data.theme) {
        updateUser({ theme: data.theme });
      }
    } catch (error) {
      console.error("Failed to persist theme:", error);
      updateUser(previousState);
      alert("⚠️ Failed to save theme settings to server! Changes have been reverted.");
    }
  };

  const handleUpdateMapDrawings = async (drawings: MapDrawing[]) => {
    const previousDrawings = user?.map_drawings || [];
    updateUser({ map_drawings: drawings });
    try {
      await api.put("/api/user-settings", { map_drawings: drawings });
    } catch (error) {
      console.error("Failed to persist map drawings:", error);
      updateUser({ map_drawings: previousDrawings });
      alert("⚠️ Failed to save map drawings to server! Changes have been reverted.");
    }
  };

  const handleTogglePublic = async () => {
    const previousValue = user?.is_public;
    const newValue = !previousValue;
    updateUser({ is_public: newValue });
    try {
      await api.put("/api/user-settings", { is_public: newValue });
    } catch (error) {
      console.error("Failed to persist public setting:", error);
      updateUser({ is_public: previousValue });
      alert("⚠️ Failed to save privacy settings to server! Changes have been reverted.");
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center font-serif text-stone-500">Loading diary...</div>;
  }

  return (
    <ScrapbookLayout
      isEditable={true}
      username={user.username}
      destinations={destinations}
      isLoading={isLoading}
      notesToSelf={user.notes_to_self || ""}
      onUpdateNotesToSelf={handleUpdateNotes}
      onSaveDestinations={handleSaveDestinations}
      isPublic={user.is_public}
      onTogglePublic={handleTogglePublic}
      onLogout={logout}
      themeTitle={user.theme_title}
      themeSubtitle={user.theme_subtitle}
      themeId={user.theme_id}
      themeColors={user.theme?.colors}
      mapDrawings={user.map_drawings || []}
      onUpdateTheme={handleUpdateTheme}
      onUpdateMapDrawings={handleUpdateMapDrawings}
    />
  );
}
