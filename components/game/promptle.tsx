"use client";
import { useEffect, useState } from "react";

import ImagesDisplay from "@/components/game/images-display";
import WordSelector from "@/components/game/word-selector";
import TimeUpDisplay from "@/components/game/time-up-display";

export default function Promptle({
  promptle,
  secondsLeft,
  handleNextPromptle,
}: {
  promptle: any;
  secondsLeft: number;
  handleNextPromptle: () => void;
}) {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <div className="flex flex-col items-center justify-cente">
      <ImagesDisplay images={promptle.images} />
      {secondsLeft > 0 && (
        <WordSelector
          words={promptle.promptle_words}
          correctWords={promptle.solution.split(" ")}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
        />
      )}
      {secondsLeft === 0 && <TimeUpDisplay onContinue={handleNextPromptle} />}
    </div>
  );
}
