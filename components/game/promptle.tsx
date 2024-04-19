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
  score,
  givenTime,
  handleNextPromptle,
  setIsCorrect,
  setScore,
}: {
  promptle: any;
  secondsLeft: number;
  isCorrect: boolean;
  score: number;
  givenTime: number;
  handleNextPromptle: () => void;
  setIsCorrect: (isCorrect: boolean) => void;
  setScore: (score: number) => void;
}) {
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    if (isCorrect) {
      updateScore();
    }
  }, [isCorrect]);

  const updateScore = () => {
    const baseScore = 100;
    const timePenalty = 1;
    const wrongPenalty = 10;
    const timeLeft = secondsLeft;
    if (isCorrect) {
      const totalWrongPenalty = wrongPenalty * wrongAttempts;
      const totalTimePenalty = timePenalty * (givenTime - timeLeft);
      const promptleScore = baseScore - totalWrongPenalty - totalTimePenalty;
      setScore(score + promptleScore);
    }
  };
  return (
    <div className="flex flex-col items-center justify-cente">
      <ImagesDisplay images={promptle.images} />
      {secondsLeft > 0 && !isCorrect && (
        <WordSelector
          words={promptle.promptle_words}
          correctWords={promptle.solution.split(" ")}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
          wrongAttempts={wrongAttempts}
          setWrongAttempts={setWrongAttempts}
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
