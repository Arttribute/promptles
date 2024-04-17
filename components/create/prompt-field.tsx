"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

export default function AddPrompt({
  index,
  prompts,
  promptFieldsCount,
  setPromptFieldCount,
  setPrompts,
}: {
  index: number;
  prompts: string[];
  promptFieldsCount: number;
  setPromptFieldCount: (promptFieldsCount: number) => void;
  setPrompts: (prompts: string[]) => void;
}) {
  const [isPromptValid, setIsPromptValid] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    checkPromptValidity(prompt);
  }, [prompt]);

  const checkPromptValidity = (prompt: string) => {
    if (prompt.trim().split(" ").length > 6) {
      setIsPromptValid(false);
    } else {
      setIsPromptValid(true);
    }
  };

  const removePromptFieldCount = () => {
    setPromptFieldCount(promptFieldsCount - 1);
    prompts.splice(index, 1);
    setPrompts([...prompts]);
  };
  return (
    <>
      <div key={index} className="">
        <div className="flex  p-0.5 ">
          <Input
            type="text"
            placeholder={`promptle ${index + 1}`}
            onChange={(event) => {
              setPrompt(event.target.value);
              prompts[index] = event.target.value;
              setPrompts([...prompts]);
            }}
          />
          {index > 0 && (
            <Button
              variant="outline"
              className="mx-2 rounded-xl"
              onClick={removePromptFieldCount}
            >
              x
            </Button>
          )}
        </div>
        {!isPromptValid && (
          <div className="text-red-500 text-sm">Write at most 6 words</div>
        )}
      </div>
    </>
  );
}
