import { Id, SQLBoolean } from "./types.js";
import { Card } from "./card.js";

export interface DBDeck {
  id: Id;
  user_id?: Id;
  name: string;
  is_scored: SQLBoolean;
  is_custom: SQLBoolean;
  is_playable: SQLBoolean;
}

export interface NewDeck {
  user_id?: Id;
  name: string;
  is_scored?: boolean;
  is_custom?: boolean;
}

export interface Deck extends NewDeck {
  id: Id;
  is_playable: boolean;
}

export interface DeckWithCards extends Deck {
  cards: Card[];
}

export interface NewDeckCard {
  card_id: Id;
  deck_id?: Id;
  occurrences?: number;
  penalty?: number;
}

export interface DeckCard extends NewDeckCard {
  id: Id;
}
