import dbConnect from "@/lib/dbConnect";
import Score from "@/models/Score";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { scoreData } = await request.json();

    const newScore = await Score.create(scoreData);
    return new NextResponse(JSON.stringify(newScore), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
