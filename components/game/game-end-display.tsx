import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import EnterLeaderboard from "@/components/game/enter-leaderboard";
import Link from "next/link";
import { Puzzle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Leaderboard from "@/components/game/leaderboard";

export default function GameEndDisplay({
  gameTitle,
  score,
  gamescores,
  onchainGameIndex,
  offchainGameId,
  playerId,
  isFirstPlay,
}: {
  gameTitle: string;
  score: number;
  gamescores: any;
  onchainGameIndex: number;
  offchainGameId: string;
  playerId: string;
  isFirstPlay: boolean;
}) {
  return (
    <>
      <div className="flex">
        <div className="text-lg font-bold  bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Promptles
        </div>
        <Puzzle className="w-3.5 h-3.5 text-purple-500 text-xs mt-0.5 font-bold" />
      </div>
      <div className=" border py-4 px-8 m-2 rounded-xl w-96 h-96">
        <Tabs defaultValue="my-score">
          <div className="flex flex-col items-center justify-center ">
            <TabsList className="grid  grid-cols-2 mb-2">
              <TabsTrigger value="my-score" className="font-semibold">
                My Score
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="font-semibold">
                Leaderboard
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="my-score">
            <div className="p-2 flex flex-col items-center justify-center">
              <p className="text-md font-semibold ">{gameTitle}</p>

              <p className="text-3xl font-bold ">{score}</p>
              <p className="text-sm font-semibold">Your Score</p>
              {isFirstPlay && (
                <EnterLeaderboard
                  score={score}
                  onchainGameIndex={onchainGameIndex}
                  offchainGameId={offchainGameId}
                  playerId={playerId}
                />
              )}
              <div className="mt-12">
                <Link href="/games">
                  <Button variant="outline" className="rounded-lg mt-1">
                    Exit Game
                    <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Leaderboard gamescores={gamescores} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
