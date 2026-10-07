import React from 'react';
import { GachaCardData } from '../types';
import confetti from 'canvas-confetti';

interface GachaCardProps {
  card: GachaCardData;
  index: number;
  onReveal: (id: string) => void;
  disabled?: boolean;
}

export const GachaCard: React.FC<GachaCardProps> = ({ card, index, onReveal, disabled }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (card.revealed || disabled) return;

    if (card.rarity === 'EPIC') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 36,
        spread: 60,
        origin: { x, y },
        colors: ['#ff0055', '#ffaa00', '#00ff66', '#00ccff', '#aa00ff', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 120,
        scalar: 0.8,
      });
    }

    onReveal(card.id);
  };

  // Card face border & glow styling based strictly on the Rarity Visual System
  const getRarityFaceStyles = () => {
    switch (card.rarity) {
      case 'COMMON':
        return {
          containerClass: 'border-2 border-emerald-500/70 hover:border-emerald-400 common-glow',
          badgeClass: 'text-emerald-400 border-b border-emerald-500/30',
          voteClass: 'text-emerald-300',
        };
      case 'RARE':
        return {
          containerClass: 'border-2 border-blue-500 hover:border-blue-400 rare-glow',
          badgeClass: 'text-blue-400 border-b border-blue-500/40',
          voteClass: 'text-blue-300 font-semibold',
        };
      case 'EPIC':
        return {
          containerClass: 'border-2 border-transparent animate-rainbow rainbow-glow',
          badgeClass: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-400 border-b border-white/20',
          voteClass: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-cyan-300 font-bold',
        };
      default:
        return {
          containerClass: 'border border-zinc-700',
          badgeClass: 'text-zinc-400 border-b border-zinc-800',
          voteClass: 'text-zinc-300',
        };
    }
  };

  const rarityStyles = getRarityFaceStyles();

  return (
    <div
      role="button"
      tabIndex={card.revealed ? -1 : 0}
      aria-label={card.revealed ? `${card.optionName}, ${card.rarity}, ${card.voteValue} votes` : `Card ${index + 1}, click to reveal`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !card.revealed && !disabled) {
          e.preventDefault();
          onReveal(card.id);
        }
      }}
      className={`group relative h-48 sm:h-56 w-full perspective-1000 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform duration-150 ${
        card.revealed ? 'cursor-default' : 'hover:-translate-y-1 active:translate-y-0'
      }`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-out ${
          card.revealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* CARD BACK: Strictly minimal black-and-white. Only contains GACHANDUAN branding */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-colors flex flex-col justify-between p-4 shadow-lg overflow-hidden">
          {/* Subtle top indicator */}
          <div className="flex justify-between items-center text-[10px] tracking-widest text-zinc-500 uppercase font-mono">
            <span>#{String(index + 1).padStart(2, '0')}</span>
            <span>GACHA</span>
          </div>

          {/* Center minimal branding */}
          <div className="text-center my-auto">
            <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-zinc-200 block">
              GACHANDUAN
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 block">
              TAP TO REVEAL
            </span>
          </div>

          {/* Minimal bottom metadata */}
          <div className="flex justify-between items-center text-[9px] tracking-wider text-zinc-600 font-mono">
            <span>10-CARD PACK</span>
            <span>RNG 2026</span>
          </div>
        </div>

        {/* CARD FACE: Revealed state. Strictly minimal. ONLY the user's input text as main content */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-zinc-950 flex flex-col justify-between p-4 shadow-2xl overflow-hidden ${
            rarityStyles.containerClass
          }`}
        >
          {/* Top metadata strip: Rarity and Card Index */}
          <div className={`flex justify-between items-center pb-2 text-[11px] tracking-widest uppercase font-mono ${rarityStyles.badgeClass}`}>
            <span className="font-bold">{card.rarity}</span>
            <span className="text-zinc-500">#{String(index + 1).padStart(2, '0')}</span>
          </div>

          {/* Main Visual Center: ONLY user's input text, uppercase, prominent typography */}
          <div className="flex-1 flex items-center justify-center px-2 py-4 text-center my-auto">
            <h3
              className="font-display font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white uppercase break-words line-clamp-3 leading-tight"
              title={card.optionName}
            >
              {card.optionName}
            </h3>
          </div>

          {/* Bottom metadata strip: Vote value */}
          <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider">VALUE</span>
            <span className={`tracking-wider ${rarityStyles.voteClass}`}>
              +{card.voteValue} {card.voteValue === 1 ? 'VOTE' : 'VOTES'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
