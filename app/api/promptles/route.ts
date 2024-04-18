import User from "@/models/User";

//example tunne
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Promptle from "@/models/Promptle";

const API_KEY = process.env.ASTRIA_API_KEY;

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
  const { promptleData, textToImageObject, modelId, cost } =
    await request.json();

  try {
    await dbConnect();
    const promptRes = await fetch(
      `https://api.astria.ai/tunes/${modelId}/prompts`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textToImageObject),
      }
    );

    const text2Imageres = await promptRes.json();
    console.log("text2image:", text2Imageres);

    const newPromptle = await Promptle.create({
      ...promptleData,
      prompt_id: text2Imageres.id.toString(),
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
