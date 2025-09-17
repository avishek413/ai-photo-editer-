
import React from 'react';
import { CameraIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-lg sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center space-x-3">
            <CameraIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              AI Photo Studio
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
