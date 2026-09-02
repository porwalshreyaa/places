import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Palette } from 'lucide-react';
import { generateThemeShades } from '../utils/themeGenerator';

export interface Theme {
  id: string;
  name: string;
  base_color: string;
  colors: Record<string, string>;
  is_system: boolean;
  color_hash: string;
}

interface ThemeStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (theme: Theme) => void;
}

export default function ThemeStoreModal({ isOpen, onClose, currentThemeId, onSelectTheme }: ThemeStoreModalProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTab, setActiveTab] = useState<'store' | 'create'>('store');
  const [newThemeName, setNewThemeName] = useState('');
  const [newBaseColor, setNewBaseColor] = useState('#f43f5e');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) fetchThemes();
  }, [isOpen]);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/themes');
      const data = await res.json();
      setThemes(data);
    } catch (err) {
      console.error('Failed to fetch themes', err);
    }
  };

  const handlePublishTheme = async () => {
    if (!newThemeName.trim()) {
      setError('Please provide a theme name.');
      return;
    }
    setError('');
    setIsPublishing(true);
    
    try {
      const colors = generateThemeShades(newBaseColor);
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newThemeName,
          base_color: newBaseColor,
          colors
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to publish theme');
      }
      
      const newTheme = await res.json();
      await fetchThemes();
      onSelectTheme(newTheme);
      setActiveTab('store');
      setNewThemeName('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  const systemThemes = themes.filter(t => t.is_system);
  const communityThemes = themes.filter(t => !t.is_system);

  const renderThemeCard = (theme: Theme) => {
    const isSelected = currentThemeId === theme.id;
    return (
      <div 
        key={theme.id}
        onClick={() => onSelectTheme(theme)}
        className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 shadow-sm
          ${isSelected ? 'border-brand-500 bg-brand-50 shadow-md transform -translate-y-1' : 'border-stone-100 bg-white hover:border-brand-200 hover:bg-stone-50'}`}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 bg-brand-500 text-white p-1 rounded-full">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
        <div 
          className="w-16 h-16 rounded-full mb-3 mx-auto shadow-inner"
          style={{ backgroundColor: theme.base_color }}
        />
        <h4 className="font-serif font-bold text-stone-800 text-center text-sm">{theme.name}</h4>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-800">Theme Store</h2>
            <p className="text-sm text-stone-500 font-sans mt-1">Customize your diary's aesthetic.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-4 flex gap-6 border-b border-stone-100">
          <button
            onClick={() => setActiveTab('store')}
            className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'store' ? 'text-brand-500' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Browse Themes
            {activeTab === 'store' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'create' ? 'text-brand-500' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Create Your Own
            {activeTab === 'create' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-[#faf8f5]">
          {activeTab === 'store' ? (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">System Themes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {systemThemes.map(renderThemeCard)}
                </div>
              </section>

              {communityThemes.length > 0 && (
                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">Community Themes</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {communityThemes.map(renderThemeCard)}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-500">
                  <Palette size={28} />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-800">Mix Your Own Color</h3>
                <p className="text-sm text-stone-500 mt-2">Pick a base color and we'll automatically generate a beautiful, harmonious color scale for you.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold border border-red-100 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Theme Name</label>
                  <input 
                    type="text" 
                    value={newThemeName}
                    onChange={e => setNewThemeName(e.target.value)}
                    placeholder="e.g. Midnight Sparkle"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-700 font-bold focus:outline-none focus:border-brand-400 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Base Color</label>
                  <div className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl p-2">
                    <input 
                      type="color" 
                      value={newBaseColor}
                      onChange={e => setNewBaseColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <div className="font-mono text-stone-600 font-bold tracking-wider">{newBaseColor.toUpperCase()}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handlePublishTheme}
                  disabled={isPublishing}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl py-3.5 transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  {isPublishing ? 'Publishing...' : <><Plus size={18} /> Publish to Store</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
