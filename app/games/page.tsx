"use client";
import Link from "next/link";
import AppBar from "@/components/layout/appbar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequireAuthPlaceholder from "@/components/account/require-auth-placeholder";

import GameCard from "@/components/game/game-card";

export default function Games() {
  const [games, setGames] = useState([]);
  const [myGames, setMyGames] = useState([]);
  const [account, setAccount] = useState(null);
  const [loadedAccount, setLoadedAccount] = useState(false);

  const getGames = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/games`, {
      next: { revalidate: 5 },
    });
    const data = await res.json();
    setGames(data);
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (user) {
      const myGames = data.filter((game: any) => game.owner._id === user._id);
      setMyGames(myGames);
    }
  };

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    setLoadedAccount(true);
    setAccount(user);
    getGames();
  }, []);

  return (
    <div>
      <AppBar />
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <Tabs defaultValue="all-games">
          <div className="flex flex-col items-center justify-center ">
            <TabsList className="grid  grid-cols-2 w-96 mb-2">
              <TabsTrigger value="all-games" className="font-semibold">
                All games
              </TabsTrigger>
              <TabsTrigger value="my-games" className="font-semibold">
                My games
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all-games">
            <div className="grid grid-cols-12 gap-2">
              {games &&
                games.map((game: any) => (
                  <div className="col-span-3" key={game._id}>
                    <GameCard game={game} />
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="my-games">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 text-center mt-6">
                <Link href="/create">
                  <Button className="ml-2 px-8">Create New Game</Button>
                </Link>
              </div>
              {myGames &&
                myGames.map((game: any) => (
                  <div className="col-span-3" key={game._id}>
                    <GameCard game={game} />
                  </div>
                ))}

              {myGames.length === 0 && account && (
                <div className="col-span-12 text-center mt-6">
                  <div className="text-2xl font-semibold text-gray-500">
                    No games yet ...
                  </div>
                  <div className="text-medium font-normal mt-2 text-gray-500">
                    Create a game and share it with your friends
                  </div>
                  <div className="mt-6">
                    <Link href="/create">
                      <Button className="ml-2 px-8">Create Promptles</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {!account && loadedAccount && <RequireAuthPlaceholder />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
