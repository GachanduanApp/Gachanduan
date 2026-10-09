import React from 'react';
import { X, Trash2, History as HistoryIcon, Trophy, Calendar } from 'lucide-react';
import { DecisionHistoryItem } from '../types';
import { Badge } from './common/Badge';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2A63]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[3.5px] border-[#0B2A63] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-6 shadow-[0_10px_0_#0B2A63] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-[#F0F6FF] text-[#0B2A63] border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63] flex items-center justify-center hover:bg-slate-100 active:translate-y-[2px] transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5 text-xs font-black tracking-wider text-[#168CF5] uppercase">
          <span>Local Session Log</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0B2A63]">
            Decision History
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 p-1 pb-3.5 pr-1.5">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-sm border-[2.5px] border-dashed border-slate-300 rounded-2xl">
              No previous decisions logged yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#F0F6FF] border-[2.5px] border-[#0B2A63] shadow-[0_2.5px_0_#0B2A63]"
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h4 className="font-display font-black text-sm text-[#0B2A63] truncate">
                    {item.question}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#FFD52E] shrink-0" />
                    <span className="font-display font-black text-xs text-[#0B2A63] uppercase">
                      {item.winnerName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      ({item.winnerVotes} votes)
                    </span>
                    {item.isTie && (
                      <Badge variant="tie" size="sm">
                        TIE-BREAKER
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-slate-500 shrink-0">
                    <span className="text-emerald-600">{item.cardsSummary.common}C</span>
                    <span>·</span>
                    <span className="text-blue-600">{item.cardsSummary.rare}R</span>
                    <span>·</span>
                    <span className="text-purple-600">{item.cardsSummary.epic}E</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
