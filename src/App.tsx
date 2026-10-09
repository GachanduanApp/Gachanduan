/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OptionItem, GachaCardData, GameStatus, DecisionResult, DecisionHistoryItem } from './types';
import { generateCards, calculateScores, determineWinner } from './utils/rng';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { DecisionSetup } from './components/DecisionSetup';
import { RollingAnimation } from './components/RollingAnimation';
import { GachaPage } from './components/GachaPage';
import { ResultPage } from './components/ResultPage';
import { RulesModal } from './components/RulesModal';
import { HistoryModal } from './components/HistoryModal';
import { PageBackground } from './components/layout/PageBackground';

export default function App() {
  // Decision topic & submitted options (Defaulting to the canonical documentation example)
  const [question, setQuestion] = useState('Where should we eat?');
  const [options, setOptions] = useState<OptionItem[]>([
    { id: 'opt-1', name: 'Pizza Hut' },
    { id: 'opt-2', name: 'Solaria' },
    { id: 'opt-3', name: 'KFC' },
  ]);

  // Game state
  const [gameStatus, setGameStatus] = useState<GameStatus>('SETUP');
  const [cards, setCards] = useState<GachaCardData[]>([]);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);

  // Modals & Sound
  const [rulesOpen, setRulesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [history, setHistory] = useState<DecisionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gachanduan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('gachanduan_history', JSON.stringify(history));
    } catch {
      // Local storage issue
    }
  }, [history]);

  // Live tally calculations based on revealed cards
  const liveTally = calculateScores(options, cards, true);

  // Start Roll action
  const handleStartRoll = () => {
    if (options.length < 2) return;
    setGameStatus('ROLLING');
  };

  // After rolling animation completes, generate cards and go to REVEALING
  const handleRollingComplete = () => {
    const generated = generateCards(options);
    setCards(generated);
    setDecisionResult(null);
    setGameStatus('REVEALING');
  };

  // Reveal a card (autoCheck determines if it should trigger auto-transition on 10th card)
  const handleRevealCard = (cardId: string, autoCheck: boolean = true) => {
    setCards((prev) => {
      const next = prev.map((c) => (c.id === cardId ? { ...c, revealed: true } : c));
      if (autoCheck) {
        checkCompletion(next);
      }
      return next;
    });
  };

  // Finalize scores, winner, and save history before transitioning to RESULT
  const finalizeResult = (currentCards: GachaCardData[]) => {
    const finalCalculation = calculateScores(options, currentCards, false);
    const result = determineWinner(options, finalCalculation.scores, finalCalculation.breakdown);

    setDecisionResult(result);

    // Save to session history
    const historyEntry: DecisionHistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: Date.now(),
      question,
      winnerName: result.winnerName,
      winnerVotes: result.scores[result.winnerId] || 0,
      isTie: result.isTie,
      tiedNames: result.tiedOptionNames,
      options: options.map((o) => o.name),
      cardsSummary: {
        common: currentCards.filter((c) => c.rarity === 'COMMON').length,
        rare: currentCards.filter((c) => c.rarity === 'RARE').length,
        epic: currentCards.filter((c) => c.rarity === 'EPIC').length,
      },
    };

    setHistory((prev) => [historyEntry, ...prev].slice(0, 20));
    setGameStatus('RESULT');
  };

  // Check if all 10 cards are revealed manually, then transition to RESULT with suspense delay
  const checkCompletion = (currentCards: GachaCardData[]) => {
    const revealedCount = currentCards.filter((c) => c.revealed).length;
    if (revealedCount === 10) {
      setTimeout(() => {
        finalizeResult(currentCards);
      }, 1800);
    }
  };

  // Reset to setup
  const handleNewDecision = () => {
    sound.playClick();
    setGameStatus('SETUP');
    setCards([]);
    setDecisionResult(null);
  };

  // Play again with same options
  const handlePlayAgain = () => {
    sound.playClick();
    setGameStatus('ROLLING');
    setCards([]);
    setDecisionResult(null);
  };

  const handleToggleSound = () => {
    const nextVal = sound.toggleSound();
    setSoundEnabled(nextVal);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('gachanduan_history');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-[#FFD52E] selection:text-[#0B2A63] text-[#0B2A63]">
      {/* 1. Global Cartoon Environmental Background (PDF Section 5.1 & 11) */}
      <PageBackground />

      {/* 2. Top Bar Navigation */}
      <Header
        onNewDecision={handleNewDecision}
        onOpenRules={() => setRulesOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        status={gameStatus}
      />

      {/* 3. Main Dynamic View */}
      <main className="flex-1 flex flex-col justify-center relative">
        {gameStatus === 'SETUP' && (
          <DecisionSetup
            question={question}
            setQuestion={setQuestion}
            options={options}
            setOptions={setOptions}
            onStartRoll={handleStartRoll}
          />
        )}

        {gameStatus === 'ROLLING' && (
          <RollingAnimation
            options={options}
            onComplete={handleRollingComplete}
          />
        )}

        {gameStatus === 'REVEALING' && (
          <GachaPage
            question={question}
            cards={cards}
            options={options}
            liveScores={liveTally.scores}
            liveBreakdown={liveTally.breakdown}
            onRevealCard={handleRevealCard}
            onFinishRevealAll={() => finalizeResult(cards)}
            onReset={handleNewDecision}
          />
        )}

        {gameStatus === 'RESULT' && decisionResult && (
          <ResultPage
            question={question}
            result={decisionResult}
            cards={cards}
            options={options}
            onPlayAgain={handlePlayAgain}
            onNewDecision={handleNewDecision}
          />
        )}
      </main>


      {/* Modals */}
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
