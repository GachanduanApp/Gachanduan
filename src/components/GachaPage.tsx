import React, { useState } from 'react';
import { GachaCardData, OptionItem, OptionScoreBreakdown } from '../types';
import { EpicCardShowcase } from './EpicCardShowcase';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Eye, RotateCcw, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface GachaPageProps {
  question: string;
  cards: GachaCardData[];
  options: OptionItem[];
  liveScores: Record<string, number>;
  liveBreakdown: Record<string, OptionScoreBreakdown>;
  onRevealCard: (cardId: string) => void;
  onRevealAll: () => void;
  onReset: () => void;
}

export const GachaPage: React.FC<GachaPageProps> = ({
  question,
  cards,
  options,
  liveScores,
  onRevealCard,
  onRevealAll,
  onReset,
}) => {
  // Current active card index on top of the TCG deck (0 to 9)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSlidingOut, setIsSlidingOut] = useState<boolean>(false);
  const [epicShowcase, setEpicShowcase] = useState<{ card: GachaCardData; index: number } | null>(null);

  const revealedCount = cards.filter((c) => c.revealed).length;
  const isAllRevealed = revealedCount === 10;
  const progressPercent = Math.round((revealedCount / 10) * 100);

  const currentCard = cards[activeIndex] || cards[0];
  const nextCard = activeIndex < cards.length - 1 ? cards[activeIndex + 1] : null;
  const remainingInDeck = Math.max(0, cards.length - activeIndex - 1);

  // Cards remaining in deck behind active card (menampilkan hingga 5 kartu bertumpuk kipas)
  const remainingCards = cards.slice(activeIndex + 1);
  const fanCards = remainingCards.slice(0, 5);

  // Konfigurasi posisi Card Fan: melebar, dinamis, dengan rotasi dan offset simetris
  const fanConfigs = [
    { x: 30, y: 10, rot: 4 },     // Kartu 1 di belakang: sedikit ke kanan (+4 deg)
    { x: -32, y: 16, rot: -5 },   // Kartu 2 di belakang: sedikit ke kiri (-5 deg)
    { x: 58, y: 22, rot: 8 },     // Kartu 3 di belakang: lebih ke kanan (+8 deg)
    { x: -62, y: 28, rot: -9.5 }, // Kartu 4 di belakang: lebih ke kiri (-9.5 deg)
    { x: 86, y: 34, rot: 12 },    // Kartu 5 di belakang: paling kanan (+12 deg)
  ];

  // Reveal the current active card (Hanya 1 kali flip dari tutup ke buka)
  const handleRevealCurrent = (e?: React.MouseEvent) => {
    if (!currentCard || currentCard.revealed) return;

    // If EPIC, open the dramatic centered showcase
    if (currentCard.rarity === 'EPIC') {
      setEpicShowcase({ card: currentCard, index: activeIndex });
      return;
    }

    // Play reveal sound
    if (currentCard.rarity === 'RARE') {
      sound.playRareReveal();
    } else {
      sound.playCommonReveal();
    }

    // Small celebratory confetti burst
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: currentCard.rarity === 'RARE' ? 35 : 20,
        spread: 60,
        origin: { x, y },
        colors: currentCard.rarity === 'RARE' ? ['#60a5fa', '#3b82f6', '#ffffff'] : ['#34d399', '#10b981', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 90,
        scalar: 0.8,
      });
    }

    onRevealCard(currentCard.id);
  };

  // Draw the next card: Kartu aktif bergeser keluar, kartu standby di bawahnya sudah siap dalam posisi tertutup
  const handleNextCard = () => {
    if (activeIndex >= cards.length - 1 || isSlidingOut) return;

    setIsSlidingOut(true);
    sound.playClick();

    setTimeout(() => {
      setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setIsSlidingOut(false);
    }, 240);
  };

  // Klik kartu aktif: jika belum terbuka -> buka. Jika sudah terbuka -> lanjut ke kartu berikutnya
  const handleCardClick = (e: React.MouseEvent) => {
    if (!currentCard.revealed) {
      handleRevealCurrent(e);
    } else if (activeIndex < cards.length - 1) {
      handleNextCard();
    }
  };

  // Close Epic Showcase and mark as revealed
  const handleCloseEpicShowcase = () => {
    if (epicShowcase) {
      const cardId = epicShowcase.card.id;
      setEpicShowcase(null);
      onRevealCard(cardId);
    }
  };

  // Helper for Card Back styling by Rarity
  const getCardBackStyles = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return {
          bgImage: '/cards/card_common.png',
          bgColor: 'bg-emerald-950',
          borderClass: 'border-emerald-500/60 hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.35)]',
          badgeText: 'COMMON',
          badgeClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50',
        };
      case 'RARE':
        return {
          bgImage: '/cards/card_rare.png',
          bgColor: 'bg-sky-950',
          borderClass: 'border-blue-500/70 hover:border-blue-400 hover:shadow-[0_0_22px_rgba(59,130,246,0.35)]',
          badgeText: 'RARE',
          badgeClass: 'text-blue-300 bg-blue-950/80 border-blue-500/50',
        };
      case 'EPIC':
        return {
          bgImage: '/cards/card_epic.png',
          bgColor: 'bg-purple-950',
          borderClass: 'border-purple-400/90 hover:border-purple-300 hover:shadow-[0_0_28px_rgba(192,132,252,0.6)]',
          badgeText: 'EPIC',
          badgeClass: 'text-purple-200 bg-purple-950/80 border-purple-400/60 font-bold',
        };
      default:
        return {
          bgImage: '/cards/card_common.png',
          bgColor: 'bg-zinc-950',
          borderClass: 'border-zinc-700',
          badgeText: 'COMMON',
          badgeClass: 'text-zinc-400 bg-zinc-900 border-zinc-700',
        };
    }
  };

  // Helper for Card Face styling by Rarity
  const getCardFaceStyles = (rarity: string) => {
    switch (rarity) {
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

  const activeBackStyles = getCardBackStyles(currentCard?.rarity || 'COMMON');
  const activeFaceStyles = getCardFaceStyles(currentCard?.rarity || 'COMMON');
  const nextBackStyles = nextCard ? getCardBackStyles(nextCard.rarity) : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Top Banner / Progress Header */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-5 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-1">
            THE DECISION GACHA · TCG PACK OPENING
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            {question || 'What are we deciding?'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Cards are stacked in the deck. Tap each card to draw and reveal!
          </p>
        </div>

        {/* Counter & Action Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-mono text-zinc-500 block">CARDS REVEALED</span>
            <span className="font-display font-black text-2xl text-white tabular-nums">
              {revealedCount} <span className="text-zinc-600 text-lg">/ 10</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAllRevealed && (
              <button
                type="button"
                onClick={onRevealAll}
                className="px-3.5 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal All</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              title="Reset decision"
              className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-lg transition-colors focus:outline-none"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-white h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Live Tally Score Bar */}
      <div className="w-full mb-6 p-3 sm:p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl">
        <div className="flex items-center justify-between mb-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Live Tally</span>
          </span>
          <span className="text-[11px] text-zinc-400">Updates as cards are flipped</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const currentVotes = liveScores[opt.id] || 0;
            return (
              <div
                key={opt.id}
                className="p-2.5 sm:p-3 rounded-lg bg-black/60 border border-zinc-800/80 flex items-center justify-between"
              >
                <span className="text-xs sm:text-sm font-semibold text-zinc-200 truncate pr-2">
                  {opt.name}
                </span>
                <span className="font-display font-black text-base sm:text-lg text-white tabular-nums">
                  {currentVotes} <span className="text-[10px] text-zinc-400 font-mono">pts</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER TCG STACK ARENA */}
      <div className="w-full flex flex-col items-center justify-center my-2 sm:my-4">
        {/* Deck Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            CARD #{activeIndex + 1} OF 10 ·{' '}
            <strong className="text-white">{remainingInDeck}</strong> REMAINING IN DECK
          </span>
        </div>

        {/* 3D Stack Container: Card Fan Spread ("numpuk card fan tapi agak dilebarin") */}
        <div className="relative w-64 sm:w-72 md:w-80 card-aspect flex items-center justify-center select-none perspective-1000 [--fan-scale:0.75] sm:[--fan-scale:1]">
          {/* SISA DECK PALING BAWAH (Base deck thickness jika sisa > 5, dengan sudut membulat rapi tanpa sudut lancip) */}
          {remainingInDeck > fanCards.length && (
            <div
              style={{
                transform: 'translate3d(0, 26px, 0) scale(0.96)',
                zIndex: 12,
              }}
              className="absolute inset-0 w-full h-full card-aspect rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl pointer-events-none overflow-hidden card-clip"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80" />
              <div className="relative z-10 w-full h-full flex items-end justify-center pb-2.5">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  +{remainingInDeck - fanCards.length} MORE IN DECK
                </span>
              </div>
            </div>
          )}

          {/* KARTU TUMPUKAN KIPAS (CARD FAN - Melebar simetris, rounded sempurna di tiap kartu) */}
          {fanCards.map((fanCard, fanIdx) => {
            const styles = getCardBackStyles(fanCard.rarity);
            const isImmediateNext = fanIdx === 0;
            const cfg = fanConfigs[fanIdx] || { x: 0, y: (fanIdx + 1) * 8, rot: 0 };
            const cardNum = activeIndex + fanIdx + 2;

            return (
              <div
                key={`fan-card-${fanCard.id}`}
                onClick={() => {
                  if (currentCard.revealed && isImmediateNext) {
                    handleNextCard();
                  }
                }}
                style={{
                  zIndex: 25 - fanIdx,
                  transform: `translate3d(calc(${cfg.x}px * var(--fan-scale, 1)), ${cfg.y}px, 0) rotate(${cfg.rot}deg)`,
                }}
                className={`absolute inset-0 w-full h-full card-aspect rounded-2xl shadow-xl transition-all duration-300 ease-out select-none card-clip ${
                  styles.bgColor
                } ${
                  currentCard.revealed && isImmediateNext
                    ? 'cursor-pointer pointer-events-auto hover:brightness-110'
                    : 'pointer-events-none'
                }`}
              >
                <div
                  className={`w-full h-full rounded-2xl border flex flex-col justify-between p-3.5 sm:p-4 overflow-hidden relative ${styles.borderClass}`}
                >
                  {/* Background Rarity Graphic */}
                  <img
                    src={styles.bgImage}
                    alt={`Deck card #${cardNum}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75 rounded-2xl pointer-events-none" />

                  {/* Top metadata strip */}
                  <div className="relative z-10 flex justify-between items-center text-[10px] tracking-widest uppercase font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-white font-bold backdrop-blur-sm">
                      #{String(cardNum).padStart(2, '0')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-wider backdrop-blur-sm ${styles.badgeClass}`}
                    >
                      {styles.badgeText}
                    </span>
                  </div>

                  {/* Center branding */}
                  <div className="relative z-10 text-center my-auto px-1">
                    <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-white block drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      GACHANDUAN
                    </span>
                    {isImmediateNext && (
                      <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-300 block">
                          NEXT IN DECK
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom metadata */}
                  <div className="relative z-10 flex justify-between items-center text-[9px] tracking-wider text-zinc-300 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">10-CARD PACK</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">RNG 2026</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ACTIVE TOP CARD (Hanya flip 1 kali dari tutup ke buka) */}
          {currentCard && (
            <div
              key={`active-card-${currentCard.id}`}
              role="button"
              tabIndex={0}
              aria-label={`Card ${activeIndex + 1}, ${currentCard.revealed ? currentCard.optionName : 'tap to reveal'}`}
              onClick={handleCardClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(e as unknown as React.MouseEvent);
                }
              }}
              style={{ zIndex: 35 }}
              className={`absolute inset-0 w-full h-full card-aspect rounded-2xl perspective-1000 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 ${
                isSlidingOut
                  ? 'animate-card-slide-out pointer-events-none'
                  : currentCard.revealed
                  ? 'hover:scale-[1.01] active:scale-[0.99]'
                  : currentCard.rarity === 'EPIC'
                  ? 'epic-card-idle hover:-translate-y-3 hover:scale-[1.04] active:scale-95'
                  : 'hover:-translate-y-2 hover:scale-[1.03] active:scale-95'
              }`}
            >
              <div
                className={`relative w-full h-full rounded-2xl duration-500 transform-style-3d transition-transform ease-out ${
                  currentCard.revealed ? 'rotate-y-180' : ''
                }`}
              >
                {/* ACTIVE CARD BACK (Sebelum dibuka): Rounded radius bersih tanpa sudut hitam/lancip */}
                <div
                  style={{
                    transform: 'translateZ(1px)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                  className={`absolute inset-0 w-full h-full rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4 shadow-2xl card-clip ${activeBackStyles.bgColor} ${activeBackStyles.borderClass}`}
                >
                  <img
                    src={activeBackStyles.bgImage}
                    alt={`${currentCard.rarity} card back`}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none select-none transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75 rounded-2xl pointer-events-none" />

                  {/* Top metadata strip */}
                  <div className="relative z-10 flex justify-between items-center text-[10px] tracking-widest uppercase font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-white font-bold">
                      #{String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-wider backdrop-blur-sm ${activeBackStyles.badgeClass}`}
                    >
                      {activeBackStyles.badgeText}
                    </span>
                  </div>

                  {/* Center branding */}
                  <div className="relative z-10 text-center my-auto px-1">
                    <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-white block drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      GACHANDUAN
                    </span>
                    <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 transition-all shadow-md">
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

                {/* ACTIVE CARD FACE (Setelah dibuka) */}
                <div
                  style={{
                    transform: 'rotateY(180deg) translateZ(1px)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                  className={`absolute inset-0 w-full h-full rounded-2xl bg-zinc-950 flex flex-col justify-between p-4 shadow-2xl card-clip ${
                    activeFaceStyles.containerClass
                  }`}
                >
                  {/* Top metadata strip */}
                  <div
                    className={`flex justify-between items-center pb-2 text-[11px] tracking-widest uppercase font-mono ${activeFaceStyles.badgeClass}`}
                  >
                    <span className="font-bold">{currentCard.rarity}</span>
                    <span className="text-zinc-500">#{String(activeIndex + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Main Visual Center: Option text */}
                  <div className="flex-1 flex items-center justify-center px-2 py-4 text-center my-auto">
                    <h3
                      className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-white uppercase break-words line-clamp-4 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      title={currentCard.optionName}
                    >
                      {currentCard.optionName}
                    </h3>
                  </div>

                  {/* Bottom metadata strip: Vote value */}
                  <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-wider">VALUE</span>
                    <span className={`tracking-wider ${activeFaceStyles.voteClass}`}>
                      +{currentCard.voteValue} {currentCard.voteValue === 1 ? 'VOTE' : 'VOTES'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLLER ACTION BUTTON (Below the Center Stack) */}
        <div className="mt-7 flex flex-col items-center gap-2">
          {!currentCard?.revealed ? (
            <button
              type="button"
              onClick={handleRevealCurrent}
              className="py-3 px-8 rounded-xl font-display font-extrabold text-sm tracking-wider uppercase bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 focus:outline-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>REVEAL CARD #{activeIndex + 1}</span>
            </button>
          ) : activeIndex < cards.length - 1 ? (
            <button
              type="button"
              onClick={handleNextCard}
              className="py-3 px-8 rounded-xl font-display font-bold text-sm tracking-wider uppercase bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white border border-zinc-700 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 focus:outline-none"
            >
              <span>NEXT CARD ({remainingInDeck} LEFT)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="py-2.5 px-6 rounded-xl font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALL 10 CARDS REVEALED · CALCULATING WINNER...</span>
            </div>
          )}

          <p className="text-[11px] font-mono text-zinc-400">
            {currentCard?.revealed
              ? 'Click the card or Next button to draw the next card'
              : 'Click the card or Reveal button to flip'}
          </p>
        </div>
      </div>

      {/* REVEALED CARDS TRAY / SHELF (Bottom Horizontal Shelf) */}
      <div className="w-full mt-8 pt-6 border-t border-zinc-900">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Revealed Cards Collection ({revealedCount}/10)
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">Click card below to inspect</span>
        </div>

        {/* 10 Mini Card Slots */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {cards.map((c, idx) => {
            const isRevealed = c.revealed;
            const isCurrent = idx === activeIndex;
            const borderCol =
              c.rarity === 'EPIC'
                ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                : c.rarity === 'RARE'
                ? 'border-blue-500 text-blue-300 bg-blue-950/30'
                : 'border-emerald-500 text-emerald-300 bg-emerald-950/30';

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  sound.playClick();
                }}
                title={
                  isRevealed
                    ? `${c.optionName} (${c.rarity}, +${c.voteValue})`
                    : `Card #${idx + 1} (Unrevealed)`
                }
                className={`relative p-2 rounded-xl text-center card-aspect transition-all flex flex-col justify-between ${
                  isCurrent ? 'ring-2 ring-white scale-[1.04]' : 'opacity-85 hover:opacity-100'
                } ${
                  isRevealed
                    ? `border ${borderCol} shadow-sm`
                    : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-700'
                }`}
              >
                {/* Index tag */}
                <span className="block text-[8px] font-mono text-zinc-400 text-left">
                  #{idx + 1}
                </span>

                {/* Center content */}
                <div className="my-auto py-1">
                  {isRevealed ? (
                    <span className="block text-[10px] font-black uppercase text-white truncate leading-tight">
                      {c.optionName}
                    </span>
                  ) : (
                    <span className="block text-[9px] font-mono text-zinc-400">
                      ?
                    </span>
                  )}
                </div>

                {/* Bottom vote / status */}
                <div className="text-[8px] font-mono">
                  {isRevealed ? (
                    <span className="font-bold">+{c.voteValue}</span>
                  ) : (
                    <span className="text-zinc-400">LOCK</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epic Showcase Modal Overlay (When Epic is Opened) */}
      {epicShowcase && (
        <EpicCardShowcase
          card={epicShowcase.card}
          index={epicShowcase.index}
          onClose={handleCloseEpicShowcase}
        />
      )}
    </div>
  );
};
