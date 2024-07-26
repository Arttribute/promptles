import * as React from "react";

export default function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center mt-4 p-2 border rounded-lg w-full">
      <p className="text-xl lg:text-3xl font-semibold">{score}</p>
      <p className="text-sm lg:text-md font-medium ">Score</p>
    </div>
  );
}
