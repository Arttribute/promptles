"use client";
import { useState, useEffect, use } from "react";
import PromptField from "./prompt-field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AddPromptField from "./add-prompt-field";

export default function PromptsForm() {
  const [promptFieldsCount, setPromptFieldCount] = useState(1);
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    console.log("prompts", prompts);
  }, [prompts]);

  return (
    <>
      <div className="p-0.5 m-2 rounded-lg w-96">
        <div className="font-semibold">Create your prompt puzzle game</div>
        <div className="font-light text-sm mb-2">
          Write at most 6 words for each prompt puzzle
        </div>

        {promptFieldsCount > 0 && (
          <div>
            {[...Array(promptFieldsCount)].map((_, index) => (
              <PromptField
                index={index}
                prompts={prompts}
                promptFieldsCount={promptFieldsCount}
                setPromptFieldCount={setPromptFieldCount}
                setPrompts={setPrompts}
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
