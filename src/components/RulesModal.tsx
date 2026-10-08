import React from 'react';
import { X, Sparkles, Dices, Layers, Trophy } from 'lucide-react';
import { Badge } from './common/Badge';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2A63]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[3.5px] border-[#0B2A63] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-[0_10px_0_#0B2A63] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-[#F0F6FF] text-[#0B2A63] border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63] flex items-center justify-center hover:bg-slate-100 active:translate-y-[2px] transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5 text-xs font-black tracking-wider text-[#168CF5] uppercase">
          <Sparkles className="w-4 h-4 text-[#168CF5]" />
          <span>Game Rules & Mechanics</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0B2A63] mb-3">
          How GACHANDUAN Works
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-5 leading-relaxed">
          Instead of choosing a winner directly, GACHANDUAN generates exactly 10 cards using two independent random processes. The final winner emerges from weighted card scores!
        </p>

        <div className="space-y-3.5 text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-[#F0F6FF] border-[2.5px] border-[#0B2A63]">
            <div className="flex items-center gap-2 font-display font-black text-[#0B2A63] mb-1">
              <Dices className="w-4 h-4 text-[#168CF5]" />
              <span>1. Uniform Option RNG</span>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              For each of the 10 cards, the system picks one of your candidates with equal probability (1 / N).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-[#F0F6FF] border-[2.5px] border-[#0B2A63]">
            <div className="flex items-center gap-2 font-display font-black text-[#0B2A63] mb-1.5">
              <Layers className="w-4 h-4 text-[#168CF5]" />
              <span>2. Independent Rarity Roll</span>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed mb-3">
              Each card independently receives a rarity grade that sets its voting weight:
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm">
                <Badge rarity="COMMON" size="sm">COMMON</Badge>
                <span className="block text-slate-800 font-display font-black text-xs mt-1">1 Vote</span>
                <span className="text-[10px] font-bold text-slate-500">70% drop</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm">
                <Badge rarity="RARE" size="sm">RARE</Badge>
                <span className="block text-slate-800 font-display font-black text-xs mt-1">2 Votes</span>
                <span className="text-[10px] font-bold text-slate-500">25% drop</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border-[2px] border-[#0B2A63] shadow-sm">
                <Badge rarity="EPIC" size="sm">EPIC</Badge>
                <span className="block text-[#9333EA] font-display font-black text-xs mt-1">3 Votes</span>
                <span className="text-[10px] font-bold text-slate-500">5% drop</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-[#F0F6FF] border-[2.5px] border-[#0B2A63]">
            <div className="flex items-center gap-2 font-display font-black text-[#0B2A63] mb-1">
              <Trophy className="w-4 h-4 text-[#FFD52E]" />
              <span>3. Weighted Winner & RNG Tie Break</span>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Total score is the sum of card votes. If multiple options tie for highest votes, RNG breaks the tie fairly and transparently!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
