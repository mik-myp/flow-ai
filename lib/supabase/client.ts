import { createBrowserClient } from "@supabase/ssr";
import { createSupabaseFetch } from "./fetch";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: createSupabaseFetch(),
      },
    },
  );

  return browserClient;
}
