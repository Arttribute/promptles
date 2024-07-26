"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function ModelSelector({
  setSelectedModelId,
}: {
  setSelectedModelId: (selectedModelId: string) => void;
}) {
  const [tunedmodels, setTunedModels] = useState<Array<any>>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    getTunedModels();
  }, []);

  async function getTunedModels() {
    setLoadingModels(true);
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tunedmodels`
      );
      setTunedModels(result.data);
    } catch (error) {
      console.error(error);
    }
    setLoadingModels(false);
  }
  return (
    <Select onValueChange={(value) => setSelectedModelId(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a custom AI art model to generate images" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Custom Models made by Artists</SelectLabel>
          {loadingModels && (
            <div className="flex items-center justify-center text-sm font-soft text-gray-500">
              Loading models...
              <Loader2 className="ml-1 h-3 w-3 animate-spin" />
            </div>
          )}
          {tunedmodels.map((model) => (
            <SelectItem key={model._id} value={model.model_id}>
              <div className="flex">
                <Image
                  src={model.display_image}
                  alt="model image"
                  width={24}
                  height={24}
                  className="rounded-md aspect-[1/1] object-fit mr-2"
                />
                {model.model_name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
