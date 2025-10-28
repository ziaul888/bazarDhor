"use client";

import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FloatingAddButtonProps {
  onClick?: () => void;
  className?: string;
}

export function FloatingAddButton({ onClick, className = "" }: FloatingAddButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.();
  };

  return (
    <div   onClick={handleClick} className="fixed bottom-20 right-4 z-50">
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40 animate-pulse scale-125" />
      <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-60 animate-ping" />
      
      <button
      
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-20 h-20 
          bg-gradient-to-br from-primary via-primary to-primary/90
          hover:from-primary/90 hover:via-primary hover:to-primary
          text-primary-foreground 
          rounded-full 
          shadow-2xl hover:shadow-primary/40
          flex items-center justify-center
          transition-all duration-300 ease-out
          transform hover:scale-110 active:scale-95
          border-4 border-white
          ${isPressed ? 'scale-95' : ''}
          ${className}
        `}
        aria-label="Add new item"
      >
        {/* Inner highlight */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center">
          <Plus 
            className={`h-8 w-8 font-bold transition-all duration-300 ${
              isPressed ? 'rotate-90 scale-75' : isHovered ? 'rotate-45 scale-110' : 'rotate-0'
            }`} 
            strokeWidth={3}
          />
          
          {/* Enhanced sparkle effects */}
          {isHovered && (
            <>
              <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-accent animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 h-3 w-3 text-accent animate-bounce delay-100" />
              <Sparkles className="absolute -top-2 -left-2 h-2 w-2 text-accent animate-bounce delay-200" />
            </>
          )}
        </div>
        
        {/* Pulsing ring */}
        <div className={`
          absolute inset-0 rounded-full border-4 border-primary/50
          transition-all duration-1000
          ${isPressed ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
          animate-ping
        `} />
      </button>
      
      {/* Attention-grabbing pulse animation */}
      <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75" />
    </div>
  );
}