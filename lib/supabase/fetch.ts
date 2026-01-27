import { isRetryableSupabaseError } from "./errors";

const RETRYABLE_STATUSES = new Set([502, 503, 504]);

type SupabaseFetchOptions = {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
};

const DEFAULT_OPTIONS: Required<SupabaseFetchOptions> = {
  timeoutMs: 8000,
  maxRetries: 2,
  retryDelayMs: 250,
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isRetryableMethod = (method: string) =>
  method === "GET" || method === "HEAD";

export function createSupabaseFetch(
  options: SupabaseFetchOptions = {},
): typeof fetch {
  const { timeoutMs, maxRetries, retryDelayMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const baseFetch = globalThis.fetch;
  if (!baseFetch) {
    throw new Error("fetch is not available in this environment");
  }

  return async (input, init = {}) => {
    const method = (init.method ?? "GET").toUpperCase();
    const canRetry = isRetryableMethod(method);
    const attempts = canRetry ? Math.max(1, maxRetries + 1) : 1;

    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const controller = init.signal ? null : new AbortController();
      const timeout = controller
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

      try {
        const response = await baseFetch(input, {
          ...init,
          signal: init.signal ?? controller?.signal,
        });

        if (
          canRetry &&
          RETRYABLE_STATUSES.has(response.status) &&
          attempt < attempts - 1
        ) {
          response.body?.cancel();
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }

        return response;
      } catch (error) {
        lastError = error;
        if (
          !canRetry ||
          attempt >= attempts - 1 ||
          !isRetryableSupabaseError(error)
        ) {
          throw error;
        }

        await sleep(retryDelayMs * (attempt + 1));
      } finally {
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    }

    throw lastError;
  };
}
