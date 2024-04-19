"use client";
import { useState, useEffect, use } from "react";
import { User } from "@/models/User";
import axios from "axios";

import AccountMenu from "@/components/account/account-menu";
import Promptle from "@/components/game/promptle";

export default function Game({ params }: { params: { id: string } }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPromptles, setLoadingPromptles] = useState(true);
  const [account, setAccount] = useState<User | null>(null);
  const [promptleUpdated, setPromptleUpdated] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    setAccount(user);
    fetchGame();
    loadPromptles();
  }, [game, loadingPromptles]);

  async function fetchGame() {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/games/${params.id}`,
      {
        params: { id: params.id },
      }
    );
    const data = res.data;
    setGame(data);
    setLoading(false);
  }

  async function loadPromptles() {
    if (!game) return;
    const gamePromptles = (game as any)?.promptles;
    for (let i = 0; i < gamePromptles.length; i++) {
      const promptle = gamePromptles[i];
      if (promptle.status === "completed") continue;
      await getPromptleImagesAndUpdate(
        promptle._id,
        promptle.prompt_id,
        "690204"
      );
    }
    setLoadingPromptles(false);
  }
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/promptles/${promptleId}`,
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
    <div>
      <AccountMenu />
      <div className="flex flex-col items-center justify-center h-screen">
        {loading ? (
          <div>Loading...</div>
        ) : (
          game &&
          (game as any)?.promptles.map((promptle: any) => (
            <div key={promptle._id}>
              <Promptle promptle={promptle} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
