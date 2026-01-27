const RETRYABLE_ERROR_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
  "ECONNREFUSED",
]);

type ErrorWithCause = Error & { cause?: unknown };
type SupabaseAuthError = {
  __isAuthError?: boolean;
  status?: number;
  code?: unknown;
  message?: string;
  cause?: unknown;
};

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const anyError = error as { code?: unknown; cause?: unknown };
  if (typeof anyError.code === "string") {
    return anyError.code;
  }

  const cause = anyError.cause;
  if (cause && typeof cause === "object") {
    const causeCode = (cause as { code?: unknown }).code;
    if (typeof causeCode === "string") {
      return causeCode;
    }
  }

  return undefined;
}

export function isRetryableSupabaseError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const authError = error as SupabaseAuthError;
  if (authError.__isAuthError && authError.status === 0) {
    return true;
  }

  const message =
    typeof authError.message === "string" ? authError.message : "";
  if (message.toLowerCase().includes("fetch failed")) {
    return true;
  }

  const errorCode = getErrorCode(error);
  return errorCode ? RETRYABLE_ERROR_CODES.has(errorCode) : false;
}

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = getErrorCode(error as ErrorWithCause);
    return code ? `${error.message} (${code})` : error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

export function logSupabaseError(context: string, error: unknown) {
  const message = getSupabaseErrorMessage(error);
  console.error(`[supabase] ${context}: ${message}`, error);
}
