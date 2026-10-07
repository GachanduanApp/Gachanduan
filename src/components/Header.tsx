import React from 'react';
import { Volume2, VolumeX, Sparkles, History as HistoryIcon } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  status: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenRules,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onNewDecision}
          className="text-left group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-display font-black text-xl tracking-wider text-white group-hover:text-zinc-300 transition-colors">
            GACHANDUAN
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-zinc-400">
          <button
            onClick={onOpenRules}
            className="hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>How it Works</span>
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            className="p-2 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 transition-colors focus:outline-none"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-zinc-200" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-600" />
            )}
          </button>
          <button
            onClick={onNewDecision}
            className="px-3.5 py-1.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 active:bg-zinc-300 transition-colors whitespace-nowrap focus:outline-none"
          >
            New Decision
          </button>
        </div>
      </div>
    </header>
  );
};
