import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";
import Promptle from "@/models/Promptle";
import Score from "@/models/Score";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const game = await Game.findById(id).populate("owner");
    console.log("game", game);
    const promptles = await Promptle.find({ game_id: id }).populate("owner");
    const scores = await Score.find({ game_id: id }).populate("player");
    return new NextResponse(JSON.stringify({ game, promptles, scores }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
