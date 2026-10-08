import React, { useEffect, useState } from 'react';
import { OptionItem } from '../types';
import { Panel } from './common/Panel';
import { Sparkles, Dices } from 'lucide-react';

interface RollingAnimationProps {
  options: OptionItem[];
  onComplete: () => void;
}

export const RollingAnimation: React.FC<RollingAnimationProps> = ({ options, onComplete }) => {
  const [displayText, setDisplayText] = useState<string>(options[0]?.name || 'SHUFFLING');

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setDisplayText(randomOption?.name || 'SHUFFLING');

      if (count > 9) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 180);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [options, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative z-10">
      <Panel variant="white" className="p-8 text-center max-w-sm w-full">
        {/* Animated Card Icon / Shuffler */}
        <div className="w-20 h-24 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFE34E] to-[#FFB800] rounded-2xl border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] -rotate-6 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#55DCFF] to-[#1EA7FD] rounded-2xl border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] rotate-6 animate-bounce" />
          <div className="relative z-10">
            <Dices className="w-10 h-10 text-[#0B2A63]" />
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-[#0B2A63] text-white font-display font-black text-xs uppercase tracking-wider mb-3">
          GENERATING 10 CARDS
        </span>

        {/* Dynamic Roulette Name */}
        <div className="h-14 flex items-center justify-center overflow-hidden bg-[#F0F6FF] rounded-2xl border-[2.5px] border-[#0B2A63] my-2 px-3 shadow-inner">
          <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#0B2A63] uppercase truncate animate-pulse">
            {displayText}
          </span>
        </div>

        {/* Chunky Cartoon Progress bar */}
        <div className="w-full bg-[#E0ECFC] h-3.5 rounded-full border-[2.5px] border-[#0B2A63] overflow-hidden mt-5 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#FFD52E] to-[#FF9900] h-full rounded-full animate-pulse transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>

        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mt-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#168CF5]" />
          Independent Random Selection
        </p>
      </Panel>
    </div>
  );
};
