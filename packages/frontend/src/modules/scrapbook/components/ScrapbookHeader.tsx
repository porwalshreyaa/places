import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, LogOut, CheckCircle, Store, ArrowLeft } from "lucide-react";
import { User } from "../../../context/AuthContext";

export interface ScrapbookHeaderProps {
  isEditable: boolean;
  username: string;
  isPublic?: boolean;
  onTogglePublic?: () => void;
  copiedLink: boolean;
  handleCopyLink: () => void;
  handleSnapshotAndShare: () => void;
  isCapturing: boolean;
  onLogout?: () => void;
  currentUser?: User | null;
  isEditingTheme: boolean;
  setIsEditingTheme: (editing: boolean) => void;
  handleSaveTheme: () => void;
  handleCancelThemeEdit: () => void;
  localTitle: string;
  setLocalTitle: (title: string) => void;
  localSubtitle: string;
  setLocalSubtitle: (subtitle: string) => void;
  themeTitle: string;
  themeSubtitle: string;
  setIsThemeStoreOpen: (open: boolean) => void;
  saveStatus?: 'saved' | 'saving' | 'error';
}

export default function ScrapbookHeader({
  isEditable,
  username,
  isPublic,
  onTogglePublic,
  copiedLink,
  handleCopyLink,
  handleSnapshotAndShare,
  isCapturing,
  onLogout,
  currentUser,
  isEditingTheme,
  setIsEditingTheme,
  handleSaveTheme,
  handleCancelThemeEdit,
  localTitle,
  setLocalTitle,
  localSubtitle,
  setLocalSubtitle,
  themeTitle,
  themeSubtitle,
  setIsThemeStoreOpen,
  saveStatus = 'saved',
}: ScrapbookHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-4 no-screenshot">
        {isEditable ? (
          <>
            <div className="flex items-center gap-2">
              {/* Save Status Badge */}
              <div
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                  saveStatus === 'saving'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : saveStatus === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Saved</span>
                  </>
                )}
              </div>
              <button
                onClick={onTogglePublic}
                className={`px-4 py-2 rounded-full font-sans font-bold text-xs border shadow-sm transition-all flex items-center gap-2 ${
                  isPublic
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPublic ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                  }`}
                />
                {isPublic ? "Public Profile On" : "Private Profile"}
              </button>

              {isPublic && (
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-sans font-bold text-xs shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
                >
                  {copiedLink ? <CheckCircle size={14} /> : <LinkIcon size={14} />}
                  {copiedLink ? "Link Copied!" : "Copy Share Link"}
                </button>
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
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 rounded-full bg-white text-stone-700 border border-stone-200 font-sans font-bold text-xs shadow-sm hover:bg-stone-50 transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} /> Back to My Profile
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
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

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
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
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="text-center font-kalam font-bold tracking-wide bg-transparent border-b border-brand-300 focus:outline-none focus:border-brand-500 text-stone-900 w-full max-w-lg"
                />
                <input
                  value={localSubtitle}
                  onChange={(e) => setLocalSubtitle(e.target.value)}
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
  );
}
