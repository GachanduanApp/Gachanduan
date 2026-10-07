import { GachaCardData, OptionItem, Rarity, DecisionResult, OptionScoreBreakdown } from '../types';

/**
 * Independent option selector using uniform probability.
 * For N options, Probability(option) = 1 / N.
 */
export function randomizeOption(options: OptionItem[]): OptionItem {
  if (options.length === 0) {
    throw new Error('Options cannot be empty');
  }
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

/**
 * Independent rarity selector using the exact specification probabilities:
 * random < 0.70  -> COMMON (70%)
 * random < 0.95  -> RARE (25%)
 * otherwise      -> EPIC (5%)
 */
export function randomizeRarity(): Rarity {
  const value = Math.random();
  if (value < 0.70) return 'COMMON';
  if (value < 0.95) return 'RARE';
  return 'EPIC';
}

/**
 * Rarity to vote value mapping:
 * Common -> 1 vote
 * Rare   -> 2 votes
 * Epic   -> 3 votes
 */
export function getVoteValue(rarity: Rarity): number {
  switch (rarity) {
    case 'COMMON':
      return 1;
    case 'RARE':
      return 2;
    case 'EPIC':
      return 3;
    default:
      return 1;
  }
}

/**
 * Generate exactly 10 cards using independent option and rarity RNG processes.
 * Cards must be generated first, scores calculated second, and winner determined last.
 */
export function generateCards(options: OptionItem[]): GachaCardData[] {
  const cards: GachaCardData[] = [];

  for (let i = 0; i < 10; i++) {
    const selectedOption = randomizeOption(options);
    const rarity = randomizeRarity();
    const voteValue = getVoteValue(rarity);

    cards.push({
      id: `card-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      optionId: selectedOption.id,
      optionName: selectedOption.name,
      rarity,
      voteValue,
      revealed: false,
    });
  }

  return cards;
}

/**
 * Calculate scores and breakdowns for options from a list of cards.
 * If revealedOnly is true, only tallies revealed cards.
 */
export function calculateScores(
  options: OptionItem[],
  cards: GachaCardData[],
  revealedOnly: boolean = false
): { scores: Record<string, number>; breakdown: Record<string, OptionScoreBreakdown> } {
  const scores: Record<string, number> = {};
  const breakdown: Record<string, OptionScoreBreakdown> = {};

  // Initialize all submitted options with 0
  options.forEach((opt) => {
    scores[opt.id] = 0;
    breakdown[opt.id] = {
      common: 0,
      rare: 0,
      epic: 0,
      totalCards: 0,
      totalVotes: 0,
    };
  });

  const cardsToTally = revealedOnly ? cards.filter((c) => c.revealed) : cards;

  for (const card of cardsToTally) {
    if (!scores[card.optionId] && scores[card.optionId] !== 0) {
      scores[card.optionId] = 0;
      breakdown[card.optionId] = {
        common: 0,
        rare: 0,
        epic: 0,
        totalCards: 0,
        totalVotes: 0,
      };
    }

    scores[card.optionId] += card.voteValue;

    const b = breakdown[card.optionId];
    b.totalCards += 1;
    b.totalVotes += card.voteValue;
    if (card.rarity === 'COMMON') b.common += 1;
    else if (card.rarity === 'RARE') b.rare += 1;
    else if (card.rarity === 'EPIC') b.epic += 1;
  }

  return { scores, breakdown };
}

/**
 * Determine winner and handle RNG tie break if multiple options tie for highest score.
 */
export function determineWinner(
  options: OptionItem[],
  scores: Record<string, number>,
  breakdown: Record<string, OptionScoreBreakdown>
): DecisionResult {
  // Find highest score
  const optionScores = options.map((opt) => ({
    id: opt.id,
    name: opt.name,
    score: scores[opt.id] || 0,
  }));

  let highestScore = -1;
  optionScores.forEach((item) => {
    if (item.score > highestScore) {
      highestScore = item.score;
    }
  });

  // Find all options with highest score
  const highestOptions = optionScores.filter((item) => item.score === highestScore);

  let winnerId = '';
  let winnerName = '';
  let isTie = false;
  const tiedOptionIds: string[] = [];
  const tiedOptionNames: string[] = [];

  if (highestOptions.length === 1) {
    winnerId = highestOptions[0].id;
    winnerName = highestOptions[0].name;
    isTie = false;
  } else {
    // Tie condition: RNG tie-breaker
    isTie = true;
    highestOptions.forEach((opt) => {
      tiedOptionIds.push(opt.id);
      tiedOptionNames.push(opt.name);
    });

    const randomIndex = Math.floor(Math.random() * highestOptions.length);
    winnerId = highestOptions[randomIndex].id;
    winnerName = highestOptions[randomIndex].name;
  }

  return {
    scores,
    breakdown,
    winnerId,
    winnerName,
    isTie,
    tiedOptionIds,
    tiedOptionNames,
  };
}
