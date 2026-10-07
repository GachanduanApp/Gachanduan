export type Rarity = 'COMMON' | 'RARE' | 'EPIC';

export interface OptionItem {
  id: string;
  name: string;
}

export interface GachaCardData {
  id: string;
  optionId: string;
  optionName: string;
  rarity: Rarity;
  voteValue: number;
  revealed: boolean;
}

export interface OptionScoreBreakdown {
  common: number;
  rare: number;
  epic: number;
  totalCards: number;
  totalVotes: number;
}

export interface DecisionResult {
  scores: Record<string, number>;
  breakdown: Record<string, OptionScoreBreakdown>;
  winnerId: string;
  winnerName: string;
  isTie: boolean;
  tiedOptionIds: string[];
  tiedOptionNames: string[];
}

export type GameStatus = 'SETUP' | 'ROLLING' | 'REVEALING' | 'RESULT';

export interface DecisionHistoryItem {
  id: string;
  timestamp: number;
  question: string;
  winnerName: string;
  winnerVotes: number;
  isTie: boolean;
  tiedNames?: string[];
  options: string[];
  cardsSummary: {
    common: number;
    rare: number;
    epic: number;
  };
}
