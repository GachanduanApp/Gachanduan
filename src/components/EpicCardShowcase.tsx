import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GachaCardData } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { GameButton } from './common/GameButton';
import { GachaCard } from './GachaCard';

interface EpicCardShowcaseProps {
  card: GachaCardData;
  index: number;
  onClose: () => void;
}

export const EpicCardShowcase: React.FC<EpicCardShowcaseProps> = ({ card, index, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    sound.playEpicReveal();

    // Initial confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.55 },
      colors: ['#c084fc', '#e879f9', '#a855f7', '#ffffff', '#ffd52e'],
      disableForReducedMotion: true,
      ticks: 100,
      scalar: 0.9,
    });

    // Flip the card after a short suspense delay
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);

      // Huge celebratory confetti shower
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#c084fc', '#e879f9', '#f472b6', '#38bdf8', '#ffd52e', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 180,
        scalar: 1.1,
      });
    }, 600);

    return () => clearTimeout(flipTimer);
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    sound.playClick();
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Epic Card Showcase"
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 select-none overflow-hidden cursor-pointer transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100 bg-[#0B2A63]/85 backdrop-blur-md'
      }`}
    >
      {/* Background Animated Atmosphere Video / Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          src="/animation/animasi_epic_fx.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A63] via-transparent to-[#0B2A63] pointer-events-none" />
      </div>

      {/* Floating cartoon stars / particles */}
      <div className="absolute pointer-events-none w-72 h-72 rounded-full border-4 border-purple-300/40 shadow-[0_0_80px_rgba(217,70,239,0.8)] animate-pulse" />

      {/* Close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        title="Close"
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-2xl bg-white text-[#0B2A63] border-[3px] border-[#0B2A63] shadow-[0_3px_0_#0B2A63] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Top Banner */}
      <div
        className={`relative z-10 text-center mb-5 transition-all duration-300 ${isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#D946EF] to-[#9333EA] border-[3.5px] border-[#0B2A63] text-white font-display font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_6px_0_#0B2A63]">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>EPIC CARD PULL! (+3 VOTES)</span>
        </div>
      </div>

      {/* Centered Large Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 max-w-[85vw] cursor-default transition-all duration-300 ${isClosing ? 'scale-75 opacity-0' : 'scale-100'
          }`}
      >
        <GachaCard
          card={card}
          index={index}
          size="lg"
          isFlipped={isFlipped}
        />
      </div>

      {/* Action CTA Button */}
      <div className="relative z-10 mt-6" onClick={(e) => e.stopPropagation()}>
        <GameButton
          variant="primary"
          size="lg"
          onClick={handleClose}
          icon={<ArrowRight className="w-5 h-5 text-[#0B2A63]" />}
        >
          CONTINUE REVEAL
        </GameButton>
      </div>
    </div>,
    document.body
  );
};
