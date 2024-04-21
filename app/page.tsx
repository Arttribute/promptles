"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import AppBar from "@/components/layout/appbar";

export default function Home() {
  const [games, setGames] = useState([]);

  const getGames = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/games`, {
      next: { revalidate: 5 },
    });
    const data = await res.json();
    setGames(data);
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <div>
      <AppBar />
      <div className="flex flex-col items-center justify-center h-full w-full">
        <main className="flex flex-col items-center justify-center min-h-screen ">
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              The AI art guessing game platform
            </h1>
            <p className="mt-3 text-xl">
              Create and compete in unique challenges, for a spot on an onchain
              leaderboard secured by Sign Protocol attestations.
            </p>
            <div className="mt-6">
              <Link href="/games">
                <Button className="px-12">Start Playing</Button>
              </Link>

              <Link href="/create">
                <Button variant="outline" className="ml-2 px-8">
                  Create Ptomptles
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
