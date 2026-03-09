'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, ZoomIn, Sparkles } from 'lucide-react';
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
      window.open(url, '_blank');
    }
  };

  return (
    <div className={gridClass}>
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative group rounded-2xl overflow-hidden bg-[#13131f] border border-[rgba(255,255,255,0.07)] cursor-pointer shadow-xl"
          style={{ aspectRatio: count === 1 ? '4/3' : '1/1' }}
          onClick={() => onImageClick(img.url)}
        >
          <Image
            src={img.url}
            alt={img.prompt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Action buttons */}
          <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1 text-[10px] text-white/70">
              <Sparkles size={9} className="text-pink-400" />
              <span className="truncate max-w-[120px]">{img.prompt.slice(0, 30)}…</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={(e) => handleDownload(e, img.url, i)}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg p-1.5 text-white transition-colors"
                title="Download"
              >
                <Download size={13} />
              </button>
              <button
                onClick={() => onImageClick(img.url)}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg p-1.5 text-white transition-colors"
                title="View full size"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Top-right badge */}
          {count > 1 && (
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[10px] text-white/60">
              {i + 1}/{count}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
