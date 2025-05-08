export type EventCard = {
    id: string;
    label: string;
    date: number;
    title?: string;
    artist?: string;
    image?: string;
  };
  
  export type Puzzle = {
    slug: string;
    topic: string;
    category: "History" | "Arts" | "Entertainment" | "Sports" | "Current Events";
    cards: EventCard[];
    hideDates?: boolean;
  };
  