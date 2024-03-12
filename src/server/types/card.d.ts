import { Id } from "./types";

export interface NewCard {
  name: string;
  description: string;
  occurences?: number;
  penalty?: number;
  user_id?: Id;
}

export interface Card extends NewCard {
  id: Id;
}
