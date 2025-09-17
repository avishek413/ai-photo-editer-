
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="p-3 bg-base-200 hover:bg-base-300 disabled:bg-base-300/50 disabled:cursor-not-allowed rounded-lg transition duration-300"
    >
      {children}
    </button>
  );
};
