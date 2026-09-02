import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ScrapbookLayout from '../modules/scrapbook/ScrapbookLayout';
import { Destination, MapDrawing } from '../types';
import { injectThemeColors, resetThemeColors } from '../utils/themeInjector';

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
      const res = await fetch("/api/destinations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
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
    setDestinations(updatedList);
    try {
      await fetch("/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedList),
      });
    } catch (error) {
      console.error("Failed to persist wishlist destinations:", error);
    }
  };

  const handleUpdateNotes = async (notes: string) => {
    updateUser({ notes_to_self: notes });
    try {
      await fetch("/api/user-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes_to_self: notes }),
      });
    } catch (error) {
      console.error("Failed to persist notes:", error);
    }
  };

  const handleUpdateTheme = async (title: string, subtitle: string, theme_id?: string) => {
    const updates: Record<string, string> = { theme_title: title, theme_subtitle: subtitle };
    if (theme_id) updates.theme_id = theme_id;
    
    updateUser(updates);
    try {
      const response = await fetch("/api/user-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.theme) {
        updateUser({ theme: data.theme });
      }
    } catch (error) {
      console.error("Failed to persist theme:", error);
    }
  };

  const handleUpdateMapDrawings = async (drawings: MapDrawing[]) => {
    updateUser({ map_drawings: drawings });
    try {
      await fetch("/api/user-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ map_drawings: drawings }),
      });
    } catch (error) {
      console.error("Failed to persist map drawings:", error);
    }
  };

  const handleTogglePublic = async () => {
    const newValue = !user?.is_public;
    updateUser({ is_public: newValue });
    try {
      await fetch("/api/user-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_public: newValue }),
      });
    } catch (error) {
      console.error("Failed to persist public setting:", error);
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
