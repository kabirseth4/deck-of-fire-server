import { Id } from "./index.js";

export interface NewCard {
  name: string;
  description: string;
  occurrences?: number;
  penalty?: number;
  user_id?: Id;
}

export interface Card extends NewCard {
  id: Id;
}
