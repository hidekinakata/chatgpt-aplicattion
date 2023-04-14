import OAIStream, { Payload } from "@/lib/OpenIA";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

interface ReqData extends Payload {}

export async function POST(request: NextRequest) {
  const { prompt, botMood } = (await request.json()) as ReqData;
  const stream = await OAIStream({
    prompt,
    botMood,
  });

  return new Response(stream);
}
