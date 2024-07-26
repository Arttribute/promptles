import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestbody = await request.json();
    const { input } = requestbody;

    const promtplesPrompt = `You are an assistant whose goal is to generate prompt puzzles - Promptles - designed to output JSON. The game is simple you provide a prompt that is used to generate an image and decoy words that are used to confuse the player as the player tries to guess the words in the prompt used to generate the image.
        You will be given a theme on which to generate the prompts and decoys.The prompt and and the decoys together should be a total of at least 8 words and at most 12 words. You can make the game harder by providing more decoy words than pompt words. Remember that the prompts and decoys should be related to the theme given. The theme for this game is:${input}.
        The format of your JSON response as given in the example below:
        {
          "prompts":[ "cat naps on cozy window","ball rolls downhill","book lies on table"],
          "decoys": ["sleepy quiet sunlight","slope bounce round sphere moving","story read paper study"],
        }
        Note:The prompt and decoy wordsin the same index should be related or similar but not the same in order to confuse the player. Also, do not include commas or any other special characters in the prmpts or decoys.  
        Genarate a set a of 5 prompts and decoys that are related to the theme given.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: promtplesPrompt,
        },
        { role: "user", content: input },
      ],
      temperature: 1,
      max_tokens: 1600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return new NextResponse(response.choices[0].message.content, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
