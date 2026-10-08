import React, { useState } from 'react';
import { X, Download, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  shareUrl: string;
}

export default function SharePreviewModal({ isOpen, onClose, imageUrl, shareUrl }: SharePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      const textToCopy = `Check out my Places map! 🌍✨\n${shareUrl}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const item = new ClipboardItem({
        'text/plain': new Blob([textToCopy], { type: 'text/plain' }),
        'image/png': blob
      });

      await navigator.clipboard.write([item]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text and image: ', err);
      // Fallback to just text if image copying fails (e.g., due to permissions or browser limitations)
      try {
        await navigator.clipboard.writeText(`Check out my Places map! 🌍✨\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        alert("Failed to copy to clipboard");
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'places.png';
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#faf8f5] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <h2 className="font-serif text-xl font-bold text-stone-800">Share Your Diary</h2>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          <p className="text-sm font-sans text-stone-500 mb-6 text-center max-w-md">
            Native sharing isn't supported on this browser. You can download the image and copy your link manually below!
          </p>

          <div className="relative w-full rounded-xl overflow-hidden border-4 border-white shadow-lg mb-8">
            <img src={imageUrl} alt="Diary Snapshot" className="w-full h-auto object-cover" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full font-serif font-bold transition-colors shadow-sm"
            >
              <Download size={18} /> Download Image
            </button>
            <button 
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 px-6 py-3 rounded-full font-serif font-bold transition-colors shadow-sm"
            >
              {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Image & Link'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
