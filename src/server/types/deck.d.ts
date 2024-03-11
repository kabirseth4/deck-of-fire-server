export interface NewDeck {
  name: string;
  is_scored?: boolean;
  is_custom?: boolean;
}

export interface Deck {
  id: number;
  name: string;
  is_scored: number;
  is_custom: number;
  is_playable: number;
  user_id?: number;
}

export interface NewDeckCard {
  card_id: number;
  deck_id?: number;
  occurrences?: number;
  penalty?: number;
}

export interface DeckCard extends NewDeckCard {
  id: number;
}
