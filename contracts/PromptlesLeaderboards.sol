// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromptlesLeaderboards {
    struct Player {
        address playerAddress;
        uint score;
    }

    struct Game {
        string gameData;
        address creator;
        Player[] leaderboard;
    }

    Game[] public games;

    event GameCreated(uint gameId, string gameData, address creator);
    event ScoreAdded(uint gameId, address player, uint score);
    
    function createGame(string memory gameData) public {
        Game storage newGame = games.push();
        newGame.gameData = gameData;
        newGame.creator = msg.sender;
        uint gameId = games.length - 1;
        emit GameCreated(gameId, gameData, msg.sender);
    }

    function addScore(uint gameId, uint score) public {
        require(gameId < games.length, "Game does not exist.");
        games[gameId].leaderboard.push(Player(msg.sender, score));
        emit ScoreAdded(gameId, msg.sender, score);
    }

    function getGameLeaderboard(uint gameId) public view returns (Player[] memory) {
        require(gameId < games.length, "Game does not exist.");
        Player[] memory leaderboard = games[gameId].leaderboard;
        quickSort(leaderboard, 0, int(leaderboard.length - 1));
        return leaderboard;
    }

    function quickSort(Player[] memory arr, int left, int right) internal pure {
        int i = left;
        int j = right;
        if (i == j) return;
        int pivot = int(arr[uint(left + (right - left) / 2)].score);
        while (i <= j) {
            while (int(arr[uint(i)].score) > pivot) i++;
            while (pivot > int(arr[uint(j)].score)) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    function getPlayerScore(uint gameId, address player) public view returns (uint) {
        require(gameId < games.length, "Game does not exist.");
        for (uint i = 0; i < games[gameId].leaderboard.length; i++) {
            if (games[gameId].leaderboard[i].playerAddress == player) {
                return games[gameId].leaderboard[i].score;
            }
        }
        return 0;
    }

    function getGameIndex(string memory gameData) public view returns (uint) {
        for (uint i = 0; i < games.length; i++) {
            if (keccak256(abi.encodePacked(games[i].gameData)) == keccak256(abi.encodePacked(gameData))) {
                return i+1; // 0 is reserved for non-existent games
            }
        }
        return 0;
    }
}