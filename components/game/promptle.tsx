"use client";
import { useEffect, useState } from "react";

import ImagesDisplay from "@/components/game/images-display";
import WordSelector from "@/components/game/word-selector";

export default function Promptle({
  promptle,
  secondsLeft,
}: {
  promptle: any;
  secondsLeft: number;
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
    </div>
  );
}
