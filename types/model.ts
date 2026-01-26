export interface IModel {
  id: string;
  name: string;
  provider: ModelProvider;
  model: string;
  apiKey: string;
  baseURL?: string;
  updated_at?: string;
}

export type ModelProvider =
  | "ai-gateway"
  | "openai"
  | "anthropic"
  | "google-genai"
  | "openai-compatible";
