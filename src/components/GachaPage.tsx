import React, { useState } from 'react';
import { GachaCardData, OptionItem, OptionScoreBreakdown } from '../types';
import { EpicCardShowcase } from './EpicCardShowcase';
import { GachaCard } from './GachaCard';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Eye, RotateCcw, ArrowRight, Sparkles, Layers, CheckCircle } from 'lucide-react';
import { GameButton } from './common/GameButton';
import { Panel } from './common/Panel';
import { Badge } from './common/Badge';

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
  const remainingInDeck = Math.max(0, cards.length - activeIndex - 1);

  // Cards remaining in deck behind active card (showing up to 4 fanned cards)
  const remainingCards = cards.slice(activeIndex + 1);
  const fanCards = remainingCards.slice(0, 4);

  const fanConfigs = [
    { x: 18, y: 8, rot: 3 },
    { x: -20, y: 12, rot: -4 },
    { x: 34, y: 16, rot: 6 },
    { x: -38, y: 20, rot: -7 },
  ];

  // Reveal the current active card
  const handleRevealCurrent = () => {
    if (!currentCard || currentCard.revealed) return;

    // If EPIC, open the dramatic showcase modal
    if (currentCard.rarity === 'EPIC') {
      setEpicShowcase({ card: currentCard, index: activeIndex });
      onRevealCard(currentCard.id);
      return;
    }

    // Play sound based on rarity
    if (currentCard.rarity === 'RARE') {
      sound.playRareReveal();
    } else {
      sound.playCommonReveal();
    }

    confetti({
      particleCount: currentCard.rarity === 'RARE' ? 35 : 20,
      spread: 60,
      origin: { y: 0.5 },
      colors:
        currentCard.rarity === 'RARE'
          ? ['#2A91FF', '#45C6FF', '#ffffff']
          : ['#28D86B', '#34d399', '#ffffff'],
      disableForReducedMotion: true,
      ticks: 90,
      scalar: 0.8,
    });

    onRevealCard(currentCard.id);
  };

  // Next card in deck
  const handleNextCard = () => {
    if (activeIndex >= cards.length - 1 || isSlidingOut) return;

    setIsSlidingOut(true);
    sound.playClick();

    setTimeout(() => {
      setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
      setIsSlidingOut(false);
    }, 220);
  };

  // Jump to specific card in collection
  const handleSelectCard = (index: number) => {
    if (index === activeIndex) return;
    sound.playClick();
    setActiveIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center relative z-10">
      {/* 1. Header Information & Progress Banner */}
      <div className="w-full mb-4">
        <Panel variant="white" className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block">
                GACHA DECISION PACK
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#0B2A63] truncate max-w-md">
                {question || 'Where should we eat?'}
              </h2>
            </div>

            {/* Top Control Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              {!isAllRevealed && (
                <GameButton
                  variant="cyan"
                  size="sm"
                  onClick={onRevealAll}
                  icon={<Eye className="w-3.5 h-3.5 text-[#0B2A63]" />}
                >
                  Reveal All
                </GameButton>
              )}
              <GameButton
                variant="secondary"
                size="sm"
                onClick={onReset}
                icon={<RotateCcw className="w-3.5 h-3.5 text-[#0B2A63]" />}
              >
                Reset
              </GameButton>
            </div>
          </div>

          {/* Chunky Cartoon Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0B2A63] mb-1.5 px-0.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#168CF5]" />
                CARDS REVEALED: {revealedCount} / 10
              </span>
              <span>{progressPercent}%</span>
            </div>

            <div className="w-full bg-[#E0ECFC] h-3.5 rounded-full border-[2.5px] border-[#0B2A63] overflow-hidden p-0.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-[#55DCFF] via-[#FFD52E] to-[#FF9900] h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* 2. Live Score Tally (Section 8.3 of PDF) */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-black text-white px-2 mb-2 drop-shadow-[0_1px_2px_#0B2A63]">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD52E]" />
            Live Weighted Tally
          </span>
          <span className="text-[11px] font-semibold text-blue-100 opacity-90">
            Updates in real-time
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {options.map((opt) => {
            const score = liveScores[opt.id] || 0;
            const isLeading =
              score > 0 &&
              score === Math.max(...Object.values(liveScores));

            return (
              <div
                key={opt.id}
                className={`px-3.5 py-2.5 rounded-2xl border-[2.5px] border-[#0B2A63] shadow-[0_3px_0_#0B2A63] flex items-center justify-between gap-2 transition-transform duration-100 ${
                  isLeading
                    ? 'bg-gradient-to-b from-[#FFF9D6] to-[#FFE875]'
                    : 'bg-white/95'
                }`}
              >
                <div className="min-w-0">
                  <span className="font-display font-extrabold text-xs sm:text-sm text-[#0B2A63] truncate block">
                    {opt.name}
                  </span>
                </div>
                <div className="inline-flex items-center px-2 py-0.5 rounded-xl bg-[#0B2A63] text-white font-display font-black text-xs shrink-0">
                  {score} {score === 1 ? 'pt' : 'pts'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Central Card Stage (Section 8.2 of PDF) */}
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center my-3 sm:my-6 min-h-[440px] sm:min-h-[500px]">
        {/* Fan / Stack of cards behind active card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {fanCards.map((card, i) => {
            const config = fanConfigs[i] || { x: 0, y: 0, rot: 0 };
            return (
              <div
                key={card.id}
                className="absolute w-64 sm:w-72 md:w-80 h-[384px] sm:h-[432px] md:h-[480px] bg-transparent drop-shadow-[0_10px_20px_rgba(11,42,99,0.35)] transition-all duration-300 pointer-events-none"
                style={{
                  transform: `translate(${config.x}px, ${config.y}px) rotate(${config.rot}deg)`,
                  zIndex: 5 - i,
                  opacity: 0.9 - i * 0.15,
                }}
              >
                <img
                  src={
                    card.rarity === 'EPIC'
                      ? '/assets/epicBack.png'
                      : card.rarity === 'RARE'
                      ? '/assets/rareBack.png'
                      : '/assets/commonBack.png'
                  }
                  alt=""
                  className="w-full h-full object-contain select-none pointer-events-none"
                />
              </div>
            );
          })}
        </div>

        {/* Current Active Playable Card */}
        <div
          className={`relative z-20 transition-transform duration-200 ${
            isSlidingOut ? 'translate-x-full opacity-0 rotate-12' : ''
          }`}
        >
          {currentCard && (
            <GachaCard
              card={currentCard}
              index={activeIndex}
              onReveal={() => handleRevealCurrent()}
              size="lg"
            />
          )}
        </div>

        {/* Action Controls directly below active card */}
        <div className="relative z-30 mt-6 flex items-center gap-3">
          {!currentCard?.revealed ? (
            <GameButton
              variant="primary"
              size="lg"
              onClick={handleRevealCurrent}
              icon={<Sparkles className="w-5 h-5 text-[#0B2A63]" />}
              className="py-3 px-8 text-lg shadow-[0_5px_0_#0B2A63]"
            >
              TAP TO REVEAL
            </GameButton>
          ) : remainingInDeck > 0 ? (
            <GameButton
              variant="cyan"
              size="lg"
              onClick={handleNextCard}
              icon={<ArrowRight className="w-5 h-5 text-[#0B2A63]" />}
              className="py-3 px-8 text-lg shadow-[0_5px_0_#0B2A63]"
            >
              NEXT CARD ({remainingInDeck} LEFT)
            </GameButton>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] text-[#0B2A63] font-display font-black text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>ALL 10 CARDS REVEALED!</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Revealed Card Collection Strip (Section 8.4 of PDF) */}
      <div className="w-full mt-4">
        <Panel variant="white" className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-black text-[#0B2A63] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#168CF5]" />
              Card Collection (10 Slots)
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Active: #{activeIndex + 1}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 overflow-x-auto p-2 pb-4">
            {cards.map((card, idx) => {
              const isActive = idx === activeIndex;
              const isRevealed = card.revealed;

              // Border and background styling based on rarity
              const rarityBorder = isRevealed
                ? card.rarity === 'EPIC'
                  ? 'border-purple-500 bg-purple-50'
                  : card.rarity === 'RARE'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-emerald-500 bg-emerald-50'
                : 'border-slate-300 bg-slate-100';

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(idx)}
                  className={`flex flex-col items-center justify-between p-1.5 rounded-xl border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63] transition-all cursor-pointer aspect-[3/4] ${
                    isActive ? 'ring-4 ring-[#FFD52E] scale-105 z-10' : 'hover:scale-102'
                  } ${rarityBorder}`}
                  title={`Card #${idx + 1}: ${isRevealed ? card.optionName : 'Hidden'}`}
                >
                  <span className="text-[10px] font-black text-[#0B2A63]">
                    #{idx + 1}
                  </span>

                  <div className="my-auto text-center px-0.5 w-full">
                    {isRevealed ? (
                      <span className="font-extrabold text-[10px] sm:text-[11px] text-[#0B2A63] line-clamp-2 leading-tight uppercase">
                        {card.optionName}
                      </span>
                    ) : (
                      <div className="w-4 h-5 mx-auto bg-[#0B2A63] rounded border border-white/60 opacity-60" />
                    )}
                  </div>

                  {isRevealed ? (
                    <Badge rarity={card.rarity} size="sm" className="w-full text-[8px] py-0">
                      +{card.voteValue}
                    </Badge>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400">?</span>
                  )}
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Epic Showcase Modal */}
      {epicShowcase && (
        <EpicCardShowcase
          card={epicShowcase.card}
          index={epicShowcase.index}
          onClose={() => setEpicShowcase(null)}
        />
      )}
    </div>
  );
};
