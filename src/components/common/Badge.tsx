import React from 'react';
import { Rarity } from '../../types';

interface BadgeProps {
  rarity?: Rarity;
  variant?: 'common' | 'rare' | 'epic' | 'navy' | 'yellow' | 'tie';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  rarity,
  variant,
  size = 'md',
  children,
  className = '',
}) => {
  const chosenVariant = variant || (rarity ? (rarity.toLowerCase() as 'common' | 'rare' | 'epic') : 'navy');

  const variantStyles = {
    common: 'bg-[#28D86B] text-[#0B2A63] border-[#0B2A63]',
    rare: 'bg-[#2A91FF] text-white border-[#0B2A63]',
    epic: 'bg-gradient-to-r from-[#D946EF] to-[#9333EA] text-white border-[#0B2A63] shadow-[0_0_12px_rgba(217,70,239,0.5)]',
    navy: 'bg-[#0B2A63] text-white border-[#0B2A63]',
    yellow: 'bg-[#FFD52E] text-[#0B2A63] border-[#0B2A63]',
    tie: 'bg-gradient-to-r from-[#FFB800] to-[#FF8A00] text-white border-[#0B2A63]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-lg border-[2px] font-extrabold',
    md: 'text-xs px-2.5 py-1 rounded-xl border-[2.5px] font-black',
    lg: 'text-sm px-3.5 py-1.5 rounded-2xl border-[3px] font-black tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-display select-none leading-none shadow-[0_2px_0_#0B2A63] ${variantStyles[chosenVariant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
