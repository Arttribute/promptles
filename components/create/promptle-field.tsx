"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { set } from "mongoose";

export default function PromptleField({
  index,
  prompts,
  decoys,
  promptFieldsCount,
  setPromptFieldCount,
  setPrompts,
  setDecoys,
}: {
  index: number;
  prompts: string[];
  decoys: string[];
  promptFieldsCount: number;
  setPromptFieldCount: (promptFieldsCount: number) => void;
  setPrompts: (prompts: string[]) => void;
  setDecoys: (decoys: string[]) => void;
}) {
  const [isPromptValid, setIsPromptValid] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");
  const [decoy, setDecoy] = useState<string>("");
  const [isDecoyValid, setIsDecoyValid] = useState<boolean>(true);
  const [promptErrorMessages, setPromptErrorMessages] = useState<string[]>([]);
  const [decoyErrorMessages, setDecoyErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    checkPromptValidity(prompt);
    checkDecoyValidity(decoy);
  }, [prompt, decoy]);

  const checkPromptValidity = (prompt: string) => {
    const specialChars = /[^A-Za-z0-9\s]/;
    if (specialChars.test(prompt)) {
      setIsPromptValid(false);
      setPromptErrorMessages(["Prompt should not contain special characters"]);
    } else if (prompt.trim().split(" ").length > 6) {
      setIsPromptValid(false);
      setPromptErrorMessages(["Write at most 6 words for the prompt"]);
    } else {
      setIsPromptValid(true);
    }
  };

  const checkDecoyValidity = (decoy: string) => {
    const specialChars = /[^A-Za-z0-9\s]/;
    if (specialChars.test(decoy)) {
      setIsDecoyValid(false);
      setDecoyErrorMessages([
        "Decoy words should not contain special characters",
      ]);
    } else if (decoy.trim().split(" ").length > 8) {
      setIsDecoyValid(false);
      setDecoyErrorMessages(["Write at most 8 decoy words"]);
    } else {
      setIsDecoyValid(true);
    }
  };

  const removePromptFieldCount = () => {
    setPromptFieldCount(promptFieldsCount - 1);
    prompts.splice(index, 1);
    setPrompts([...prompts]);
  };
  return (
    <>
      <div key={index} className="w-full">
        <div className="flex  p-0.5 ">
          <div className="grid grid-cols-12 gap-2 w-full">
            <Input
              type="text"
              placeholder={`prompt ${index + 1}`}
              onChange={(event) => {
                setPrompt(event.target.value);
                prompts[index] = event.target.value;
                setPrompts([...prompts]);
              }}
              className="col-span-5 mb-1 w-full"
              value={prompts[index]}
            />
            <Input
              type="text"
              placeholder={`decoy words: upto 8 words`}
              onChange={(event) => {
                setDecoy(event.target.value);
                decoys[index] = event.target.value;
                setDecoys([...decoys]);
              }}
              className="col-span-7 mb-1 w-full"
              value={decoys[index]}
            />
          </div>
          {index > 0 && (
            <Button
              variant="ghost"
              className="mx-1 rounded-2xl"
              onClick={removePromptFieldCount}
            >
              <CircleX className="w-4 h-4" />
            </Button>
          )}
        </div>
        {!isPromptValid &&
          promptErrorMessages.map((message, index) => {
            return (
              <div key={index} className="text-red-500 text-sm">
                {message}
              </div>
            );
          })}
        {!isDecoyValid &&
          decoyErrorMessages.map((message, index) => {
            return (
              <div key={index} className="text-red-500 text-sm">
                {message}
              </div>
            );
          })}
      </div>
    </>
  );
}
