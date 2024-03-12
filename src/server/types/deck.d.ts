export interface NewDeck {
  user_id?: number;
  name: string;
  is_scored?: boolean | 1 | 0;
  is_custom?: boolean | 1 | 0;
}

export interface Deck extends NewDeck {
  id: number;
  is_playable: boolean | 1 | 0;
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
