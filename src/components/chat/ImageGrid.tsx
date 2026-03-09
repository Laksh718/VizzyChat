'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, ZoomIn } from 'lucide-react';
import type { GeneratedImage } from '@/types';
import { cn } from '@/lib/utils';

type ImageGridProps = {
  images: GeneratedImage[];
  onImageClick: (src: string) => void;
};

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const count = images.length;

  const gridClass = cn(
    'image-grid mt-3',
    count === 1 && 'image-grid-1',
    count === 2 && 'image-grid-2',
    count === 3 && 'image-grid-3',
    count >= 4 && 'image-grid-4',
  );

  const handleDownload = async (
    e: React.MouseEvent,
    url: string,
    index: number,
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `vizzychat-${Date.now()}-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className={gridClass}>
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
          className="relative group rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] cursor-pointer"
          style={{ aspectRatio: count === 1 ? '4/3' : '1/1' }}
          onClick={() => onImageClick(img.url)}
        >
          <Image
            src={img.url}
            alt={img.prompt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-end p-3 gap-2">
            <button
              onClick={(e) => handleDownload(e, img.url, i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white"
              title="Download"
            >
              <Download size={15} />
            </button>
            <button
              onClick={() => onImageClick(img.url)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white"
              title="View full size"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
