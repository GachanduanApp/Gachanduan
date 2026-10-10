import React, { useEffect, useState } from 'react';
import { OptionItem } from '../types';
import { Panel } from './common/Panel';

interface RollingAnimationProps {
  options: OptionItem[];
  onComplete: () => void;
}

export const RollingAnimation: React.FC<RollingAnimationProps> = ({ options, onComplete }) => {
  const [displayText, setDisplayText] = useState<string>(options[0]?.name || 'SHUFFLING');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let count = 0;
    const totalSteps = 12;
    const intervalTime = 70;

    const interval = setInterval(() => {
      count++;
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setDisplayText(randomOption?.name || 'SHUFFLING');
      setProgress(Math.min(100, Math.round((count / totalSteps) * 100)));

      if (count >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [options, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative z-10">
      <Panel variant="white" className="p-8 text-center max-w-sm w-full">
        <span className="inline-block px-3 py-1 rounded-full bg-[#0B2A63] text-white font-display font-black text-xs uppercase tracking-wider mb-4">
          GENERATING 10 CARDS
        </span>

        {/* Dynamic Roulette Name */}
        <div className="h-16 flex items-center justify-center overflow-hidden bg-[#F0F6FF] rounded-2xl border-[2.5px] border-[#0B2A63] my-3 px-4 shadow-inner">
          <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#0B2A63] uppercase truncate animate-pulse">
            {displayText}
          </span>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-full bg-[#E0ECFC] h-4 rounded-full border-[2.5px] border-[#0B2A63] overflow-hidden mt-6 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#FFD52E] to-[#FF9900] h-full rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Panel>
    </div>
  );
};
