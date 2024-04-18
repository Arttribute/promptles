"use client";
import { useState, useEffect } from "react";

export default function WordSelector({
  words,
  correctWords,
  isCorrect,
  setIsCorrect,
}: {
  words: string[];
  correctWords: string[];
  isCorrect: boolean;
  setIsCorrect: (isCorrect: boolean) => void;
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>(words);
  const [emptySlots, setEmptySlots] = useState(correctWords.length);

  useEffect(() => {
    if (selectedWords.length === correctWords.length) {
      checkCorrectness();
    }
  }, [selectedWords, correctWords]);

  const handleOptionClick = (word: string) => {
    if (selectedWords.length < correctWords.length) {
      setSelectedWords([...selectedWords, word]);
      setWordOptions(wordOptions.filter((w) => w !== word));
      setEmptySlots(emptySlots - 1);
    }
  };

  const handleSelectedWordClick = (word: string) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    // Reinsert the word back into its original position based on the original 'words' list
    const newWordOptions = [...wordOptions, word].sort((a, b) => {
      return words.indexOf(a) - words.indexOf(b);
    });
    setWordOptions(newWordOptions);
    setEmptySlots(emptySlots + 1);
  };

  const checkCorrectness = () => {
    if (selectedWords.join(" ") === correctWords.join(" ")) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <>
      <div className="flex">
        {selectedWords.map((word, index) => (
          <div
            key={index}
            className={` m-1 rounded-md border bg-yellow-50 border ${
              selectedWords.length === correctWords.length
                ? isCorrect
                  ? "border-green-500"
                  : "border-red-500 animate-shake"
                : "border-slate-500"
            } `}
            onClick={() => handleSelectedWordClick(word)}
          >
            <div className="px-4 bg-white border  m-0.5 p-0.5 rounded-sm">
              <p className="font-medium ">{word}</p>
            </div>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={index}
            className="px-4 p-1 m-1 rounded-md border border-slate-500 bg-yellow-50 py-4"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-12">
        {wordOptions.map((wordoption: string, index: number) => (
          <div
            key={index}
            className="px-4 p-1 m-1 rounded-md border bg-slate-50 col-span-4 md:col-span-3  text-center"
            onClick={() => handleOptionClick(wordoption)}
          >
            <p className="font-medium ">{wordoption}</p>
          </div>
        ))}
      </div>
    </>
  );
}
