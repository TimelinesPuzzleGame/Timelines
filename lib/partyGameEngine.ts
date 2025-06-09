// lib/partyGameEngine.ts
import { Puzzle, EventCard, PartyGameState, PartyTeam } from "./types";
import { shuffleArray } from "./shuffle"; // Must exist or be created
import { processCardsWithVariants } from "./variantSelector";

const POINTS_TO_WIN = 9;
const MIN_CARDS_PER_TEAM = 10; // Minimum cards per team (1 anchor + 9 regular)
const MAX_CARDS_PER_TEAM = 30; // Maximum cards per team (1 anchor + 29 regular)

export class PartyGameEngine {
  private state: PartyGameState;
  private puzzle: Puzzle | undefined;

  constructor(puzzleOrState: Puzzle | PartyGameState, teamNames?: string[]) {
    if ("teams" in puzzleOrState) {
      // Resume game
      this.state = JSON.parse(JSON.stringify(puzzleOrState)); // deep clone
      // Note: puzzle reference will be missing in resume case
    } else {
      // Init new game
      if (!teamNames || teamNames.length < 2) {
        throw new Error("At least two team names are required to start Party Mode.");
      }

      if (!puzzleOrState || !("cards" in puzzleOrState)) {
        throw new Error("Invalid puzzle passed to PartyGameEngine constructor.");
      }

      this.puzzle = puzzleOrState;
      
      // Calculate optimal cards per team based on available cards
      const cardsPerTeam = Math.min(MAX_CARDS_PER_TEAM, Math.floor(puzzleOrState.cards.length / teamNames.length));
      
      if (cardsPerTeam < MIN_CARDS_PER_TEAM) {
        throw new Error(`Puzzle does not have enough cards for Party Mode. Need at least ${MIN_CARDS_PER_TEAM * teamNames.length} cards (${MIN_CARDS_PER_TEAM} per team), have ${puzzleOrState.cards.length}`);
      }

      const totalNeeded = teamNames.length * cardsPerTeam;

      // Process cards with variants if needed
      const processedCards = processCardsWithVariants(puzzleOrState.cards);
      const shuffled = shuffleArray([...processedCards]);
      const teams: PartyTeam[] = [];
      const anchorCards: EventCard[] = [];

      for (let i = 0; i < teamNames.length; i++) {
        const draw = shuffled.splice(0, cardsPerTeam);
        anchorCards.push(draw[0]); // First card is anchor
        teams.push({
          name: teamNames[i],
          cards: draw.slice(1), // Remaining cards are regular cards
          discardedCards: [],
          placedCards: [],
          score: 0,
        });
      }

      // Debug: Log initial card distribution
      console.log(`🃏 Initial card distribution:`);
      console.log(`📦 Total cards in puzzle: ${puzzleOrState.cards.length}`);
      console.log(`🔄 Processed cards count: ${processedCards.length}`);
      console.log(`🎯 Cards per team: ${cardsPerTeam} (${cardsPerTeam - 1} playable + 1 anchor)`);
      console.log(`📋 Cards used: ${totalNeeded}, remaining: ${shuffled.length}`);
      teams.forEach((team, i) => {
        console.log(`👥 ${team.name}: ${team.cards.length} cards + 1 anchor`);
      });

      this.state = {
        teams,
        currentTurn: 0,
        anchorCards,
        status: "playing",
      };
    }
  }

  startGame() {
    // Game is already initialized in constructor, no need to redistribute cards
    // Just ensure we're in playing state
    this.state.status = "playing";
    this.state.currentTurn = 0;
    
    console.log(`🎮 Party Game Started! ${this.state.teams.length} teams, ${this.state.teams[0].cards.length} cards each`);
  }

  advanceTurn() {
    const totalTeams = this.state.teams.length;
    this.state.currentTurn = (this.state.currentTurn + 1) % totalTeams;

    console.log(`🔄 Turn advanced to Team ${this.state.currentTurn + 1}: ${this.state.teams[this.state.currentTurn].name}`);
  }

  getState(): PartyGameState {
    return JSON.parse(JSON.stringify(this.state));
  }

  getCurrentTeam(): PartyTeam {
    return this.state.teams[this.state.currentTurn];
  }

  getCurrentTeamCard(): EventCard | null {
    const team = this.getCurrentTeam();
    
    // If current team has no cards, try to recycle discarded cards from other teams
    if (team.cards.length === 0) {
      const otherTeams = this.state.teams.filter((_, index) => index !== this.state.currentTurn);
      const availableDiscards: EventCard[] = [];
      
      // Collect all discarded cards from other teams
      otherTeams.forEach(otherTeam => {
        availableDiscards.push(...otherTeam.discardedCards);
        otherTeam.discardedCards = []; // Clear their discarded pile after taking
      });
      
      if (availableDiscards.length > 0) {
        // Shuffle the recycled cards and give them to current team
        const shuffled = shuffleArray([...availableDiscards]);
        team.cards = shuffled;
        console.log(`♻️ ${team.name} received ${shuffled.length} recycled cards from other teams`);
      } else {
        console.log(`🚨 No cards available for ${team.name} and no discards to recycle`);
        return null;
      }
    }
    
    return team.cards[0] || null;
  }

  recordPlacement(placement: { card: EventCard; correct: boolean }) {
    try {
      const currentTeamIndex = this.state.currentTurn;
      const team = this.state.teams[currentTeamIndex];

      // Validate the card exists in the team's deck
      const cardIndex = team.cards.findIndex((c: EventCard) => c.id === placement.card.id);
      if (cardIndex === -1) {
        console.error(`Card ${placement.card.id} not found in ${team.name}'s deck`);
        // Return current state without changes
        return { state: this.getState(), nextCard: this.getCurrentTeamCard() };
      }

      // Debug: Log card counts before removal
      console.log(`📊 Before placement - ${team.name}: ${team.cards.length} cards left`);
      this.state.teams.forEach((t, i) => {
        console.log(`📊 Team ${i} (${t.name}): ${t.cards.length} cards, ${t.score} points`);
      });

      // Remove the card from the team's deck
      team.cards = team.cards.filter((c: EventCard) => c.id !== placement.card.id);

      // Debug: Log card counts after removal
      console.log(`📊 After removal - ${team.name}: ${team.cards.length} cards left`);

      // Add to appropriate collection
      if (placement.correct) {
        team.placedCards.push(placement.card);
        // CRITICAL: Sort placed cards by date to maintain chronological order
        team.placedCards.sort((a, b) => a.date - b.date);
        team.score++;
        console.log(`✅ ${team.name} placed correctly! Score: ${team.score}/${POINTS_TO_WIN}`);
      } else {
        team.discardedCards.push(placement.card);
        console.log(`❌ ${team.name} placed incorrectly.`);
      }

      // Check win condition
      if (team.score >= POINTS_TO_WIN) {
        this.state.status = "finished";
        this.state.winningTeamIndex = currentTeamIndex;
        console.log(`🏆 ${team.name} wins!`);
        return { state: this.getState(), nextCard: null };
      }

      // Advance turn
      this.advanceTurn();
      
      // Get next card for the new current team
      const nextCard = this.getCurrentTeamCard();

      return {
        state: this.getState(),
        nextCard
      };
    } catch (error) {
      console.error('Error in recordPlacement:', error);
      // Return current state to prevent crash
      return { state: this.getState(), nextCard: this.getCurrentTeamCard() };
    }
  }
}
