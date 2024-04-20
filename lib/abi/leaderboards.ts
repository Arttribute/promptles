export const LeaderboardsAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gameData",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "ScoreAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "addScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameData",
        type: "string",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "string",
        name: "gameData",
        type: "string",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameData",
        type: "string",
      },
    ],
    name: "getGameIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "getGameLeaderboard",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "playerAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
        ],
        internalType: "struct PromptlesLeaderboards.Player[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerScore",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
