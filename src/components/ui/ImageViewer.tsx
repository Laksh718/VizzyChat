'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeImageViewer}
        >
          {/* Top controls */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-5 right-5 flex items-center gap-2 z-10"
          >
            <button
              onClick={(e) => { e.stopPropagation(); window.open(imageViewerSrc, '_blank'); }}
              className="p-2.5 rounded-xl bg-white/8 hover:bg-white/15 backdrop-blur-sm text-white/70 hover:text-white transition-all border border-white/10"
              title="Open original"
            >
              <ExternalLink size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="p-2.5 rounded-xl bg-white/8 hover:bg-white/15 backdrop-blur-sm text-white/70 hover:text-white transition-all border border-white/10"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              onClick={closeImageViewer}
              className="p-2.5 rounded-xl bg-white/8 hover:bg-red-500/30 backdrop-blur-sm text-white/70 hover:text-white transition-all border border-white/10"
              title="Close"
            >
              <X size={16} />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: 'blur(12px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative max-w-[90vw] max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/30 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageViewerSrc}
              alt="Full size preview"
              width={1400}
              height={1050}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              unoptimized
            />
          </motion.div>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[12px] text-white/30"
          >
            Press Esc or click outside to close
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
