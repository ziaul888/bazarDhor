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
    <div className="fixed bottom-20 right-4 z-50">
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40 animate-pulse scale-125" />
      <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-60 animate-ping" />
      
      <button
        onClick={handleClick}
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
      
      {/* Always visible label */}
      <div className="absolute right-24 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className={`
          px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full
          shadow-lg border-2 border-white
          transition-all duration-300 ease-out
          ${isHovered ? 'opacity-100 translate-x-0 scale-105' : 'opacity-90 translate-x-1 scale-100'}
        `}>
          Add Item
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-l-8 border-l-primary border-t-4 border-b-4 border-t-transparent border-b-transparent" />
        </div>
      </div>
      
      {/* Attention-grabbing pulse animation */}
      <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75" />
    </div>
  );
}