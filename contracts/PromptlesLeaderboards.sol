// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromptlesLeaderboards {
    struct Player {
        address playerAddress;
        uint score;
    }

    struct Game {
        string name;
        address creator;
        Player[] leaderboard;
    }

    Game[] public games;

    event GameCreated(uint gameId, string name, address creator);
    event ScoreAdded(uint gameId, address player, uint score);
    
    function createGame(string memory name) public {
        Game storage newGame = games.push();
        newGame.name = name;
        newGame.creator = msg.sender;
        uint gameId = games.length - 1;
        emit GameCreated(gameId, name, msg.sender);
    }

    function addScore(uint gameId, uint score) public {
        require(gameId < games.length, "Game does not exist.");
        games[gameId].leaderboard.push(Player(msg.sender, score));
        emit ScoreAdded(gameId, msg.sender, score);
    }

    function getGameLeaderboard(uint gameId) public view returns (Player[] memory) {
        require(gameId < games.length, "Game does not exist.");
        // Sort the leaderboard in descending order
        Player[] memory leaderboard = games[gameId].leaderboard;
        quickSort(leaderboard, 0, int(leaderboard.length - 1));
        return leaderboard;
    }

    //Quick sort algorithm
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

    // Function to get the score of a player in a specific game
    function getPlayerScore(uint gameId, address player) public view returns (uint) {
        require(gameId < games.length, "Game does not exist.");
        for (uint i = 0; i < games[gameId].leaderboard.length; i++) {
            if (games[gameId].leaderboard[i].playerAddress == player) {
                return games[gameId].leaderboard[i].score;
            }
        }
        return 0;
    }
}
