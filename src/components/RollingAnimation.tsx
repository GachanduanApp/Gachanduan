import React, { useEffect, useState } from 'react';
import { OptionItem } from '../types';

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

      if (count > 7) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [options, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="relative p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center max-w-sm w-full shadow-2xl">
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase block mb-3">
          GENERATING 10 CARDS
        </span>

        <div className="h-14 flex items-center justify-center overflow-hidden">
          <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white uppercase animate-pulse">
            {displayText}
          </span>
        </div>

        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-6">
          <div className="bg-white h-full animate-[shimmer_0.6s_ease-in-out_infinite]" style={{ width: '100%' }} />
        </div>

        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-4">
          INDEPENDENT RNG ROLL
        </p>
      </div>
    </div>
  );
};
