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

export function ModelSelector({
  setSelectedModelId,
}: {
  setSelectedModelId: (selectedModelId: string) => void;
}) {
  const [tunedmodels, setTunedModels] = useState<Array<any>>([]);

  useEffect(() => {
    getTunedModels();
  }, []);

  async function getTunedModels() {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tunedmodels`
      );
      setTunedModels(result.data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Select onValueChange={(value) => setSelectedModelId(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a custom AI art model to generate images" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Custom Models made by Artists</SelectLabel>
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
