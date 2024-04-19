import * as React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function TimeUpDisplay({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="w-full">
      <div className="p-2 flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold text-red-500">Time's up!</p>

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
