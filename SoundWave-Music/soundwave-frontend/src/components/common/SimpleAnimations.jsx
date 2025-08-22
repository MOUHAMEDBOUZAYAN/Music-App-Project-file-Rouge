import React from 'react';

// Composants d'animation simples pour remplacer AnimatedWrapper
export const AnimatedPage = ({ children, className = '', ...props }) => (
  <div className={`min-h-screen ${className}`} {...props}>
    {children}
  </div>
);

export const StaggerContainer = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const StaggerItem = ({ children, delay = 0, className = '', ...props }) => (
  <div 
    className={`transition-all duration-500 ${className}`} 
    style={{ animationDelay: `${delay}s` }}
    {...props}
  >
    {children}
  </div>
);

export const FloatingCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl ${className}`} {...props}>
    {children}
  </div>
);

export const AnimatedButton = ({ children, className = '', ...props }) => (
  <button 
    className={`transition-all duration-300 hover:scale-105 active:scale-95 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export const AnimatedBackground = ({ children, className = '', ...props }) => (
  <div className={`animate-pulse ${className}`} {...props}>
    {children}
  </div>
);

export const AnimatedMusicNote = ({ children, className = '', ...props }) => (
  <div className={`animate-bounce ${className}`} {...props}>
    {children}
  </div>
);

export const AnimatedIcon = ({ children, delay = 0, className = '', ...props }) => (
  <div 
    className={`transition-all duration-300 ${className}`} 
    style={{ animationDelay: `${delay}s` }}
    {...props}
  >
    {children}
  </div>
);

export const AnimatedInput = ({ children, className = '', ...props }) => (
  <div className={`transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

export const AnimatedLabel = ({ children, className = '', ...props }) => (
  <div className={`transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

export const AnimatedError = ({ children, className = '', ...props }) => (
  <div className={`animate-pulse ${className}`} {...props}>
    {children}
  </div>
);

export const GentlePulse = ({ children, className = '', ...props }) => (
  <div className={`animate-pulse ${className}`} {...props}>
    {children}
  </div>
);
