"use client";
import { useState, useEffect, use } from "react";
import PromptleField from "./promptle-field";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AddPromptField from "./add-prompt-field";
import axios from "axios";
import { User } from "@/models/User";

import { useRouter } from "next/navigation";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Puzzle } from "lucide-react";
import { Timer } from "lucide-react";
import { ModelSelector } from "./model-selector";

export default function PromptleForm() {
  const [promptFieldsCount, setPromptFieldCount] = useState(1);
  const [gameTitle, setGameTitle] = useState(".");
  const [description, setDescription] = useState(".");
  const [gametheme, setGametheme] = useState(".");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [decoys, setDecoys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedAccount, setLoadedAccount] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [account, setAccount] = useState<User | null>(null);
  const [timeGiven, setTimeGiven] = useState(20);

  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    setLoadedAccount(true);
    setAccount(user);
    console.log("prompts", prompts);
    console.log("decoys", decoys);
  }, [prompts, decoys]);

  //use effect to get new promptfields when prompts and decoys are generated and set each prompt and decoy fields
  useEffect(() => {
    if (prompts.length > 0) {
      setPromptFieldCount(prompts.length);
    }
  }, [prompts]);

  async function createNewGame() {
    try {
      const gameData = {
        game_title: gameTitle,
        description: description,
        time_given: timeGiven,
        owner: account?._id,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/games`,
        { gameData }
      );
      console.log("res", res.data);
      const gameOffChainId = res.data._id;

      return res.data;
    } catch (error) {
      console.error("Error in creating game", error);
    }
  }

  async function generatePrompts() {
    setLoadingPrompts(true);
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: gametheme,
        }),
      });
      console.log("response", response);
      const res = await response.json();
      console.log("res", res);
      setPrompts(res.prompts);
      setDecoys(res.decoys);
    } catch (error) {
      console.error("Error in generating prompts", error);
    }
    setLoadingPrompts(false);
  }

  async function onSubmit() {
    setLoading(true);
    try {
      //create game
      console.log("model id", selectedModelId);
      const createdGameData = await createNewGame();

      for (let i = 0; i < prompts.length; i++) {
        //randomly shuffle decoy and add the solution
        const words = decoys[i].split(" ");
        const correctWords = prompts[i].split(" ");
        words.push(...correctWords);
        const shuffledWords = words.sort(() => Math.random() - 0.5);
        //remove empty strings
        const promptleWords = shuffledWords.filter((word) => word !== "");
        const promptleData = {
          game_id: createdGameData._id,
          promptle_words: promptleWords,
          solution: prompts[i],
          owner: account?._id,
        };
        let promptToken = "sks style"; //TODO: replace with this `${tunedModel.modeldata.token} style` || "sks style";
        const textToImageObject = {
          text: `${prompts[i]} ${promptToken}`,
          negative_prompt: "ugly ",
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
            modelId: selectedModelId,
            cost: totalCost,
          }
        );
        const PromptResponse = res.data.newPrompt;
        console.log("Prompt Response", PromptResponse);
        //wait for images to be generated

        router.push(`/games`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API call:", error);
    }
  }

  return (
    <>
      <div className="p-1 m-2 rounded-lg lg:w-[50%]">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex ">
              <div className="text-lg font-bold  bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Promptles
              </div>
              <Puzzle className="w-3.5 h-3.5 text-purple-500 text-xs mt-0.5 font-bold" />
            </div>
          </div>
          <div className="text-2xl font-semibold">Create Promptle</div>
        </div>
        <div className="mt-2 mb-2">
          <Input
            placeholder="Game Title"
            onChange={(e) => setGameTitle(e.target.value)}
          />
        </div>

        <div className="font-semibold">Create your prompt puzzle game</div>
        <div className="my-2">
          <ModelSelector setSelectedModelId={setSelectedModelId} />
        </div>
        <div className="font-light text-xs mb-2 text-gray-500">
          Write at most a 6-word prompt and a 8-word decoy for each puzzle
        </div>

        <div className="flex mt-2 mb-2">
          <Input
            placeholder="give us your game theme or topic and AI  will generate prompts for you"
            onChange={(e) => setGametheme(e.target.value)}
            className="m-1 ml-0"
          />
          {loadingPrompts ? (
            <Button variant="outline" className="m-1" disabled>
              <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Generating...
              </p>
              <LoaderCircle size={20} className="animate-spin text-white" />
            </Button>
          ) : (
            <Button variant="outline" className="m-1" onClick={generatePrompts}>
              <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Generate with AI
              </p>
              <Sparkles className="m-1 h-3 w-3 text-purple-500" />
            </Button>
          )}
        </div>
        <div className="font-light text-xs mb-2 text-gray-500">
          Create or edit each prompt and decoy manually
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
          <div className="flex">
            <Timer className="w-4 h-4 " />
            <div className="text-sm font-semibold">Time given</div>
          </div>
          <div className="text-xs font-light text-gray-500 mb-1">
            Set the time given to solve for each prompt
          </div>
          <Input
            placeholder="Time Given"
            type="number"
            onChange={(e) => setTimeGiven(Number(e.target.value))}
            value={timeGiven}
          />
        </div>

        <div className="mt-2">
          {loading ? (
            <Button className="mt-2 w-full" disabled>
              <LoaderCircle size={20} className="animate-spin text-white" />
            </Button>
          ) : (
            <Button className="mt-2 w-full" onClick={onSubmit}>
              Create
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
