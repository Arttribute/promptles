"use client";
import { useState, useEffect, use } from "react";
import { User } from "@/models/User";
import axios from "axios";

import { LoaderCircle } from "lucide-react";
import AppBar from "@/components/layout/appbar";

import Promptle from "@/components/game/promptle";
import PromptleTimer from "@/components/game/promptle-timer";
import StartGameDisplay from "@/components/game/start-game-display";
import GameEndDisplay from "@/components/game/game-end-display";
import ScoreDisplay from "@/components/game/score-display";
import RequireAuthPlaceholder from "@/components/account/require-auth-placeholder";

import { ArbitrumSepolia } from "@/lib/contractAddresses";
import { LeaderboardsAbi } from "@/lib/abi/leaderboards";
import {
  CreatedAttestation,
  findAttestation,
  makeAttestation,
  queryAttestations,
} from "@/lib/ethsign";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const givenTime = 15;

export default function Game({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPromptles, setLoadingPromptles] = useState(true);
  const [account, setAccount] = useState<User | null>(null);
  const [loadedAccount, setLoadedAccount] = useState(true);
  const [promptleUpdated, setPromptleUpdated] = useState(false);
  const [currentPromptleIndex, setCurrentPromptleIndex] = useState(-1);
  const [promptleCount, setPromptleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(givenTime);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [score, setScore] = useState(0);
  const [onchainGameIndex, setOnchainGameIndex] = useState(0);
  const [gameLeaderboard, setGameLeaderboard] = useState([]);
  const [isFirstPlay, setIsFirstPlay] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    console.log("game Id from client:", params.id);
    setAccount(user);
    setLoadedAccount(true);
    fetchGame();
  }, [loadingPromptles]);

  useEffect(() => {
    if (isCorrect) {
      setIsTimerActive(false);
    }
  }, [isCorrect]);

  useEffect(() => {
    loadPromptles();
  }, [game]);

  async function fetchGame() {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/games/game`,
      {
        params: { id: params.id },
      }
    );
    const data = res.data;
    setGame(data);
    setPromptleCount(data.promptles.length);

    const provider = new ethers.JsonRpcProvider(
      "https://arbitrum-sepolia.infura.io/v3/2MFflEDUYSnkTPYw1RuKEHbhFIj"
    );
    const leaderboardsContract = new ethers.Contract(
      ArbitrumSepolia.PromptleLeaderboards,
      LeaderboardsAbi,
      provider
    );
    console.log("game", data);
    console.log("gameId", data.game._id);
    const gameIndexOnchain = await leaderboardsContract.getGameIndex(
      data.game._id
    );
    const gameIndexOnchainToNumber = Number(gameIndexOnchain);
    console.log("gameIndexOnchain", gameIndexOnchainToNumber);
    console.log("gameIndexOnchain type", typeof gameIndexOnchainToNumber);
    setOnchainGameIndex(gameIndexOnchainToNumber);
    // const gameLeaderboardOnchain =
    //   await leaderboardsContract.getGameLeaderboard(
    //     gameIndexOnchainToNumber - 1
    //   ); // -1 since actual index starts from 0 in the contract but 0 reserved for non-existent games
    // console.log("gameLeaderboardOnchain", gameLeaderboardOnchain);
    // setGameLeaderboard(gameLeaderboardOnchain);

    setLoading(false);
  }

  async function handleAttest() {
    if (!account || !game) return;
    // search for existing attestation
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const attestations = await queryAttestations(
      signer.address,
      account.web3Address
    );

    const att = findAttestation(game.game._id, attestations.attestations ?? []);

    console.log("att", att);

    // if not found, create attestation
    if (!att) {
      const newAtt: CreatedAttestation = await makeAttestation(
        account.web3Address,
        game.game._id
      );
      setIsFirstPlay(true);
    } else {
      setIsFirstPlay(false);
    }
  }

  async function loadPromptles() {
    if (!game) return;
    const gamePromptles = (game as any)?.promptles;
    for (let i = 0; i < gamePromptles.length; i++) {
      const promptle = gamePromptles[i];
      console.log("loading promptles! promptle", promptle);
      if (promptle.images.length > 0) continue;
      await getPromptleImagesAndUpdate(
        promptle._id,
        promptle.prompt_id,
        "690204"
      );
    }
    setLoadingPromptles(false);
  }

  const handleNextPromptle = () => {
    if (currentPromptleIndex < promptleCount) {
      setCurrentPromptleIndex(currentPromptleIndex + 1);
      setSecondsLeft((game as any)?.game.time_given);
      setIsCorrect(false);
      setIsTimerActive(true);
    }
  };

  async function getPromptleImagesAndUpdate(
    promptleId: string,
    promptId: string,
    modelId: string
  ) {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/promptles/prompts/${promptId}`,
        {
          params: { model_id: modelId, prompt_id: promptId },
        }
      );
      const promptleImages = result.data.data.images;

      const promptleData = {
        images: promptleImages,
        status: "completed",
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/promptles/promptle`,
        promptleData,
        { params: { id: promptleId } }
      );
      const data = res.data;
      console.log("Promptle updated", data);
      setPromptleUpdated(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <AppBar />
      <div className="flex flex-col items-center justify-center mt-6 h-screen">
        {loading ? (
          <LoaderCircle size={40} className="animate-spin text-gray-500" />
        ) : (
          account &&
          game && (
            <>
              {currentPromptleIndex > -1 && (
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-10">
                    {(game as any)?.promptles.map(
                      (promptle: any, index: number) => (
                        <div key={promptle._id} className="mt-4">
                          {index === currentPromptleIndex && (
                            <Promptle
                              promptle={promptle}
                              secondsLeft={secondsLeft}
                              handleNextPromptle={handleNextPromptle}
                              isCorrect={isCorrect}
                              setIsCorrect={setIsCorrect}
                              givenTime={(game as any)?.game.time_given}
                              score={score}
                              setScore={setScore}
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                  <div className="col-span-2 mt-4">
                    {currentPromptleIndex !== promptleCount && (
                      <>
                        <PromptleTimer
                          initialSeconds={(game as any)?.game.time_given}
                          secondsLeft={secondsLeft}
                          setSecondsLeft={setSecondsLeft}
                          isActive={isTimerActive}
                          setIsActive={setIsTimerActive}
                        />
                        <ScoreDisplay score={score} />
                      </>
                    )}
                  </div>
                </div>
              )}
              {currentPromptleIndex === -1 && (
                <StartGameDisplay
                  gameTitle={(game as any)?.game.game_title}
                  promptlesCount={promptleCount}
                  onStartGame={handleNextPromptle}
                  timeGiven={(game as any)?.game.time_given}
                  handleAttest={handleAttest}
                />
              )}
              {currentPromptleIndex === promptleCount && (
                <GameEndDisplay
                  gameTitle={(game as any)?.game_title}
                  score={score}
                  onchainGameIndex={onchainGameIndex}
                  offchainGameId={(game as any)?.game._id}
                  playerId={account?._id}
                  gamescores={(game as any)?.scores}
                  isFirstPlay={isFirstPlay}
                />
              )}
            </>
          )
        )}
        {!account && loadedAccount && <RequireAuthPlaceholder />}
      </div>
    </>
  );
}
