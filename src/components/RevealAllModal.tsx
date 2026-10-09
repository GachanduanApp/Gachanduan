import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GachaCardData } from '../types';
import { GachaCard } from './GachaCard';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { GameButton } from './common/GameButton';
import { ArrowRight, FastForward } from 'lucide-react';

interface RevealAllModalProps {
  question: string;
  cards: GachaCardData[];
  isOpen: boolean;
  onRevealCard: (cardId: string) => void;
  onComplete: () => void;
}

export const RevealAllModal: React.FC<RevealAllModalProps> = ({
  question,
  cards,
  isOpen,
  onRevealCard,
  onComplete,
}) => {
  const [animatingIndex, setAnimatingIndex] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setAnimatingIndex(-1);
      setIsFinished(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Sound effect on starting summon
    sound.playClick();

    // Find indices of unrevealed cards
    const unrevealedIndices: number[] = [];
    cards.forEach((c, idx) => {
      if (!c.revealed) unrevealedIndices.push(idx);
    });

    if (unrevealedIndices.length === 0) {
      setIsFinished(true);
      return;
    }

    let step = 0;

    const revealNext = () => {
      if (step >= unrevealedIndices.length) {
        // All cards finished revealing
        setIsFinished(true);
        sound.playWinner();

        // Big grand celebration confetti
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FFD52E', '#28D86B', '#2A91FF', '#D946EF', '#ffffff'],
          disableForReducedMotion: true,
          ticks: 140,
        });
        return;
      }

      const cardIdx = unrevealedIndices[step];
      const targetCard = cards[cardIdx];

      setAnimatingIndex(cardIdx);
      onRevealCard(targetCard.id);

      // Play audio & particles according to rarity
      if (targetCard.rarity === 'EPIC') {
        sound.playEpicReveal();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#C026D3', '#E879F9', '#FFD52E', '#ffffff'],
          disableForReducedMotion: true,
          ticks: 90,
        });
      } else if (targetCard.rarity === 'RARE') {
        sound.playRareReveal();
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.5 },
          colors: ['#2A91FF', '#60A5FA', '#ffffff'],
          disableForReducedMotion: true,
          ticks: 70,
        });
      } else {
        sound.playCommonReveal();
      }

      step++;
      timerRef.current = setTimeout(revealNext, 250);
    };

    // Slight initial delay before first card flip
    timerRef.current = setTimeout(revealNext, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const handleSkipAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cards.forEach((c) => {
      if (!c.revealed) onRevealCard(c.id);
    });
    setIsFinished(true);
    sound.playClick();
  };

  if (!isOpen) return null;

  const revealedCount = cards.filter((c) => c.revealed).length;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="10-Card Summon Reveal"
      className="fixed inset-0 z-[100] flex flex-col bg-[#07193b]/95 backdrop-blur-md overflow-y-auto px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 animate-modal-backdrop"
    >
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between animate-modal-enter">
        {/* Top Bar Header */}
        <div className="w-full flex items-center justify-between gap-3 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD52E] text-[#0B2A63] border-[2px] border-[#0B2A63] font-display font-black text-[11px] shadow-[0_2px_0_#0B2A63]">
                10-CARD SUMMON
              </span>
              <span className="text-blue-200 font-extrabold text-xs">
                {revealedCount} / 10 REVEALED
              </span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-2xl text-white drop-shadow-[0_2px_0_#051838] truncate max-w-lg mt-0.5">
              {question || 'Where should we eat?'}
            </h2>
          </div>

          {/* Skip Animation Button */}
          {!isFinished && (
            <button
              type="button"
              onClick={handleSkipAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border-[2px] border-white/30 font-display font-bold text-xs transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Skip Animation</span>
            </button>
          )}
        </div>

        {/* Main 10-Card Grid Showcase */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3.5 w-full justify-items-center">
            {cards.map((card, idx) => {
              const isCurrentlyFlipping = idx === animatingIndex;

              return (
                <div
                  key={card.id}
                  className={`transition-transform duration-200 ${
                    isCurrentlyFlipping ? 'scale-105 z-20' : ''
                  }`}
                >
                  <GachaCard
                    card={card}
                    index={idx}
                    size="md"
                    disabled
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Floating Action Bar */}
        <div className="w-full max-w-md mx-auto pt-4 pb-2 text-center shrink-0">
          {isFinished ? (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-400 text-[#0B2A63] border-[2px] border-[#0B2A63] font-display font-black text-xs shadow-[0_2px_0_#0B2A63]">
                ALL 10 CARDS REVEALED!
              </div>
              <GameButton
                variant="primary"
                size="lg"
                onClick={onComplete}
                icon={<ArrowRight className="w-5 h-5 text-[#0B2A63]" />}
                className="w-full py-3 text-base shadow-[0_5px_0_#0B2A63]"
              >
                SEE FINAL WINNER RESULT
              </GameButton>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0B2A63] border-[2px] border-white/30 text-white font-display font-black text-xs shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD52E] animate-ping" />
              <span>Summoning cards... ({revealedCount}/10)</span>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

