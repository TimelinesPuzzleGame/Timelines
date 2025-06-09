export type EventCard = {
  id: string;
  label: string;
  date: number;
  title?: string;
  artist?: string;
  image?: string;
  tooltip?: {
    description: string;
    quote: string;
  };
  // new:
  spotify?: {
    trackId: string;
    preview?: string | null;
    url?: string;
  };
  deezer?: {
    trackId: string;
    preview?: string | null;
    url?: string;
  };
  youtube?: string; // URL for YouTube embed
};

export type Puzzle = {
  slug: string;
  topic: string;
  category: "History" | "Arts" | "Entertainment" | "Sports" | "Current Events";
  // new:
  subcategory?: string;
  hideDates?: boolean;
  showTooltips?: boolean;
  showImageOnPlace?: boolean;
  cards: EventCard[];
};

// Party Mode Types
export type PartyTeam = {
  name: string;
  cards: EventCard[];
  discardedCards: EventCard[];
  placedCards: EventCard[];
  score: number;
};

export type PartyGameState = {
  teams: PartyTeam[];
  currentTurn: number;
  anchorCards: EventCard[];
  status: "playing" | "finished";
  winningTeamIndex?: number;
};
