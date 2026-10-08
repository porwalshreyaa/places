import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScrapbookLayout from '../modules/scrapbook/ScrapbookLayout';
import { Destination, Theme, MapDrawing } from '../types';
import { Compass } from 'lucide-react';
import { injectThemeColors, resetThemeColors } from '../utils/themeInjector';
import { api } from '../utils/api';

export default function PublicPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [notesToSelf, setNotesToSelf] = useState("");
  const [themeTitle, setThemeTitle] = useState("");
  const [themeSubtitle, setThemeSubtitle] = useState("");
  const [themeId, setThemeId] = useState("");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mapDrawings, setMapDrawings] = useState<MapDrawing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const data = await api.get<{
          destinations: Destination[];
          notes_to_self: string;
          theme_title: string;
          theme_subtitle: string;
          theme_id: string;
          theme: Theme | null;
          map_drawings: MapDrawing[];
        }>(`/api/public/user/${username}`);
        
        setDestinations(data.destinations || []);
        setNotesToSelf(data.notes_to_self || "");
        setThemeTitle(data.theme_title);
        setThemeSubtitle(data.theme_subtitle);
        setThemeId(data.theme_id);
        setTheme(data.theme);
        setMapDrawings(data.map_drawings || []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPublicProfile();
  }, [username]);

  useEffect(() => {
    if (theme?.colors) {
      injectThemeColors(theme.colors);
    } else {
      resetThemeColors();
    }
  }, [theme]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center border border-stone-200">
          <Compass className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-stone-800 font-bold mb-2">Diary Not Available</h2>
          <p className="font-serif text-stone-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-brand-400 hover:bg-brand-500 text-white rounded-full font-sans font-bold text-sm shadow-sm transition-all"
          >
            Create Your Own
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScrapbookLayout
      isEditable={false}
      username={username || ""}
      destinations={destinations}
      isLoading={isLoading}
      notesToSelf={notesToSelf}
      themeTitle={themeTitle}
      themeSubtitle={themeSubtitle}
      themeId={themeId}
      mapDrawings={mapDrawings}
    />
  );
}
