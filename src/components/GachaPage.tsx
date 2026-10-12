import React, { useState, useEffect } from 'react';
import { GachaCardData, OptionItem, OptionScoreBreakdown } from '../types';
import { EpicCardShowcase } from './EpicCardShowcase';
import { RevealAllModal } from './RevealAllModal';
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
  onRevealCard: (cardId: string, autoCheck?: boolean) => void;
  onFinishRevealAll: () => void;
  onReset: () => void;
}

export const GachaPage: React.FC<GachaPageProps> = ({
  question,
  cards,
  options,
  liveScores,
  onRevealCard,
  onFinishRevealAll,
  onReset,
}) => {
  // Current active card index on top of the TCG deck (0 to 9)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [discardingCard, setDiscardingCard] = useState<{ card: GachaCardData; index: number } | null>(null);
  const [epicShowcase, setEpicShowcase] = useState<{ card: GachaCardData; index: number } | null>(null);
  const [isRevealAllOpen, setIsRevealAllOpen] = useState<boolean>(false);

  // Check screen width for desktop vs compact mobile deck arrangement
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 640px)');
    const updateMatches = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
    updateMatches(mq);

    const handler = (e: MediaQueryListEvent) => updateMatches(e);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const revealedCount = cards.filter((c) => c.revealed).length;
  const isAllRevealed = revealedCount === 10;
  const progressPercent = Math.round((revealedCount / 10) * 100);

  const currentCard = cards[activeIndex] || cards[0];
  const remainingInDeck = Math.max(0, cards.length - activeIndex - 1);

  // Cards remaining in deck behind active card (showing up to 4 receding background cards like reference)
  const remainingCards = cards.slice(activeIndex + 1);
  const depthCards = remainingCards.slice(0, 4);

  // Depth Carousel Rail configurations (Cards recede into depth to the right on a 3D rail)
  const depthConfigs = isDesktop
    ? [
      { x: 48, scale: 0.92, brightness: 0.86, contrast: 0.98, opacity: 1 },
      { x: 92, scale: 0.84, brightness: 0.72, contrast: 0.96, opacity: 0.95 },
      { x: 130, scale: 0.77, brightness: 0.58, contrast: 0.94, opacity: 0.88 },
      { x: 162, scale: 0.70, brightness: 0.45, contrast: 0.92, opacity: 0.80 },
    ]
    : [
      { x: 26, scale: 0.92, brightness: 0.86, contrast: 0.98, opacity: 1 },
      { x: 48, scale: 0.84, brightness: 0.72, contrast: 0.96, opacity: 0.95 },
      { x: 66, scale: 0.77, brightness: 0.58, contrast: 0.94, opacity: 0.88 },
      { x: 80, scale: 0.70, brightness: 0.45, contrast: 0.92, opacity: 0.80 },
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
    if (activeIndex >= cards.length - 1 || discardingCard) return;

    sound.playClick();
    const prevCard = currentCard;
    const prevIndex = activeIndex;

    // Immediately advance to next card so it is in place sitting face down
    setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
    setDiscardingCard({ card: prevCard, index: prevIndex });

    setTimeout(() => {
      setDiscardingCard(null);
    }, 320);
  };

  // Jump to specific card in collection
  const handleSelectCard = (index: number) => {
    if (index === activeIndex) return;
    sound.playClick();
    setDiscardingCard(null);
    setActiveIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-6 sm:pt-10 pb-8 flex flex-col items-center relative z-10 overflow-x-hidden sm:overflow-x-visible">
      {/* 1. Header Information & Progress Banner */}
      <div className="w-full mb-6">
        <Panel variant="white" className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div className="text-center sm:text-left min-w-0">
              {/* <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block">
                GACHA DECISION PACK
              </span> */}
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#0B2A63] truncate max-w-md">
                {question || 'Where should we eat?'}
              </h2>
            </div>

            {/* Top Control Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-center sm:justify-end">
              {!isAllRevealed && (
                <GameButton
                  variant="cyan"
                  size="sm"
                  onClick={() => setIsRevealAllOpen(true)}
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
              <span>
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
          <span className="uppercase tracking-wider">
            Score Counts
          </span>
          {/* <span className="text-[11px] font-semibold text-blue-100 opacity-90">
            Updates in real-time
          </span> */}
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
                className={`px-3.5 py-2.5 rounded-2xl border-[2.5px] border-[#0B2A63] shadow-[0_3px_0_#0B2A63] flex items-center justify-between gap-2 transition-transform duration-100 ${isLeading
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

      {/* 3. Central Card Stage (Depth Carousel on 3D rail receding to the right) */}
      <div className="relative w-full max-w-sm flex flex-col items-center my-4 sm:my-6">
        {/* Dedicated Card Stack Frame (Exact card dimensions; isolates cards completely from button flow) */}
        <div className="relative w-64 sm:w-72 md:w-80 h-[384px] sm:h-[432px] md:h-[480px]">
          {/* Depth Carousel: Cards recede into depth on a 3D rail to the right, perfectly aligned at baseline */}
          <div className="absolute inset-0 pointer-events-none">
            {depthCards.map((card, i) => {
              const config = depthConfigs[i] || { x: 0, scale: 1, brightness: 1, contrast: 1, opacity: 1 };
              return (
                <div
                  key={card.id}
                  className="absolute inset-0 bg-transparent transition-all duration-300 ease-out pointer-events-none select-none"
                  style={{
                    transform: `translate3d(${config.x}px, 0, 0) scale(${config.scale})`,
                    transformOrigin: 'bottom center',
                    zIndex: 15 - i,
                    filter: `brightness(${config.brightness}) contrast(${config.contrast}) drop-shadow(0 10px 20px rgba(11,42,99,0.35))`,
                    opacity: config.opacity,
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

          {/* Current Active Playable Card & Discard Layer */}
          <div className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-200 ease-out hover:-translate-y-2 hover:drop-shadow-[0_16px_32px_rgba(11,42,99,0.35)] active:translate-y-0.5">
            {/* Discarding Card (previous revealed card swipes out to the left) */}
            {discardingCard && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-card-slide-out-left">
                <GachaCard
                  key={`discard-${discardingCard.card.id}`}
                  card={discardingCard.card}
                  index={discardingCard.index}
                  size="lg"
                  disabled
                />
              </div>
            )}

            {/* Next Playable Card (Stationary on top of deck, face down, no un-flip) */}
            {currentCard && (
              <GachaCard
                key={currentCard.id}
                card={currentCard}
                index={activeIndex}
                onReveal={() => handleRevealCurrent()}
                onNextCard={remainingInDeck > 0 ? handleNextCard : undefined}
                size="lg"
              />
            )}
          </div>
        </div>

        {/* Action Controls clearly positioned below the deck (aligned with center and Card Collection) */}
        <div className="relative z-30 mt-6 sm:mt-8 flex items-center justify-center gap-3 w-full">
          {!currentCard?.revealed ? (
            <GameButton
              variant="primary"
              size="lg"
              onClick={handleRevealCurrent}
              className="py-3 px-8 sm:px-10 text-lg sm:text-xl shadow-[0_5px_0_#0B2A63] hover:scale-102 active:scale-98 transition-transform"
            >
              TAP TO REVEAL
            </GameButton>
          ) : remainingInDeck > 0 ? (
            <GameButton
              variant="cyan"
              size="lg"
              onClick={handleNextCard}
              icon={<ArrowRight className="w-5 h-5 text-[#0B2A63]" />}
              className="py-3 px-8 sm:px-10 text-lg sm:text-xl shadow-[0_5px_0_#0B2A63] hover:scale-102 active:scale-98 transition-transform"
            >
              NEXT CARD ({remainingInDeck} LEFT)
            </GameButton>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] text-[#0B2A63] font-display font-black text-sm sm:text-base">
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
            <span className="text-xs font-black text-[#0B2A63] uppercase tracking-wider">
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
                  className={`flex flex-col items-center justify-between p-1.5 rounded-xl border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63] transition-all cursor-pointer aspect-[3/4] ${isActive ? 'ring-4 ring-[#FFD52E] scale-105 z-10' : 'hover:scale-102'
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

      {/* 10-Card Animated Summon Reveal Modal */}
      <RevealAllModal
        question={question}
        cards={cards}
        isOpen={isRevealAllOpen}
        onRevealCard={(cardId) => onRevealCard(cardId, false)}
        onComplete={() => {
          setIsRevealAllOpen(false);
          onFinishRevealAll();
        }}
      />
    </div>
  );
};
