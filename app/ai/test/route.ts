import { createGateway, streamText } from "ai";

export async function POST(req: Request) {
  let body: {
    provider: string;
    model: string;
    apiKey: string;
    baseURL?: string;
  } | null = null;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { provider, model, apiKey, baseURL } = body ?? {};

  if (provider !== "ai-gateway") {
    return Response.json(
      { error: "Only ai-gateway is supported for now." },
      { status: 400 },
    );
  }

  if (!model || typeof model !== "string") {
    return Response.json({ error: "Model is required." }, { status: 400 });
  }

  if (!apiKey || typeof apiKey !== "string") {
    return Response.json({ error: "API key is required." }, { status: 400 });
  }

  const safeBaseURL =
    typeof baseURL === "string" && baseURL.trim() ? baseURL.trim() : undefined;
  const gateway = createGateway({
    apiKey,
    baseURL: safeBaseURL,
  });

  const result = streamText({
    model: gateway(model),
    prompt: "ping",
  });

  return result.toUIMessageStreamResponse();
}
