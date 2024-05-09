import { userId, incorrectUserId, incorrectAuthHeader } from "./test.setup";

export const userValidationTestCases = [
  {
    description: "returns 404 if user does not exist",
    user: incorrectUserId,
    header: incorrectAuthHeader,
    status: 404,
  },
  {
    description: "returns 401 if no auth header",
    user: userId,
    header: {},
    status: 401,
  },
  {
    description: "returns 403 if auth token is for different user",
    user: userId,
    header: incorrectAuthHeader,
    status: 403,
  },
];

export const deckValidationTestCases = [
  {
    description: "returns 404 if deck does not exist",
    deck: 999,
    status: 404,
  },
  {
    description: "returns 401 if deck belongs to different user",
    deck: 9,
    status: 401,
  },
];
