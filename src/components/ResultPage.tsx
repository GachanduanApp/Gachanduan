import React, { useEffect, useState } from 'react';
import { DecisionResult, GachaCardData, OptionItem } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { RotateCcw, Plus, Check, Copy } from 'lucide-react';

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

    // Subtle celebratory confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#a1a1aa', '#60a5fa', '#34d399', '#f472b6'],
      ticks: 150,
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
      `GACHANDUAN Result:`,
      `Topic: ${question || 'What are we deciding?'}`,
      result.isTie
        ? `TIE-BREAKER! ${result.tiedOptionNames.join(' and ')} both scored ${winnerScore} votes.`
        : `Winner: ${winnerOption.name} (${winnerScore} votes)`,
      `Final Decision: ${winnerOption.name}`,
      `Breakdown:`,
      ...options.map((opt) => `- ${opt.name}: ${result.scores[opt.id] || 0} votes (${formatCalculation(opt.id)})`),
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
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Result Card matching Section 14 & 25.4 */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* DECISION MADE or IT'S A TIE Header */}
        {result.isTie ? (
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase mb-3">
              IT’S A TIE!
            </span>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              <span className="text-zinc-200 font-semibold">{result.tiedOptionNames.join(' and ')}</span> both scored{' '}
              <span className="text-white font-mono font-bold">{winnerScore}</span> votes.
            </p>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-3">
              RNG chose...
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2">
              DECISION MADE
            </span>
            {question && (
              <p className="text-xs text-zinc-400 font-medium line-clamp-1 max-w-md mx-auto">
                {question}
              </p>
            )}
          </div>
        )}

        {/* WINNER NAME in prominent, bold typography */}
        <div className="my-4">
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase break-words leading-tight">
            {winnerOption.name}
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="font-display font-black text-xl text-white tabular-nums">
              {winnerScore}
            </span>
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
              {winnerScore === 1 ? 'VOTE' : 'VOTES'}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 italic mt-3 mb-8">
          Luck has spoken.
        </p>

        {/* SCORE BREAKDOWN TABLE */}
        <div className="border-t border-b border-zinc-800/80 py-5 my-6 text-left space-y-3">
          <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-zinc-500 px-1">
            <span>Option</span>
            <span>Calculation</span>
            <span>Total Score</span>
          </div>

          {sortedOptions.map((opt) => {
            const isWinner = opt.id === result.winnerId;
            const score = result.scores[opt.id] || 0;
            const calc = formatCalculation(opt.id);

            return (
              <div
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isWinner
                    ? 'bg-zinc-900/90 border border-zinc-700'
                    : 'bg-black/50 border border-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2 max-w-[40%]">
                  {isWinner && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-semibold truncate ${
                      isWinner ? 'text-white' : 'text-zinc-300'
                    }`}
                  >
                    {opt.name}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-500 text-center hidden sm:block">
                  {calc}
                </div>

                <div className="text-right">
                  <span
                    className={`font-display font-bold text-base tabular-nums ${
                      isWinner ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    {score} <span className="text-[10px] text-zinc-600 font-mono">pts</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 10-Card Recap Strip */}
        <div className="mb-8 text-left">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 px-1">
            Card Distribution (10 Total)
          </span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {cards.map((c, idx) => {
              const borderCol =
                c.rarity === 'EPIC'
                  ? 'border-purple-400 text-purple-300'
                  : c.rarity === 'RARE'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-emerald-500 text-emerald-300';
              return (
                <div
                  key={c.id}
                  title={`${c.optionName} (${c.rarity}, +${c.voteValue})`}
                  className={`p-1.5 rounded-lg bg-black border ${borderCol} text-center`}
                >
                  <span className="block text-[8px] font-mono text-zinc-500">#{idx + 1}</span>
                  <span className="block text-[10px] font-black truncate">{c.optionName.slice(0, 4)}</span>
                  <span className="block text-[8px] font-mono font-bold">+{c.voteValue}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS matching Section 14 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3.5 px-6 rounded-xl font-display font-black text-sm tracking-wider uppercase bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black transition-colors flex items-center justify-center gap-2 focus:outline-none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNewDecision();
            }}
            className="flex-1 py-3.5 px-6 rounded-xl font-display font-bold text-sm tracking-wider uppercase bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white border border-zinc-700 transition-colors flex items-center justify-center gap-2 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>NEW DECISION</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy decision summary"
            className="py-3.5 px-4 rounded-xl font-mono text-xs bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
