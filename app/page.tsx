"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import AppBar from "@/components/layout/appbar";
import { Puzzle } from "lucide-react";

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
      <AppBar />{" "}
      <div className=" my-20 mx-6 shadow-pink-800 ">
        <div className="flex flex-col items-center justify-center w-full ">
          <main className="flex flex-col items-center justify-center py-20 ">
            <div className="text-center ">
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex">
                  <div className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Promptles
                  </div>
                  <Puzzle className="w-6 h-6 lg:w-10 lg:h-10 text-purple-500 text-xs mt-2 font-bold" />
                </div>
              </div>

              <h2 className="text-2xl lg:text-5xl font-semibold text-gray-700">
                The AI Art Guessing Game
              </h2>
              <div className="px-4">
                <p className="mt-3 text-sm lg:text-lg text-gray-500 ">
                  Create and compete in unique AI Art challenges where you guess
                  the prompt
                  <br /> that generated an image for a spot on an onchain
                  leaderboard
                </p>
              </div>
              <div className="mt-6">
                <Link href="/games">
                  <Button className="px-12">Start Playing</Button>
                </Link>

                <Link href="/create">
                  <Button variant="outline" className="m-2 lg:ml-2 px-8">
                    Create Promptles
                  </Button>
                </Link>
                <div
                  className="absolute bottom-10 right-40 "
                  style={{
                    boxShadow:
                      "0 0 120px 20px #f8bbd0, 0 0 260px 140px #fffde7, 0 0 200px 160px #ede7f6, 0 0 200px 120px #ede7f6",
                    zIndex: -1,
                  }}
                ></div>
                <div
                  className="absolute bottom-40 left-40 "
                  style={{
                    boxShadow:
                      "0 0 120px 20px #f8bbd0, 0 0 260px 140px #ede7f6, 0 0 200px 160px #ede7f6, 0 0 200px 120px #ede7f6",
                    zIndex: -1,
                  }}
                ></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
