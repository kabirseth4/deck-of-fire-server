import { Id, SQLBoolean } from "./types";
import { Card } from "./card";

export interface NewDeck {
  user_id?: Id;
  name: string;
  is_scored?: SQLBoolean;
  is_custom?: SQLBoolean;
}

export interface Deck extends NewDeck {
  id: Id;
  is_playable: SQLBoolean;
  user_id?: number;
}

export interface DeckWithCards {
  cards: Card[];
}

export interface NewDeckCard {
  card_id: Id;
  deck_id?: Id;
  occurences?: number;
  penalty?: number;
}

export interface DeckCard extends NewDeckCard {
  id: Id;
}
