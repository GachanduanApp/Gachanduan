import React from 'react';
import { X, Sparkles, Dices, Layers, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-wider text-zinc-500 uppercase">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <span>System Specification</span>
        </div>
        <h2 className="font-display font-black text-2xl text-white mb-4">
          How GACHANDUAN Works
        </h2>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Instead of choosing a winner directly, GACHANDUAN generates exactly 10 cards using two independent random processes. The final winner emerges from the card pack.
        </p>

        <div className="space-y-4 text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800">
            <div className="flex items-center gap-2.5 font-semibold text-white mb-1.5">
              <Dices className="w-4 h-4 text-zinc-400" />
              <span>1. Independent Option Selection</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For each card, the system chooses one of your submitted choices uniformly with equal probability (<code className="text-zinc-300">1 / N</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800">
            <div className="flex items-center gap-2.5 font-semibold text-white mb-1.5">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>2. Independent Rarity Roll</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Every card independently receives a rarity grade that dictates its vote value:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-zinc-950 border border-emerald-500/40">
                <span className="block text-emerald-400 font-bold">COMMON</span>
                <span className="text-zinc-300 font-mono">1 Vote</span>
                <span className="block text-[10px] text-zinc-500">70% drop</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-blue-500/40">
                <span className="block text-blue-400 font-bold">RARE</span>
                <span className="text-zinc-300 font-mono">2 Votes</span>
                <span className="block text-[10px] text-zinc-500">25% drop</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-purple-500/40">
                <span className="block text-purple-400 font-bold">EPIC</span>
                <span className="text-zinc-300 font-mono">3 Votes</span>
                <span className="block text-[10px] text-zinc-500">5% drop</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800">
            <div className="flex items-center gap-2.5 font-semibold text-white mb-1.5">
              <Trophy className="w-4 h-4 text-zinc-400" />
              <span>3. Weighted Voting & Tie Breaks</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Total Score = sum of vote values for all cards belonging to that option. The option that appears most frequently does not always win if another option lands Epics. In case of a tie for highest score, an RNG tie-break picks the victor fairly.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
