
import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the AI's creative circuits...",
  "Mixing digital paints and pixels...",
  "Consulting with the muse of imagery...",
  "Applying a touch of generative magic...",
  "Almost there, perfecting the details...",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-brand-primary border-base-300 rounded-full animate-spin"></div>
      <p className="text-text-primary text-lg mt-6 font-medium text-center px-4 transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
    </div>
  );
};
