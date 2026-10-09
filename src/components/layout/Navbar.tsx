import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, History as HistoryIcon, PlusCircle, Menu, X } from 'lucide-react';
import { GameButton } from '../common/GameButton';
import { IconButton } from '../common/IconButton';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  status: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenRules,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAction = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="w-full sticky top-3 z-40 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Main Navbar Pill */}
        <div className="bg-[#0B2A63] border-[3.5px] border-[#071d47] rounded-3xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-[0_6px_0_#06193d] flex items-center justify-between gap-3 backdrop-blur-md">
          {/* Left: Brand Text Logo */}
          <button
            onClick={() => handleAction(onNewDecision)}
            className="group flex items-center focus:outline-none transition-transform hover:scale-105 active:scale-95 text-left shrink-0 cursor-pointer"
            title="GACHANDUAN Home"
          >
            <span className="font-display font-black text-lg sm:text-2xl tracking-wider text-white drop-shadow-[0_2px_0_#051838] leading-none select-none group-hover:text-yellow-200 transition-colors">
              GACHANDUAN
            </span>
          </button>

          {/* Desktop Navigation Links & Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-3">
            <GameButton
              variant="secondary"
              size="sm"
              onClick={onOpenRules}
              className="py-1 px-3 text-xs"
            >
              How it Works
            </GameButton>

            <GameButton
              variant="secondary"
              size="sm"
              onClick={onOpenHistory}
              className="py-1 px-3 text-xs"
            >
              History
            </GameButton>

            <IconButton
              variant="blue"
              size="sm"
              onClick={onToggleSound}
              icon={
                soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-white" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/70" />
                )
              }
              label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            />

            <GameButton
              variant="primary"
              size="sm"
              onClick={onNewDecision}
              icon={<PlusCircle className="w-3.5 h-3.5 text-[#0B2A63]" />}
              className="py-1 px-3.5 text-xs whitespace-nowrap"
            >
              New Decision
            </GameButton>
          </div>

          {/* Mobile Right Controls: Sound Icon + Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <IconButton
              variant="blue"
              size="sm"
              onClick={onToggleSound}
              icon={
                soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-white" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/70" />
                )
              }
              label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            />

            <IconButton
              variant="white"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              icon={
                mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#0B2A63]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#0B2A63]" />
                )
              }
              label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            />
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-3 bg-[#0B2A63] border-[3.5px] border-[#071d47] rounded-3xl shadow-[0_8px_0_#06193d] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* New Decision Action */}
            <GameButton
              variant="primary"
              size="md"
              onClick={() => handleAction(onNewDecision)}
              icon={<PlusCircle className="w-4 h-4 text-[#0B2A63]" />}
              className="w-full py-3 justify-center text-sm shadow-[0_4px_0_#0B2A63]"
            >
              New Decision
            </GameButton>

            {/* How It Works Action */}
            <GameButton
              variant="secondary"
              size="md"
              onClick={() => handleAction(onOpenRules)}
              className="w-full py-2.5 justify-center text-sm shadow-[0_3px_0_#0B2A63]"
            >
              How it Works
            </GameButton>

            {/* History Action */}
            <GameButton
              variant="secondary"
              size="md"
              onClick={() => handleAction(onOpenHistory)}
              className="w-full py-2.5 justify-center text-sm shadow-[0_3px_0_#0B2A63]"
            >
              Decision History
            </GameButton>

            {/* Sound Toggle Row */}
            <button
              type="button"
              onClick={onToggleSound}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#071d47] border-[2px] border-white/20 text-white font-display text-xs font-bold active:translate-y-[1px] transition-transform cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#28D86B]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound Effects</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${soundEnabled ? 'bg-[#28D86B] text-[#0B2A63]' : 'bg-slate-700 text-slate-300'
                  }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
