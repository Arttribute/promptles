"use client";
import { useState, useEffect, use } from "react";
import { User } from "@/models/User";
import axios from "axios";

import { LoaderCircle, Timer } from "lucide-react";
import AppBar from "@/components/layout/appbar";

import Promptle from "@/components/game/promptle";
import PromptleTimer from "@/components/game/promptle-timer";
import StartGameDisplay from "@/components/game/start-game-display";
import GameEndDisplay from "@/components/game/game-end-display";
import ScoreDisplay from "@/components/game/score-display";
import RequireAuthPlaceholder from "@/components/account/require-auth-placeholder";

import { ArbitrumSepolia } from "@/lib/contractAddresses";
import { LeaderboardsAbi } from "@/lib/abi/leaderboards";
import { ethers } from "ethers";

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
  const [loadingAttestation, setLoadingAttestation] = useState(false);
  const [attestationFailed, setAttestationFailed] = useState(false);
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

    setLoading(false);
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
      //if (attestationFailed) return;
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
      console.log("result", result);
      const promptleImages = result.data.data.images;

      console.log("promptleImages", promptleImages);

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
      <div className="flex flex-col items-center justify-center mt-16 lg:h-screen">
        {loading ? (
          <LoaderCircle size={40} className="animate-spin text-gray-500" />
        ) : (
          account &&
          game && (
            <>
              {currentPromptleIndex > -1 && (
                <div className="grid grid-cols-12 gap-2">
                  <div className="lg:hidden col-span-12 m-2 -mt-4">
                    {currentPromptleIndex !== promptleCount && (
                      <div className="flex">
                        <div className="mt-4 w-24 border rounded-lg p-1.5">
                          <Timer className="-mb-2 h-4 w-4" />
                          <PromptleTimer
                            initialSeconds={(game as any)?.game.time_given}
                            secondsLeft={secondsLeft}
                            setSecondsLeft={setSecondsLeft}
                            isActive={isTimerActive}
                            setIsActive={setIsTimerActive}
                          />
                        </div>
                        <div className="ml-auto w-28">
                          <ScoreDisplay score={score} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-12 lg:col-span-10">
                    {(game as any)?.promptles.map(
                      (promptle: any, index: number) => (
                        <div key={promptle._id} className="-mt-1 lg:mt-4">
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

                  <div className="hidden lg:block col-span-2 mt-4">
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
                <>
                  <StartGameDisplay
                    gameTitle={(game as any)?.game.game_title}
                    promptlesCount={promptleCount}
                    onStartGame={handleNextPromptle}
                    timeGiven={(game as any)?.game.time_given}
                    gamescores={(game as any)?.scores}
                  />
                  {loadingAttestation && (
                    <div className="flex text-sm font-light text-gray-500 mt-4">
                      <LoaderCircle className="animate-spin text-gray-500 h-4 w-4 mr-1.5" />
                      <p>Verifying leaderboard eligibility with ,</p>
                      <em> Sign protocol </em>
                    </div>
                  )}
                  {attestationFailed && (
                    <div className="text-sm font-light text-red-500 mt-4">
                      <p>
                        Failed to create attestation for leaderboard eligibility
                      </p>
                    </div>
                  )}
                </>
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
