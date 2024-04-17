"use client";

import { Button } from "../ui/button";

export default function AddPromptField({
  promptFieldsCount,
  setPromptFieldCount,
}: {
  promptFieldsCount: number;
  setPromptFieldCount: (promptFieldsCount: number) => void;
}) {
  const addPromptFieldCount = () => {
    setPromptFieldCount(promptFieldsCount + 1);
  };

  return (
    <>
      <div className="p-0.5 m-0.5 rounded-lg w-96 ml-auto">
        <Button variant="outline" onClick={addPromptFieldCount}>
          Add another
        </Button>
      </div>
    </>
  );
}
