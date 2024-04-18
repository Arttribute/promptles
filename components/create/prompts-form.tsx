"use client";
import { useState, useEffect, use } from "react";
import PromptleField from "./promptle-field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AddPromptField from "./add-prompt-field";
import axios from "axios";
import { User } from "@/models/User";

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
  const [images, setImages] = useState<string[]>([]); // to test displaying generated images

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    setLoadedAccount(true);
    setAccount(user);
    console.log("prompts", prompts);
    console.log("decoys", decoys);
  }, [prompts, decoys]);

  async function onSubmit() {
    setLoading(true);
    try {
      //create game
      const gameData = {
        game_title: gameTitle,
        description: description,
        owner: account?._id,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/games`,
        { gameData }
      );
      const createdGameData = res.data;

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
          text_prompts: [
            {
              text: `${prompts[i]} ${promptToken}`,
            },
          ],
          cfg_scale: 7, // higher values keep your image closer to your prompt. Default: 7
          steps: 30, // default 30
          samples: 4, // num of images generated
        };
        const promptCost = 5;
        const totalCost = numberOfImages * promptCost * prompts.length;

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/promptles`,
          {
            promptleData,
            textToImageObject,
            cost: totalCost,
          }
        );
        const PromptResponse = res.data.newPromptle;
        setImages((prev) => [...prev, ...PromptResponse.images]);
      }
    } catch (error) {
      console.error("Error in API call:", error);
    } finally {
      setLoading(false);
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
          <Button className="mt-2 w-full" onClick={onSubmit} disabled={loading}>
            {loading ? "Loading..." : "Create"}
          </Button>
        </div>
        {/* Section for testing purposes to display generated images. To be deleted */}
        {images.length > 0 && (
          <>
            <div className="font-semibold mt-2">Generated Images</div>
            <div className="flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="w-1/4 p-2">
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt="Generated Image"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
