import React from 'react';
import { motion } from 'framer-motion';

// Animation simple d'entrée de page
export const AnimatedPage = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Animation d'apparition en cascade simple
export const StaggerContainer = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Animation d'éléments individuels avec délai
export const StaggerItem = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      ease: "easeOut",
      delay: delay 
    }}
  >
    {children}
  </motion.div>
);

// Carte flottante avec animation douce
export const FloatingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      y: [0, -8, 0]
    }}
    transition={{ 
      opacity: { duration: 0.6, delay: delay },
      y: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }}
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
);

// Bouton avec animation simple
export const AnimatedButton = ({ children, className = "", onClick, disabled = false, type = "button" }) => (
  <motion.button
    type={type}
    className={className}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.button>
);

// Éléments de fond avec pulsation douce
export const AnimatedBackground = ({ className = "", delay = 0 }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.05, 1],
      opacity: [0.1, 0.15, 0.1]
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  />
);

// Notes de musique avec mouvement doux
export const AnimatedMusicNote = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -12, 0],
      rotate: [0, 3, -3, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

// Icônes avec pulsation subtile
export const AnimatedIcon = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

// Input sans animation de focus
export const AnimatedInput = ({ className = "", ...props }) => (
  <input
    className={className}
    {...props}
  />
);

// Label avec changement de couleur
export const AnimatedLabel = ({ children, className = "", isActive = false }) => (
  <motion.label
    className={className}
    animate={{
      color: isActive ? "#8b5cf6" : "#a1a1aa"
    }}
    transition={{
      duration: 0.3
    }}
  >
    {children}
  </motion.label>
);

// Message d'erreur avec secousse douce
export const AnimatedError = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ x: 0 }}
    animate={{
      x: [-3, 3, -3, 3, 0]
    }}
    transition={{
      duration: 0.5,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Transition de page simple
export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{
      duration: 0.4,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Animation de survol pour les cartes
export const HoverCard = ({ children, className = "" }) => (
  <motion.div
    className={className}
    whileHover={{ 
      y: -5,
      transition: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
);

// Animation de pulsation douce
export const GentlePulse = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={className}
    animate={{
      opacity: [0.8, 1, 0.8]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

export default {
  AnimatedPage,
  StaggerContainer,
  StaggerItem,
  FloatingCard,
  AnimatedButton,
  AnimatedBackground,
  AnimatedMusicNote,
  AnimatedIcon,
  AnimatedInput,
  AnimatedLabel,
  AnimatedError,
  PageTransition,
  HoverCard,
  GentlePulse
};
