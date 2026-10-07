import React, { useState } from 'react';
import { GachaCardData } from '../types';
import confetti from 'canvas-confetti';

interface GachaCardProps {
  card: GachaCardData;
  index: number;
  onReveal: (id: string) => void;
  disabled?: boolean;
}

export const GachaCard: React.FC<GachaCardProps> = ({ card, index, onReveal, disabled }) => {
  const [isClickPopping, setIsClickPopping] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (card.revealed || disabled) return;

    if (card.rarity === 'EPIC') {
      setIsClickPopping(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 50,
        spread: 75,
        origin: { x, y },
        colors: ['#c084fc', '#e879f9', '#a855f7', '#ffffff', '#38bdf8'],
        disableForReducedMotion: true,
        ticks: 130,
        scalar: 0.9,
      });
    }

    onReveal(card.id);
  };

  // Card back styling with custom rarity background artwork (ketika belum dibuka)
  const getRarityBackStyles = () => {
    switch (card.rarity) {
      case 'COMMON':
        return {
          bgImage: '/cards/card_common.png',
          borderClass: 'border-emerald-500/60 hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.35)]',
          badgeText: 'COMMON',
          badgeClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50',
        };
      case 'RARE':
        return {
          bgImage: '/cards/card_rare.png',
          borderClass: 'border-blue-500/70 hover:border-blue-400 hover:shadow-[0_0_22px_rgba(59,130,246,0.35)]',
          badgeText: 'RARE',
          badgeClass: 'text-blue-300 bg-blue-950/80 border-blue-500/50',
        };
      case 'EPIC':
        return {
          bgImage: '/cards/card_epic.png',
          borderClass: 'border-purple-400/90 hover:border-purple-300 hover:shadow-[0_0_28px_rgba(192,132,252,0.6)]',
          badgeText: 'EPIC',
          badgeClass: 'text-purple-200 bg-purple-950/80 border-purple-400/60 font-bold',
        };
      default:
        return {
          bgImage: '/cards/card_common.png',
          borderClass: 'border-zinc-700',
          badgeText: 'COMMON',
          badgeClass: 'text-zinc-400 bg-zinc-900 border-zinc-700',
        };
    }
  };

  // Card face border & glow styling based strictly on Rarity Visual System (ketika sudah dibuka)
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
          containerClass: 'border-2 border-purple-400 hover:border-purple-300 shadow-[0_0_25px_rgba(192,132,252,0.45)]',
          badgeClass: 'text-purple-300 border-b border-purple-400/40 font-bold',
          voteClass: 'text-purple-300 font-bold',
        };
      default:
        return {
          containerClass: 'border border-zinc-700',
          badgeClass: 'text-zinc-400 border-b border-zinc-800',
          voteClass: 'text-zinc-300',
        };
    }
  };

  const backStyles = getRarityBackStyles();
  const faceStyles = getRarityFaceStyles();

  return (
    <div
      role="button"
      tabIndex={card.revealed ? -1 : 0}
      aria-label={card.revealed ? `${card.optionName}, ${card.rarity}, ${card.voteValue} votes` : `${card.rarity} card ${index + 1}, click to reveal`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !card.revealed && !disabled) {
          e.preventDefault();
          onReveal(card.id);
        }
      }}
      className={`group relative card-aspect w-full perspective-1000 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200 ${card.revealed
        ? 'cursor-default'
        : card.rarity === 'EPIC'
          ? `epic-card-idle hover:-translate-y-3 hover:scale-[1.05] active:scale-95 ${isClickPopping ? 'scale-110 -translate-y-4 shadow-[0_0_40px_rgba(192,132,252,0.9)]' : ''}`
          : 'hover:-translate-y-1.5 active:translate-y-0 hover:scale-[1.02]'
        }`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-out ${card.revealed ? 'rotate-y-180' : ''
          }`}
      >
        {/* CARD BACK (Ketika belum dibuka): Background warna sesuai rarity (hijau, biru, ungu) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 shadow-xl overflow-hidden ${backStyles.borderClass}`}
        >
          {/* Background Rarity Graphic */}
          <img
            src={backStyles.bgImage}
            alt={`${card.rarity} card back`}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
          />

          {/* Vignette contrast overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75 pointer-events-none" />

          {/* Top metadata strip: Card Index & Rarity Badge */}
          <div className="relative z-10 flex justify-between items-center text-[10px] tracking-widest uppercase font-mono">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-white font-bold">
              #{String(index + 1).padStart(2, '0')}
            </span>
            <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-wider backdrop-blur-sm ${backStyles.badgeClass}`}>
              {backStyles.badgeText}
            </span>
          </div>

          {/* Center minimal branding */}
          <div className="relative z-10 text-center my-auto px-1">
            <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-white block drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              GACHANDUAN
            </span>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 transition-all shadow-sm">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-100 block">
                TAP TO REVEAL
              </span>
            </div>
          </div>

          {/* Bottom metadata */}
          <div className="relative z-10 flex justify-between items-center text-[9px] tracking-wider text-zinc-300/90 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">10-CARD PACK</span>
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">RNG 2026</span>
          </div>
        </div>

        {/* CARD FACE (Ketika sudah dibuka): Menampilkan opsi terpilih */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-zinc-950 flex flex-col justify-between p-3.5 sm:p-4 shadow-2xl overflow-hidden ${faceStyles.containerClass
            }`}
        >
          {/* Top metadata strip: Rarity and Card Index */}
          <div className={`flex justify-between items-center pb-2 text-[11px] tracking-widest uppercase font-mono ${faceStyles.badgeClass}`}>
            <span className="font-bold">{card.rarity}</span>
            <span className="text-zinc-500">#{String(index + 1).padStart(2, '0')}</span>
          </div>

          {/* Main Visual Center: Option text */}
          <div className="flex-1 flex items-center justify-center px-2 py-4 text-center my-auto">
            <h3
              className="font-display font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white uppercase break-words line-clamp-4 leading-tight"
              title={card.optionName}
            >
              {card.optionName}
            </h3>
          </div>

          {/* Bottom metadata strip: Vote value */}
          <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider">VALUE</span>
            <span className={`tracking-wider ${faceStyles.voteClass}`}>
              +{card.voteValue} {card.voteValue === 1 ? 'VOTE' : 'VOTES'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
