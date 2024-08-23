import { studioConnect, studioDisconnect } from "@/lib/studioConnect";
import { NextResponse } from "next/server";
import TunedModel from "@/models/TunedModel";

export const revalidate = 0;
export async function GET() {
  try {
    await studioConnect();
    const tunedmodels = await TunedModel.find().sort({ createdAt: -1 });
    await studioDisconnect();
    return new NextResponse(JSON.stringify(tunedmodels), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
