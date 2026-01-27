export interface IModel {
  id: string;
  name: string;
  provider: ModelProvider;
  model: string;
  apiKey?: string | null;
  baseURL?: string;
  updated_at?: string;
  indexedDB_id?: string | null;
}

export type ModelProvider =
  | "ai-gateway"
  | "openai"
  | "anthropic"
  | "google-genai"
  | "openai-compatible";
