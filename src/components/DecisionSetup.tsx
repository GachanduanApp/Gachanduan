import React, { useState } from 'react';
import { OptionItem } from '../types';
import { Plus, Trash2, Dices, Sparkles, AlertCircle, Utensils, Film, Compass, Pizza } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameButton } from './common/GameButton';
import { IconButton } from './common/IconButton';
import { Panel } from './common/Panel';
import { Badge } from './common/Badge';

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
    icon: Utensils,
    question: 'Where should we eat today?',
    items: ['Pizza Hut', 'Solaria', 'KFC', 'Subway'],
  },
  {
    name: 'Movie Night',
    icon: Film,
    question: 'What movie should we watch?',
    items: ['Sci-Fi Thriller', 'Classic Comedy', 'Action Blockbuster', 'Indie Drama'],
  },
  {
    name: 'Weekend Fun',
    icon: Compass,
    question: 'What should we do this weekend?',
    items: ['Board Game Cafe', 'Hiking Trail', 'Museum', 'Cinema'],
  },
  {
    name: 'Dinner Cuisine',
    icon: Pizza,
    question: 'What cuisine are we getting?',
    items: ['Ramen', 'Tacos', 'Pasta', 'Korean BBQ'],
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
    setOptions((prev) => [
      ...prev,
      { id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: trimmed },
    ]);
    setInputValue('');
    sound.playClick();
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setErrorMsg(null);
    sound.playClick();
  };

  const handleLoadPreset = (preset: (typeof PRESETS)[0]) => {
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
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 relative z-10">
      {/* 1. Hero Branding & Tagline matching PDF Section 7 & 25.1 */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block transform hover:scale-105 transition-transform duration-200">
          <img
            src="/assets/logo.png"
            alt="GACHANDUAN"
            className="w-64 sm:w-80 md:w-96 mx-auto h-auto drop-shadow-[0_6px_12px_rgba(11,42,99,0.35)]"
          />
        </div>

        <p className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide mt-2 drop-shadow-[0_2px_4px_#0B2A63]">
          Can’t decide? Let RNG decide.
        </p>
        <p className="text-xs sm:text-sm font-semibold text-blue-100 max-w-md mx-auto mt-1 opacity-90">
          Add your options, roll the 10 gacha cards, and let luck make the decision!
        </p>

        {/* Quick Presets Bar */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-200 mr-1 drop-shadow-sm">
            Quick Packs:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#0B2A63] border-[2.5px] border-[#0B2A63] shadow-[0_3px_0_#0B2A63] active:translate-y-[2px] active:shadow-[0_1px_0_#0B2A63] text-xs font-extrabold transition-all duration-75 cursor-pointer"
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Decision Setup Panel */}
      <Panel variant="white" className="p-5 sm:p-7">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#0B2A63] leading-none">
              DECISION SETUP
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              What are we deciding today?
            </p>
          </div>
          <Badge variant="navy" size="md">
            {options.length} / 10 OPTIONS
          </Badge>
        </div>

        {/* Question Topic Input */}
        <div className="mb-5">
          <label className="block text-xs font-black uppercase tracking-wider text-[#0B2A63] mb-1.5">
            Topic / Question
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Where should we eat?"
              className="w-full px-4 py-3 bg-[#F0F6FF] rounded-2xl border-[3px] border-[#0B2A63] text-[#0B2A63] font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#45C6FF]/40 shadow-inner text-base sm:text-lg"
              maxLength={80}
            />
          </div>
        </div>

        {/* Add Option Form */}
        <div className="mb-5">
          <label className="block text-xs font-black uppercase tracking-wider text-[#0B2A63] mb-1.5">
            Add Options ({options.length}/10)
          </label>
          <form onSubmit={handleAddOption} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Type an option name..."
              className="flex-1 px-4 py-2.5 bg-[#F0F6FF] rounded-2xl border-[3px] border-[#0B2A63] text-[#0B2A63] font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#45C6FF]/40 shadow-inner text-sm sm:text-base"
              maxLength={40}
            />
            <GameButton
              type="submit"
              variant="cyan"
              size="md"
              icon={<Plus className="w-4 h-4 text-[#0B2A63]" />}
              className="whitespace-nowrap"
            >
              Add
            </GameButton>
          </form>

          {/* Validation Feedback */}
          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border-[2px] border-rose-400 text-rose-700 text-xs font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-black uppercase tracking-wider text-[#0B2A63]">
            Current Candidates
          </label>

          {options.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 border-[2px] border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm font-semibold">
              No options added yet. Add at least 2 choices to roll!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1 pb-3.5 max-h-64 overflow-y-auto">
              {options.map((option, idx) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#F0F6FF] border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#0B2A63] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-[#0B2A63] text-sm truncate">
                      {option.name}
                    </span>
                  </div>

                  <IconButton
                    icon={<Trash2 className="w-3.5 h-3.5 text-white" />}
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    label={`Delete ${option.name}`}
                    className="opacity-80 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Roll Button CTA */}
        <div className="pt-2">
          <GameButton
            variant="primary"
            size="xl"
            disabled={!isValidToRoll}
            onClick={onStartRoll}
            icon={<Dices className="w-6 h-6 text-[#0B2A63]" />}
            className="w-full py-4 text-xl sm:text-2xl tracking-wider shadow-[0_6px_0_#0B2A63]"
          >
            ROLL 10 CARDS
          </GameButton>

          {!isValidToRoll && (
            <p className="text-center text-xs font-bold text-rose-500 mt-2">
              ⚠️ Add at least 2 options to begin rolling!
            </p>
          )}
        </div>
      </Panel>

      {/* 3. Rarity Legend Strip (Section 6 & 7 of PDF) */}
      <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-xs font-black text-[#0B2A63] mb-2 px-1">
          <span className="uppercase tracking-wider">
            Card Rarity & Vote Power
          </span>
          <span className="text-[11px] font-bold text-slate-500">10 Cards / Roll</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {/* COMMON */}
          <div className="p-2 rounded-xl bg-[#28D86B]/15 border-[2px] border-[#28D86B] text-[#0B2A63]">
            <Badge rarity="COMMON" size="sm">
              COMMON
            </Badge>
            <div className="font-display font-black text-sm text-[#0B2A63] mt-1">1 VOTE</div>
            <div className="text-[10px] font-bold text-slate-500">70% Drop Rate</div>
          </div>

          {/* RARE */}
          <div className="p-2 rounded-xl bg-[#2A91FF]/15 border-[2px] border-[#2A91FF] text-[#0B2A63]">
            <Badge rarity="RARE" size="sm">
              RARE
            </Badge>
            <div className="font-display font-black text-sm text-[#0B2A63] mt-1">2 VOTES</div>
            <div className="text-[10px] font-bold text-slate-500">25% Drop Rate</div>
          </div>

          {/* EPIC */}
          <div className="p-2 rounded-xl bg-purple-500/15 border-[2px] border-purple-500 text-[#0B2A63]">
            <Badge rarity="EPIC" size="sm">
              EPIC
            </Badge>
            <div className="font-display font-black text-sm text-[#9333EA] mt-1">3 VOTES</div>
            <div className="text-[10px] font-bold text-slate-500">5% Drop Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
