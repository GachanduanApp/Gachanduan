import React, { useEffect, useState } from 'react';
import { GachaCardData } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface EpicCardShowcaseProps {
  card: GachaCardData;
  index: number;
  onClose: () => void;
}

export const EpicCardShowcase: React.FC<EpicCardShowcaseProps> = ({ card, index, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealedFully, setIsRevealedFully] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Play epic reveal sound
    sound.playEpicReveal();

    // Subtle initial particle burst as the card pops in
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.55 },
      colors: ['#c084fc', '#e879f9', '#a855f7', '#ffffff'],
      disableForReducedMotion: true,
      ticks: 100,
      scalar: 0.8,
    });

    // Dramatic 3D card flip after the initial pop-up settles
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);

      // Huge celebratory confetti shower upon revealing the front
      confetti({
        particleCount: 85,
        spread: 95,
        origin: { y: 0.5 },
        colors: ['#c084fc', '#e879f9', '#f472b6', '#38bdf8', '#ffffff', '#fbbf24'],
        disableForReducedMotion: true,
        ticks: 180,
        scalar: 1.1,
      });

      setTimeout(() => {
        setIsRevealedFully(true);
      }, 500);
    }, 750);

    return () => {
      clearTimeout(flipTimer);
    };
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    sound.playClick();
    // Smooth pop-down exit transition before unmounting
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Epic Card Showcase"
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 select-none overflow-hidden cursor-pointer transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100 bg-black/90 backdrop-blur-md'
      }`}
    >
      {/* Background FX Video: Fading to dark towards the top */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          src="/animation/animasi_epic_fx.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)',
          }}
        />

        {/* Cinematic dark gradient fading into dark upwards */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/75 to-black pointer-events-none" />
      </div>

      {/* Energy Shockwave Ring bursting on entrance */}
      <div className="absolute pointer-events-none w-80 h-80 rounded-full border-2 border-purple-400/60 shadow-[0_0_80px_rgba(192,132,252,0.8)] animate-shockwave" />

      {/* Close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        title="Close showcase"
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/70 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors focus:outline-none"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Top Banner with pop-in slide */}
      <div className={`relative z-10 text-center mb-6 transition-all duration-300 ${
        isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(192,132,252,0.5)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>EPIC CARD REVEAL</span>
        </div>
      </div>

      {/* Centered Enlarged Card with Pop-Up & Pop-Down Animations */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-64 sm:w-72 md:w-80 max-w-[85vw] card-aspect rounded-3xl perspective-1000 cursor-default transition-all duration-300 ${
          isClosing ? 'scale-75 opacity-0 -translate-y-6' : 'animate-epic-pop'
        }`}
      >
        <div
          className={`relative w-full h-full rounded-3xl duration-700 transform-style-3d transition-transform ease-out ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* CARD BACK (Sebelum dibuka): Ungu Epic Artwork */}
          <div
            style={{
              transform: 'translateZ(1px)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-purple-950 border-2 border-purple-400/90 shadow-[0_0_50px_rgba(192,132,252,0.65)] flex flex-col justify-between p-5 overflow-hidden card-clip"
          >
            <img
              src="/cards/card_epic.png"
              alt="Epic Card Back"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl pointer-events-none scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/75 rounded-3xl pointer-events-none" />

            {/* Top metadata */}
            <div className="relative z-10 flex justify-between items-center text-xs tracking-widest uppercase font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 text-white font-bold">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-purple-400/60 bg-purple-950/80 text-purple-200 text-[10px] font-bold tracking-wider backdrop-blur-sm shadow-[0_0_12px_rgba(192,132,252,0.4)]">
                EPIC
              </span>
            </div>

            {/* Center minimal branding */}
            <div className="relative z-10 text-center my-auto px-2">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-widest text-white block drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                GACHANDUAN
              </span>
              <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-md">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-purple-200 block">
                  EPIC GRADE
                </span>
              </div>
            </div>

            {/* Bottom metadata */}
            <div className="relative z-10 flex justify-between items-center text-[10px] tracking-wider text-zinc-300 font-mono">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">10-CARD PACK</span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">RNG 2026</span>
            </div>
          </div>

          {/* CARD FACE (Setelah dibuka): Menampilkan opsi terpilih dengan aura Epic Ungu */}
          <div
            style={{
              transform: 'rotateY(180deg) translateZ(1px)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-zinc-950 border-2 border-purple-400 shadow-[0_0_60px_rgba(192,132,252,0.7)] flex flex-col justify-between p-5 overflow-hidden card-clip"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top metadata strip */}
            <div className="relative z-10 flex justify-between items-center pb-3 text-xs tracking-widest uppercase font-mono border-b border-purple-500/30 text-purple-300">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>EPIC CARD</span>
              </span>
              <span className="text-zinc-400">#{String(index + 1).padStart(2, '0')}</span>
            </div>

            {/* Main Visual Center: Option text */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 py-6 text-center my-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400/80 mb-2">
                SELECTED CHOICE
              </span>
              <h2
                className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-white uppercase break-words line-clamp-4 leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                title={card.optionName}
              >
                {card.optionName}
              </h2>
            </div>

            {/* Bottom metadata strip: +3 Votes */}
            <div className="relative z-10 pt-3 border-t border-purple-500/30 flex items-center justify-between font-mono text-sm">
              <span className="text-zinc-400 uppercase text-xs tracking-wider">VALUE</span>
              <span className="text-purple-300 font-extrabold tracking-wider px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 shadow-[0_0_15px_rgba(192,132,252,0.4)]">
                +{card.voteValue} VOTES
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Prompt with smooth fade */}
      <div className={`relative z-10 mt-6 text-center transition-all duration-300 ${
        isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <button
          type="button"
          onClick={handleClose}
          className="px-6 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 mx-auto focus:outline-none"
        >
          <span>{isRevealedFully ? 'CONTINUE' : 'REVEAL CARD'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <p className="text-[11px] font-mono text-zinc-400 mt-2">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
};
