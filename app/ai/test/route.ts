import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { provider, model, apiKey, baseURL } = await req.json();

  const result = streamText({
    model,
    system: "",
  });

  return result.toUIMessageStreamResponse();
}
