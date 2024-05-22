# Deck of Fire Server

A mobile web app based on the popular drinking game ring of fire with the aim of full customisation and an alternate scoring system that doesn't require drinking.

## Teck Stack

Teck Stack:

- Node
- Express
- MySQL

Dependecies:

- knex

## API Reference

### Get all user decks

```
  GET /users/${userId}/decks
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

Example response body:

```json
[
  {
    "id": 1,
    "name": "Custom deck",
    "is_scored": 0,
    "is_custom": 1,
    "is_playable": 1
  },
  {
    "id": 2,
    "name": "Scored custom deck",
    "is_scored": 1,
    "is_custom": 1,
    "is_playable": 1
  }
]
```

### Post new deck

```
  Post /users/${userId}/decks
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

| Body        | Type      | Description                      |
| :---------- | :-------- | :------------------------------- |
| `name`      | `string`  | **Required** Name of new deck.   |
| `is_scored` | `boolean` | **Required** Is the deck scored? |
| `is_custom` | `boolean` | **Required** Is the deck custom? |

Example request body:

```json
{
  "name": "Posted deck",
  "is_scored": false,
  "is_custom": true
}
```

Example response body:

```json
{
  "id": 3,
  "name": "Posted deck",
  "is_scored": 0,
  "is_custom": 1,
  "is_playable": 0
}
```

### Get single user deck

```
  GET /users/${userId}/decks/${deckId}
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |
| `deckId`  | `number` | **Required** Deck ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

Example response body:

```json
{
  "id": 1,
  "name": "Custom deck",
  "is_scored": 0,
  "is_custom": 1,
  "is_playable": 1,
  "cards": [
    {
      "id": 1,
      "name": "Card 1",
      "description": "This is card number 1.",
      "occurrences": 1
    },
    {
      "id": 3,
      "name": "Card 3",
      "description": "This is card number 3.",
      "occurrences": 2
    },
    {...
  ]
}
```

### Get all user cards

```http
  GET /users/${userId}/cards
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

Example response body:

```json
[
  {
    "id": 1,
    "name": "Card 1",
    "description": "This is card number 1."
  },
  {
    "id": 2,
    "name": "Card 2",
    "description": "This is card number 2."
  },
  {...
]
```

### Post new card

```http
  Post /users/${userId}/cards
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

| Body          | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `name`        | `string` | **Required** Name of new card.        |
| `description` | `string` | **Required** Description of new card. |

Example request body:

```json
{
  "name": "Posted card",
  "description": "This is a posted card"
}
```

Example response body:

```json
{
  "id": 3,
  "name": "Posted card",
  "description": "This is a posted card"
}
```

### Post cards to deck

```http
  Post /users/${userId}/decks/${deckId}/cards
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |
| `deckId`  | `number` | **Required** Deck ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

| Body          | Type     | Description                                                        |
| :------------ | :------- | :----------------------------------------------------------------- |
| `card_id`     | `number` | **Required** Id of card to add.                                    |
| `occurrences` | `number` | **Optional** occurrences of card. Only required if deck is custom. |
| `penalty`     | `number` | **Optional** Penalty for card. Only required is deck is scored.    |

Example request body:

```json
[
  {
    "card_id": 1,
    "occurrences": 5,
    "penalty": 3
  },
  {
    "card_id": 2,
    "occurrences": 3,
    "penalty": 1
  }
]
```

Example response body:

```json
[
  {
    "id": 5,
    "card_id": 1,
    "deck_id": 2,
    "occurrences": 5,
    "penalty": 3
  },
  {
    "id": 6,
    "card_id": 2,
    "deck_id": 2,
    "occurrences": 3,
    "penalty": 1
  }
]
```

## Next Steps

- Implement authorisation.
- Add edit and delete enpoints for decks, cards, and deck cards.
- Add better seed data and default deck for new users.
