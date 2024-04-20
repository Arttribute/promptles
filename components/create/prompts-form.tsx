"use client";
import { useState, useEffect, use } from "react";
import PromptleField from "./promptle-field";

import { Button } from "../ui/button";
import AddPromptField from "./add-prompt-field";
import axios from "axios";
import { User } from "@/models/User";

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ArbitrumSepolia } from "@/lib/contractAddresses";
import { LeaderboardsAbi } from "@/lib/abi/leaderboards";

export default function PromptleForm() {
  const [promptFieldsCount, setPromptFieldCount] = useState(1);
  const [gameTitle, setGameTitle] = useState(".");
  const [description, setDescription] = useState(".");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [decoys, setDecoys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedAccount, setLoadedAccount] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [account, setAccount] = useState<User | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    setLoadedAccount(true);
    setAccount(user);
    console.log("prompts", prompts);
    console.log("decoys", decoys);
  }, [prompts, decoys]);

  async function createNewGame() {
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
      const gameData = {
        game_title: gameTitle,
        description: description,
        owner: account?._id,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/games`,
        { gameData }
      );
      console.log("res", res.data);
      const gameOffChainId = res.data._id;
      const tx = await leaderboardsContract.createGame(gameOffChainId);
      await tx.wait();
      return res.data;
    } catch (error) {
      console.error("Error in creating game", error);
    }
  }

  async function onSubmit() {
    setLoading(true);
    try {
      //create game
      const createdGameData = await createNewGame();

      for (let i = 0; i < prompts.length; i++) {
        //randomly shuffle decoy and add the solution
        const words = decoys[i].split(" ");
        const correctWords = prompts[i].split(" ");
        words.push(...correctWords);
        const shuffledWords = words.sort(() => Math.random() - 0.5);
        const promptleData = {
          game_id: createdGameData._id,
          promptle_words: shuffledWords,
          solution: prompts[i],
          owner: account?._id,
        };
        let promptToken = ""; //TODO: replace with this `${tunedModel.modeldata.token} style` || "sks style";
        const textToImageObject = {
          text: `${prompts[i]} ${promptToken}`,
          negative_prompt: "",
          super_resolution: true,
          face_correct: true,
          num_images: 1,
          callback: 0,
        };
        const promptCost = 5;
        const totalCost = numberOfImages * promptCost * prompts.length;

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/promptles`,
          {
            promptleData,
            textToImageObject,
            modelId: "690204",
            cost: totalCost,
          }
        );
        const PromptResponse = res.data.newPrompt;
      }
    } catch (error) {
      console.error("Error in API call:", error);
    }
  }

  return (
    <>
      <div className="p-0.5 m-2 rounded-lg lg:w-[50%]">
        <div className="font-semibold">Create your prompt puzzle game</div>
        <div className="font-light text-sm mb-2">
          Write at most a 6-word prompt and a 12-word decoy for each puzzle
        </div>

        {promptFieldsCount > 0 && (
          <div>
            {[...Array(promptFieldsCount)].map((_, index) => (
              <PromptleField
                key={index}
                index={index}
                prompts={prompts}
                decoys={decoys}
                promptFieldsCount={promptFieldsCount}
                setPromptFieldCount={setPromptFieldCount}
                setPrompts={setPrompts}
                setDecoys={setDecoys}
              />
            ))}
          </div>
        )}
        <AddPromptField
          promptFieldsCount={promptFieldsCount}
          setPromptFieldCount={setPromptFieldCount}
        />
        <div className="mt-2">
          <Button className="mt-2 w-full" onClick={onSubmit}>
            Create
          </Button>
        </div>
      </div>
    </>
  );
}
