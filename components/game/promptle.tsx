"use client";
import { useEffect, useState } from "react";

import ImagesDisplay from "@/components/game/images-display";
import WordSelector from "@/components/game/word-selector";
import TimeUpDisplay from "@/components/game/time-up-display";
import SuccessDisplay from "@/components/game//success-display";

export default function Promptle({
  promptle,
  secondsLeft,
  isCorrect,
  handleNextPromptle,
  setIsCorrect,
}: {
  promptle: any;
  secondsLeft: number;
  isCorrect: boolean;
  handleNextPromptle: () => void;
  setIsCorrect: (isCorrect: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-cente">
      <ImagesDisplay images={promptle.images} />
      {secondsLeft > 0 && !isCorrect && (
        <WordSelector
          words={promptle.promptle_words}
          correctWords={promptle.solution.split(" ")}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
        />
      )}
      {secondsLeft === 0 && <TimeUpDisplay onContinue={handleNextPromptle} />}
      {isCorrect && (
        <SuccessDisplay
          solution={promptle.solution}
          onContinue={handleNextPromptle}
        />
      )}
    </div>
  );
}
