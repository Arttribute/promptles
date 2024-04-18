import User from "@/models/User";

//example tunne
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Promptle from "@/models/Promptle";
import { GenerationResponse } from "@/models/StableDiffuser";

export async function GET() {
  try {
    await dbConnect();
    const promptles = await Promptle.find()
      .sort({ createdAt: -1 })
      .populate("game_id")
      .populate("owner");

    return new NextResponse(JSON.stringify(promptles), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const engineId = "stable-diffusion-xl-1024-v1-0";
  const { promptleData, textToImageObject, cost } = await request.json();

  try {
    await dbConnect();

    if (!process.env.SD_API_KEY) throw new Error("Missing Stability API key.");
    const stabilityApiHost =
      process.env.SD_API_HOST ?? "https://api.stability.ai";

    const promptRes = await fetch(
      `${stabilityApiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.SD_API_KEY}`,
        },
        body: JSON.stringify(textToImageObject),
      }
    );

    const text2Imageres: GenerationResponse = await promptRes.json();

    const newPromptle = await Promptle.create({
      ...promptleData,
      prompt_id: Date.now().toString(), // this is random, SD doesn't have a prompt_id like Astria to save model
      images: text2Imageres.artifacts.map((artifact) => artifact.base64), // base64 images
    });

    const user = await User.findByIdAndUpdate(
      { _id: promptleData.owner },
      { $inc: { credits: -cost } },
      { new: true }
    );
    return new NextResponse(JSON.stringify({ newPromptle, user }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
