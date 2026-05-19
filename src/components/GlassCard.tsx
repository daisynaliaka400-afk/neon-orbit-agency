import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'gold' | 'purple' | 'none';
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, glowColor = 'none', onClick }) => {
  const glowStyles = {
    cyan: 'shadow-[0_0_20px_rgba(0,242,255,0.15)] border-cyan-500/30',
    gold: 'shadow-[0_0_20px_rgba(255,204,0,0.15)] border-yellow-500/30',
    purple: 'shadow-[0_0_20px_rgba(191,0,255,0.15)] border-purple-500/30',
    none: 'border-white/10 shadow-xl'
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-xl p-6 transition-all duration-300",
        glowStyles[glowColor],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;