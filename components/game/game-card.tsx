import * as React from "react";

import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Label } from "@/components/ui/label";

export default function GameCard({ game }: { game: any }) {
  return (
    <Link href={`/games/${game._id}`}>
      <Card>
        <Image
          src="/promptle-default.webp"
          width={180}
          height={180}
          alt={"game"}
          className="aspect-[1] rounded-md m-1 lg:m-2"
        />

        <div className="flex  m-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={game.owner?.picture} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2 mt-1">
            <Label className="font-semibold">{game.game_title}</Label>
            <Label className="text-xs text-gray-500">
              {" "}
              by {game.owner?.name}
            </Label>
          </div>
        </div>
      </Card>
    </Link>
  );
}
