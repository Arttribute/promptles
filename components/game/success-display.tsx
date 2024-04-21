"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function SuccessDisplay({
  solution,
  onContinue,
}: {
  solution: string;
  onContinue: () => void;
}) {
  return (
    <div className="w-full">
      <div className="p-2 flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold text-green-500">Correct !</p>
        <p className="text-md text-gray-500">solution: {solution}</p>
        <Button
          variant="outline"
          className="rounded-lg mt-1"
          onClick={onContinue}
        >
          Go to next promptle
          <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
