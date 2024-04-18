import User from "@/models/User";

//example tunne
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Promptle from "@/models/Promptle";

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
  const { promptleData } = await request.json();

  try {
    await dbConnect();
    const newPromptle = await Promptle.create(promptleData);
    return new NextResponse(JSON.stringify(newPromptle), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
