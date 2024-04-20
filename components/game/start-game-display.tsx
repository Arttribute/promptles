import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function StartGameDisplay({
  gameTitle,
  promptlesCount,
  onStartGame,
  handleAttest,
}: {
  gameTitle: string;
  promptlesCount: number;
  onStartGame: () => void;
  handleAttest: () => void;
}) {
  return (
    <div className="w-full">
      <div className="p-2 flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold ">{gameTitle}</p>
        <p className="text-md text-gray-500">
          {promptlesCount} promptles to solve
        </p>
        <Button
          variant="outline"
          className="rounded-lg mt-1"
          onClick={async () => {
            await handleAttest();
            onStartGame();
          }}
        >
          Start Game
          <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
