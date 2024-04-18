import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const games = await Game.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(games), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { gameData } = await request.json();

    const newGame = await Game.create(gameData);
    return new NextResponse(JSON.stringify(newGame), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
