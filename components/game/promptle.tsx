"use client";
import { useEffect, useState } from "react";

import ImagesDisplay from "@/components/game/images-display";
import WordSelector from "@/components/game/word-selector";

import PromptleTimer from "@/components/game/promptle-timer";

export default function Promptle({ promptle }: { promptle: any }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);

  return (
    <>
      <div className="grid grid-cols-12 justify-center gap-2">
        <div className=" col-span-10 flex flex-col items-center justify-center ">
          <ImagesDisplay images={promptle.images} />

          <WordSelector
            words={promptle.promptle_words}
            correctWords={promptle.solution.split(" ")}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
          />
        </div>
        <div className="col-span-2 mt-6 ">
          <PromptleTimer
            initialSeconds={10}
            secondsLeft={secondsLeft}
            setSecondsLeft={setSecondsLeft}
          />
        </div>
      </div>
    </>
  );
}
