"use client";
import * as React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ArbitrumSepolia } from "@/lib/contractAddresses";
import { LeaderboardsAbi } from "@/lib/abi/leaderboards";
import axios from "axios";

export default function EnterLeaderboard({
  score,
  onchainGameIndex,
  offchainGameId,
  playerId,
}: {
  score: number;
  onchainGameIndex: number;
  offchainGameId: string;
  playerId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [scoreAdded, setScoreAdded] = useState(false);

  const enterOnchainLeaderboard = async () => {
    setLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const leaderboardsContract = new ethers.Contract(
      ArbitrumSepolia.PromptleLeaderboards,
      LeaderboardsAbi,
      signer
    );

    try {
      const scoreData = {
        game_id: offchainGameId,
        player: playerId,
        score_value: score,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/scores`,
        { scoreData }
      );
      const actualGameindex = onchainGameIndex === 0 ? 0 : onchainGameIndex - 1;
      const tx = await leaderboardsContract.addScore(actualGameindex, score);
      //await tx.wait();
      setLoading(false);
      setScoreAdded(true);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="w-full">
      <div className="p-2 flex flex-col items-center justify-center">
        {score > 0 && (
          <Button className="rounded-lg mt-1" onClick={enterOnchainLeaderboard}>
            {scoreAdded
              ? "Added to Leaderboard"
              : loading
              ? "Adding score..."
              : "Enter Leaderboard"}
          </Button>
        )}
      </div>
    </div>
  );
}
