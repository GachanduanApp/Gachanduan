import React, { useEffect, useRef } from 'react';
import { GachaCardData, OptionItem, OptionScoreBreakdown } from '../types';
import { GachaCard } from './GachaCard';
import { sound } from '../utils/audio';
import { Eye, RotateCcw } from 'lucide-react';

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
  const revealedCount = cards.filter((c) => c.revealed).length;
  const isAllRevealed = revealedCount === 10;
  const progressPercent = Math.round((revealedCount / 10) * 100);

  // Track sound triggers
  const prevRevealedRef = useRef<number>(revealedCount);

  useEffect(() => {
    if (revealedCount > prevRevealedRef.current) {
      // Find the card that was just revealed
      const newlyRevealed = cards.find((c, i) => c.revealed && !prevCardsRevealed[i]);
      if (newlyRevealed) {
        if (newlyRevealed.rarity === 'EPIC') {
          sound.playEpicReveal();
        } else if (newlyRevealed.rarity === 'RARE') {
          sound.playRareReveal();
        } else {
          sound.playCommonReveal();
        }
      }
    }
    prevRevealedRef.current = revealedCount;
  }, [revealedCount, cards]);

  const prevCardsRevealed = useRef<boolean[]>(cards.map((c) => c.revealed)).current;

  const handleCardClick = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.revealed) return;

    if (card.rarity === 'EPIC') {
      sound.playEpicReveal();
    } else if (card.rarity === 'RARE') {
      sound.playRareReveal();
    } else {
      sound.playCommonReveal();
    }

    onRevealCard(id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Banner / Progress matching Section 25.3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-1">
            THE DECISION GACHA
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            {question || 'What are we deciding?'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Reveal all 10 cards to find out who wins.
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
      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-white h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* LIVE SCORE TALLY STRIP ("Watch the scores") */}
      <div className="mb-8 p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl">
        <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <span>Live Tally</span>
          <span className="text-[11px] text-zinc-400">Updates as cards are flipped</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const currentVotes = liveScores[opt.id] || 0;
            return (
              <div
                key={opt.id}
                className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 flex items-center justify-between"
              >
                <span className="text-xs sm:text-sm font-semibold text-zinc-200 truncate pr-2">
                  {opt.name}
                </span>
                <span className="font-display font-black text-lg text-white tabular-nums">
                  {currentVotes} <span className="text-[10px] text-zinc-400 font-mono">pts</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10 GACHA CARDS BOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card, idx) => (
          <GachaCard
            key={card.id}
            card={card}
            index={idx}
            onReveal={handleCardClick}
          />
        ))}
      </div>

      {/* Hint footer */}
      <p className="text-center text-xs text-zinc-400 font-mono mt-8">
        Click any card to reveal its option and rarity. Common = 1 pt · Rare = 2 pts · Epic = 3 pts
      </p>
    </div>
  );
};
