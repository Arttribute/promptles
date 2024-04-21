import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Puzzle } from "lucide-react";

export default function StartGameDisplay({
  gameTitle,
  promptlesCount,
  onStartGame,
  timeGiven,
}: {
  gameTitle: string;
  promptlesCount: number;
  onStartGame: () => void;
  timeGiven: number;
}) {
  return (
    <>
      <div className="flex">
        <div className="text-lg font-bold  bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Promptles
        </div>
        <Puzzle className="w-3.5 h-3.5 text-purple-500 text-xs mt-0.5 font-bold" />
      </div>
      <div className=" border py-12 px-8 m-2  rounded-xl w-96 h-96">
        <div className=" flex flex-col items-center justify-center ">
          <div className="text-center mb-10">
            <p className="text-2xl font-semibold ">{gameTitle}</p>
            <p className="text-lg text-gray-500 ">
              {promptlesCount} promptles to solve
            </p>
            <p className="text-md text-gray-500 mt-4">
              You have {timeGiven} seconds to solve each promptle
            </p>
          </div>

          <Button className="rounded-lg mt-1" onClick={onStartGame}>
            Start Game
            <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
