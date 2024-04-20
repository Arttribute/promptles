const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PromptlesLeaderboards Contract", function () {
  let leaderboards;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    const Leaderboards = await ethers.getContractFactory(
      "PromptlesLeaderboards"
    );
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    leaderboards = await Leaderboards.deploy();
  });

  describe("Game Management and Score Handling", function () {
    it("should create a game, add scores, and retrieve the sorted leaderboard", async function () {
      await leaderboards.createGame("Example Game");
      await leaderboards.connect(addr1).addScore(0, 500);
      await leaderboards.connect(addr2).addScore(0, 300);
      await leaderboards.connect(addr3).addScore(0, 400);
      const leaderboard = await leaderboards.getGameLeaderboard(0);
      console.log("Leaderboard for 'Example Game':");
      leaderboard.forEach((player) => {
        console.log(`Address: ${player.playerAddress}, Score: ${player.score}`);
      });
      expect(leaderboard[0].score).to.equal(500);
      expect(leaderboard[1].score).to.equal(400);
      expect(leaderboard[2].score).to.equal(300);
    });

    it("should handle edge case scores correctly", async function () {
      await leaderboards.createGame("Edge Case Game");
      await leaderboards.connect(addr1).addScore(0, 0); // Minimal score
      await leaderboards.connect(addr2).addScore(0, 200); // Maximal score
      const leaderboard = await leaderboards.getGameLeaderboard(0);
      expect(leaderboard[0].score).to.equal(200);
      expect(leaderboard[1].score).to.equal(0);
    });

    it("should retrieve the correct score for a specific player", async function () {
      await leaderboards.createGame("Player Specific Game");
      await leaderboards.connect(addr1).addScore(0, 250);
      const score = await leaderboards.getPlayerScore(0, addr1.address);
      expect(score).to.equal(250);
    });

    it("should return 0 for a player not in the game", async function () {
      await leaderboards.createGame("Empty Game");
      const score = await leaderboards.getPlayerScore(0, addr1.address);
      expect(score).to.equal(0);
    });

    it("should fail to retrieve the leaderboard of a non-existent game", async function () {
      await expect(leaderboards.getGameLeaderboard(999)).to.be.revertedWith(
        "Game does not exist."
      );
    });
    it("should find the correct game index using game data", async function () {
      await leaderboards.createGame("Indexed Game");
      const index = await leaderboards.getGameIndex("Indexed Game");
      expect(index).to.equal(0 + 1); // Assumes it's the first game created
    });
  });
});
