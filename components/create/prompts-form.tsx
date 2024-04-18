"use client";
import { useState, useEffect, use } from "react";
import PromptleField from "./promptle-field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AddPromptField from "./add-prompt-field";

export default function PromptsForm() {
  const [promptFieldsCount, setPromptFieldCount] = useState(1);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [decoys, setDecoys] = useState<string[]>([]);

  useEffect(() => {
    console.log("prompts", prompts);
    console.log("decoys", decoys);
  }, [prompts, decoys]);

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
          <Button className="mt-2 w-full">Create</Button>
        </div>
      </div>
    </>
  );
}
