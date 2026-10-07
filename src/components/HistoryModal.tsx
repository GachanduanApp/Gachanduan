import React from 'react';
import { X, Trash2, History as HistoryIcon } from 'lucide-react';
import { DecisionHistoryItem } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-wider text-zinc-500 uppercase">
          <HistoryIcon className="w-4 h-4 text-zinc-400" />
          <span>Local Session Log</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-2xl text-white">
            Decision History
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm border border-dashed border-zinc-850 rounded-xl">
              No previous decisions logged yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-black border border-zinc-850 hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-xs font-medium text-zinc-400 truncate max-w-[70%]">
                    {item.question || 'Undocumented decision'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">WINNER</span>
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {item.winnerName}
                    </span>
                    {item.isTie && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        TIE-BREAK
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {item.winnerVotes} votes
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-900 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
