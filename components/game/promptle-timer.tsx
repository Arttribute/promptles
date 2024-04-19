"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export default function PromptleTime({
  initialSeconds,
  secondsLeft,
  setSecondsLeft,
}: {
  initialSeconds: number;
  secondsLeft: number;
  setSecondsLeft: (secondsLeft: number) => void;
}) {
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    setProgress((secondsLeft / initialSeconds) * 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);
  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`text-3xl font-semibold mb-3 ${
            secondsLeft <= 5 ? "text-red-500 animate-ping" : ""
          }`}
        >
          {secondsLeft}
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </>
  );
}
