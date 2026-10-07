import React, { useState } from 'react';
import { OptionItem } from '../types';
import { Plus, Trash2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface DecisionSetupProps {
  question: string;
  setQuestion: (q: string) => void;
  options: OptionItem[];
  setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>;
  onStartRoll: () => void;
}

const PRESETS = [
  {
    name: 'Lunch Spots',
    question: 'Where should we eat today?',
    items: ['Pizza Hut', 'Solaria', 'KFC', 'Subway'],
  },
  {
    name: 'Movie Night',
    question: 'What movie should we watch?',
    items: ['Sci-Fi Thriller', 'Classic Comedy', 'Action Blockbuster', 'Indie Drama'],
  },
  {
    name: 'Weekend Activity',
    question: 'What should we do this weekend?',
    items: ['Board Game Cafe', 'Hiking Trail', 'Museum Exhibition', 'Cinema'],
  },
  {
    name: 'Dinner Cuisine',
    question: 'What cuisine are we getting?',
    items: ['Japanese Ramen', 'Mexican Tacos', 'Italian Pasta', 'Korean BBQ'],
  },
];

export const DecisionSetup: React.FC<DecisionSetupProps> = ({
  question,
  setQuestion,
  options,
  setOptions,
  onStartRoll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddOption = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setErrorMsg('Please enter an option name.');
      return;
    }

    if (options.some((o) => o.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('This option has already been added.');
      return;
    }

    if (options.length >= 10) {
      setErrorMsg('Maximum 10 options allowed in MVP.');
      return;
    }

    setErrorMsg(null);
    setOptions((prev) => [...prev, { id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: trimmed }]);
    setInputValue('');
    sound.playClick();
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setErrorMsg(null);
    sound.playClick();
  };

  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setQuestion(preset.question);
    const newOpts: OptionItem[] = preset.items.map((name, i) => ({
      id: `opt-${Date.now()}-${i}`,
      name,
    }));
    setOptions(newOpts);
    setErrorMsg(null);
    sound.playClick();
  };

  const isValidToRoll = options.length >= 2;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Brand Hero Introduction matching Section 25.1 UX copy */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white mb-3">
          GACHANDUAN
        </h1>
        <p className="text-lg sm:text-xl font-medium text-zinc-300 mb-2">
          Can’t decide? Let RNG decide.
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Add your options, roll the cards, and let luck make the decision.
        </p>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span className="uppercase tracking-wider">Quick Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-3 py-2 text-xs font-medium bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors text-left"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Setup Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        {/* Decision Topic / Question */}
        <div className="mb-6">
          <label htmlFor="decision-question" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            What are we deciding?
          </label>
          <input
            id="decision-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Where should we eat?"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-base font-medium"
          />
        </div>

        {/* Option Input Form */}
        <form onSubmit={handleAddOption} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="option-input" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Options ({options.length}/10)
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">
              Min 2 required
            </span>
          </div>

          <div className="flex gap-2">
            <input
              id="option-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter an option..."
              maxLength={40}
              className="flex-1 px-4 py-3 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-base"
            />
            <button
              type="submit"
              disabled={options.length >= 10 || !inputValue.trim()}
              className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-900 text-white rounded-xl border border-zinc-700 font-medium text-sm flex items-center gap-1.5 transition-colors whitespace-nowrap focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Options List */}
        <div className="space-y-2 mb-8">
          {options.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-zinc-800/80 rounded-xl">
              <p className="text-sm text-zinc-400">No options entered yet.</p>
              <p className="text-xs text-zinc-500 mt-1">
                Type above or pick a quick preset to begin.
              </p>
            </div>
          ) : (
            options.map((opt, idx) => (
              <div
                key={opt.id}
                className="group flex items-center justify-between px-4 py-3 bg-black/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400 w-5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-zinc-100 tracking-wide">
                    {opt.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  aria-label={`Delete option ${opt.name}`}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          disabled={!isValidToRoll}
          onClick={() => {
            sound.playClick();
            onStartRoll();
          }}
          className={`w-full py-4 px-6 rounded-xl font-display font-extrabold text-base tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none ${isValidToRoll
            ? 'bg-white hover:bg-zinc-200 text-black shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 cursor-not-allowed'
            }`}
        >
          <span>ROLL 10 CARDS</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!isValidToRoll && (
          <p className="text-center text-xs text-zinc-400 font-mono mt-3">
            Add at least {2 - options.length} more option{options.length === 1 ? '' : 's'} to roll
          </p>
        )}
      </div>

      {/* Rarity Value Footnote */}
      <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-900">
          <span className="block text-[11px] font-mono text-emerald-400 font-semibold">COMMON</span>
          <span className="text-xs text-zinc-400">1 Vote (70%)</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-900">
          <span className="block text-[11px] font-mono text-blue-400 font-semibold">RARE</span>
          <span className="text-xs text-zinc-400">2 Votes (25%)</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-900">
          <span className="block text-[11px] font-mono text-purple-400 font-bold">EPIC</span>
          <span className="text-xs text-zinc-400">3 Votes (5%)</span>
        </div>
      </div>
    </div>
  );
};
