export interface NewCard {
  name: string;
  description: string;
  occurrences?: number;
  penalty?: number;
  user_id?: number;
}

export interface Card extends NewCard {
  id: number;
}
