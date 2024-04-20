import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ArbitrumSepolia } from "@/lib/contractAddresses";
import { LeaderboardsAbi } from "@/lib/abi/leaderboards";

export default function EnterLeaderboard({
  score,
  onchainGameIndex,
}: {
  score: number;
  onchainGameIndex: number;
}) {
  const enterOnchainLeaderboard = async () => {
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
      const tx = await leaderboardsContract.addScore(
        onchainGameIndex - 1,
        score
      );
      await tx.wait();
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="w-full">
      <div className="p-2 flex flex-col items-center justify-center">
        {score > 0 && (
          <Button className="rounded-lg mt-1" onClick={enterOnchainLeaderboard}>
            Enter game leaderboard!
          </Button>
        )}
      </div>
    </div>
  );
}
