import dbConnect from "@/lib/dbConnect";
import Promptle from "@/models/Promptle";
import { NextResponse } from "next/server";
export const revalidate = 0;
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const promptle = await Promptle.findById(id)
      .populate("game_id")
      .populate("owner");
    return new NextResponse(JSON.stringify(promptle), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { images, status } = await request.json();

    const updatedPromptle = await Promptle.findByIdAndUpdate(
      id,
      { images, status },
      {
        new: true,
      }
    );
    return new NextResponse(JSON.stringify(updatedPromptle), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
