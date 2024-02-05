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

```http
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
  },
  {...
]
```

### Post new deck

```http
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

```http
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
  "rules": [
    {
      "id": 1,
      "name": "Rule 1",
      "description": "This is rule number 1.",
      "occurences": 1
    },
    {
      "id": 3,
      "name": "Rule 3",
      "description": "This is rule number 3.",
      "occurences": 2
    },
    {...
  ]
}
```

### Get all user rules

```http
  GET /users/${userId}/rules
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
    "name": "Rule 1",
    "description": "This is rule number 1."
  },
  {
    "id": 2,
    "name": "Rule 2",
    "description": "This is rule number 2."
  },
  {...
]
```

### Post new rule

```http
  Post /users/${userId}/rules
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

| Body          | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `name`        | `string` | **Required** Name of new rule.        |
| `description` | `string` | **Required** Description of new rule. |

Example request body:

```json
{
  "name": "Posted rule",
  "description": "This is a posted rule"
}
```

Example response body:

```json
{
  "id": 3,
  "name": "Posted rule",
  "description": "This is a posted rule"
}
```

### Post rules to deck

```http
  Post /users/${userId}/decks/${deckId}/rules
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `userId`  | `number` | **Required** User ID. |
| `deckId`  | `number` | **Required** Deck ID. |

| Header          | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `Authorization` | `number` | **Required** Same as userId. |

| Body         | Type     | Description                                                       |
| :----------- | :------- | :---------------------------------------------------------------- |
| `rule_id`    | `number` | **Required** Id of rule to add.                                   |
| `occurences` | `number` | **Optional** Occurences of rule. Only required if deck is custom. |
| `penalty`    | `number` | **Optional** Penalty for rule. Only required is deck is scored.   |

Example request body:

```json
[
  {
    "rule_id": 1,
    "occurences": 5,
    "penalty": 3
  },
  {
    "rule_id": 2,
    "occurences": 3,
    "penalty": 1
  },
  {...
]
```

Example response body:

```json
[
  {
    "id": 5,
    "rule_id": 1,
    "deck_id": 2,
    "occurences": 5,
    "penalty": 3
  },
  {
    "id": 6,
    "rule_id": 2,
    "deck_id": 2,
    "occurences": 3,
    "penalty": 1
  },
  {...
]
```

## Next Steps

- Implement authorisation.
- Add edit and delete enpoints for decks, rules, and deck rules.
- Add better seed data and default deck for new users.
