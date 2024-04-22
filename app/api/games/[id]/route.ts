import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";
import Promptle from "@/models/Promptle";
import Score from "@/models/Score";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log("id:", id);
    const gameres = await Game.find({ _id: id }).populate("owner");
    const game = gameres[0];
    const promptles = await Promptle.find({ game_id: id }).populate("owner");
    const scores = await Score.find({ game_id: id }).populate("player");
    return new NextResponse(JSON.stringify({ id, game, promptles, scores }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
