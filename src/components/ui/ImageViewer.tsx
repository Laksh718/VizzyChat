'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import Image from 'next/image';
import { useChat } from '@/lib/ChatContext';

export default function ImageViewer() {
  const { imageViewerSrc, closeImageViewer } = useChat();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImageViewer();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeImageViewer]);

  const handleDownload = async () => {
    if (!imageViewerSrc) return;
    try {
      const response = await fetch(imageViewerSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vizzychat-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageViewerSrc, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {imageViewerSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeImageViewer}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>
            <button
              onClick={closeImageViewer}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageViewerSrc}
              alt="Full size preview"
              width={1200}
              height={900}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
