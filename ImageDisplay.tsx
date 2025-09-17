
import React from 'react';

interface ImageDisplayProps {
  title: string;
  src: string | null;
  isPlaceholder?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, src, isPlaceholder = false }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center text-text-secondary">{title}</h2>
      <div className="relative w-full aspect-square bg-base-200 rounded-lg overflow-hidden shadow-lg">
        {src ? (
          <img 
            src={src} 
            alt={title} 
            className={`w-full h-full object-contain transition-opacity duration-500 ${isPlaceholder ? 'opacity-50' : 'opacity-100'}`} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-text-secondary">No image</p>
          </div>
        )}
      </div>
    </div>
  );
};
