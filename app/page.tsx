"use client";
import Image from "next/image";
import ImagesDisplay from "@/components/game/images-display";
import WordSelector from "@/components/game/word-selector";

import { useState, useEffect } from "react";

const images = [
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
];

const words = [
  "Word 1",
  "Word 2",
  "Word 3",
  "Word 4",
  "Word 5",
  "Word 6",
  "Word 7",
  "Loremipsumelit.",
];
const correctWords = ["Word 1", "Word 2", "Word 3", "Word 4", "Word 5"];

export default function Home() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <ImagesDisplay images={images} />
        <WordSelector
          words={words}
          correctWords={correctWords}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
        />
      </div>
    </div>
  );
}
