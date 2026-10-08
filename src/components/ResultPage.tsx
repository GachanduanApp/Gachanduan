import React, { useEffect, useState } from 'react';
import { DecisionResult, GachaCardData, OptionItem } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { RotateCcw, Plus, Check, Copy, Trophy, Sparkles, Dices, Layers } from 'lucide-react';
import { GameButton } from './common/GameButton';
import { Panel } from './common/Panel';
import { Badge } from './common/Badge';

interface ResultPageProps {
  question: string;
  result: DecisionResult;
  cards: GachaCardData[];
  options: OptionItem[];
  onPlayAgain: () => void;
  onNewDecision: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  question,
  result,
  cards,
  options,
  onPlayAgain,
  onNewDecision,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sound.playWinner();

    // Celebratory confetti blast
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#FFD52E', '#28D86B', '#2A91FF', '#D946EF', '#ffffff'],
      ticks: 160,
      disableForReducedMotion: true,
    });
  }, []);

  const winnerOption = options.find((o) => o.id === result.winnerId) || {
    id: result.winnerId,
    name: result.winnerName,
  };

  const winnerScore = result.scores[result.winnerId] || 0;

  // Format detailed calculation string for an option
  const formatCalculation = (optId: string) => {
    const b = result.breakdown[optId];
    if (!b || b.totalCards === 0) return '0 cards';

    const parts: string[] = [];
    if (b.common > 0) parts.push(`${b.common} × Common`);
    if (b.rare > 0) parts.push(`${b.rare} × Rare`);
    if (b.epic > 0) parts.push(`${b.epic} × Epic`);

    return parts.join(' + ');
  };

  const handleCopy = () => {
    const lines = [
      `🎰 GACHANDUAN Result:`,
      `Topic: ${question || 'What are we deciding?'}`,
      result.isTie
        ? `⚡ IT'S A TIE! ${result.tiedOptionNames.join(' & ')} both scored ${winnerScore} votes. RNG broke the tie!`
        : `🏆 Winner: ${winnerOption.name} (${winnerScore} votes)`,
      `Final Decision: ${winnerOption.name}`,
      `Score Breakdown:`,
      ...options.map(
        (opt) => `- ${opt.name}: ${result.scores[opt.id] || 0} votes (${formatCalculation(opt.id)})`
      ),
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    sound.playClick();
  };

  // Sort options by score descending for the summary list
  const sortedOptions = [...options].sort((a, b) => {
    return (result.scores[b.id] || 0) - (result.scores[a.id] || 0);
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 relative z-10">
      {/* 1. Main Victory / Result Card matching PDF Section 9 & 25.4 */}
      <Panel variant="white" className="p-6 sm:p-10 text-center shadow-[0_12px_0_#0B2A63]">
        {/* Top Trophy / Celebration Badge */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-[#FFE34E] to-[#FFB800] border-[3.5px] border-[#0B2A63] shadow-[0_5px_0_#0B2A63] flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-[#0B2A63]" />
          </div>
        </div>

        {/* Tie Announcement Banner if applicable */}
        {result.isTie ? (
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF4D0] to-[#FFE799] border-[3px] border-[#0B2A63] shadow-[0_3px_0_#0B2A63] animate-in fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2A63] text-white font-display font-black text-xs uppercase tracking-wider mb-2">
              <Dices className="w-3.5 h-3.5 text-[#FFD52E]" />
              IT’S A TIE!
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0B2A63]">
              <span className="font-black underline">{result.tiedOptionNames.join(' and ')}</span> both scored{' '}
              <span className="font-black text-base">{winnerScore}</span> votes!
            </p>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#168CF5] mt-1">
              RNG chose...
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0B2A63] text-white font-display font-black text-xs uppercase tracking-wider mb-2 shadow-sm">
              DECISION MADE
            </span>
            {question && (
              <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-md mx-auto truncate">
                {question}
              </p>
            )}
          </div>
        )}

        {/* WINNER NAME (Prominent, bold typography) */}
        <div className="my-4 py-2">
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#0B2A63] uppercase tracking-tight break-words leading-tight drop-shadow-sm">
            {winnerOption.name}
          </h2>

          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FFE34E] to-[#FFB800] border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63]">
            <span className="font-display font-black text-2xl sm:text-3xl text-[#0B2A63] leading-none">
              {winnerScore}
            </span>
            <span className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#0B2A63]">
              {winnerScore === 1 ? 'TOTAL VOTE' : 'TOTAL VOTES'}
            </span>
          </div>
        </div>

        <p className="font-display font-extrabold text-sm text-[#168CF5] italic mt-1 mb-6">
          Luck has spoken.
        </p>

        {/* 2. Score Breakdown Table (Explains why the winner won) */}
        <div className="border-t-[3px] border-b-[3px] border-[#0B2A63]/20 py-4 my-6 text-left space-y-2">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-[#0B2A63] px-1 mb-2">
            <span>Candidate</span>
            <span>Card Formula</span>
            <span>Final Score</span>
          </div>

          {sortedOptions.map((opt) => {
            const isWinner = opt.id === result.winnerId;
            const score = result.scores[opt.id] || 0;
            const calc = formatCalculation(opt.id);

            return (
              <div
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-2xl border-[2.5px] border-[#0B2A63] transition-all ${
                  isWinner
                    ? 'bg-gradient-to-r from-[#FFF9D6] to-[#FFECA0] shadow-[0_3px_0_#0B2A63] scale-[1.01]'
                    : 'bg-[#F0F6FF]'
                }`}
              >
                <div className="flex items-center gap-2 max-w-[40%]">
                  {isWinner ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                  )}
                  <span
                    className={`font-display font-black text-sm truncate uppercase ${
                      isWinner ? 'text-[#0B2A63]' : 'text-slate-700'
                    }`}
                  >
                    {opt.name}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-500 text-center max-w-[35%] truncate">
                  {calc}
                </div>

                <div className="font-display font-black text-sm text-[#0B2A63] shrink-0">
                  {score} {score === 1 ? 'vote' : 'votes'}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Revealed Cards Breakdown Strip */}
        <div className="mb-6 bg-[#F0F6FF] rounded-2xl border-[2.5px] border-[#0B2A63] p-3 text-left">
          <div className="flex items-center justify-between text-xs font-black text-[#0B2A63] mb-2 px-1">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#168CF5]" />
              Rarity Distribution in this pack
            </span>
          </div>

          <div className="flex items-center justify-around gap-2 text-center text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm flex-1">
              <span className="text-[10px] font-black text-emerald-600 block">COMMON</span>
              <span className="font-display font-black text-sm text-[#0B2A63]">
                {cards.filter((c) => c.rarity === 'COMMON').length}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm flex-1">
              <span className="text-[10px] font-black text-blue-600 block">RARE</span>
              <span className="font-display font-black text-sm text-[#0B2A63]">
                {cards.filter((c) => c.rarity === 'RARE').length}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm flex-1">
              <span className="text-[10px] font-black text-purple-600 block">EPIC</span>
              <span className="font-display font-black text-sm text-[#0B2A63]">
                {cards.filter((c) => c.rarity === 'EPIC').length}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons (Section 9.3 of PDF) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <GameButton
            variant="primary"
            size="lg"
            onClick={onPlayAgain}
            icon={<RotateCcw className="w-5 h-5 text-[#0B2A63]" />}
            className="w-full sm:w-auto px-6 py-3.5 text-base"
          >
            PLAY AGAIN
          </GameButton>

          <GameButton
            variant="secondary"
            size="lg"
            onClick={onNewDecision}
            icon={<Plus className="w-5 h-5 text-[#0B2A63]" />}
            className="w-full sm:w-auto px-6 py-3.5 text-base"
          >
            NEW DECISION
          </GameButton>

          <GameButton
            variant="cyan"
            size="lg"
            onClick={handleCopy}
            icon={
              copied ? (
                <Check className="w-4 h-4 text-emerald-700" />
              ) : (
                <Copy className="w-4 h-4 text-[#0B2A63]" />
              )
            }
            className="w-full sm:w-auto px-4 py-3.5 text-sm"
          >
            {copied ? 'COPIED!' : 'SHARE'}
          </GameButton>
        </div>
      </Panel>
    </div>
  );
};
