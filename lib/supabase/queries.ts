import { createClient as createServerClient } from "./server";
import { isRetryableSupabaseError, logSupabaseError } from "./errors";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerClient>>;

async function getServerUserId(
  supabase: SupabaseServerClient,
  context: string,
) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (isRetryableSupabaseError(error)) {
        logSupabaseError(`${context}.getUser`, error);
        return null;
      }
      throw error;
    }

    return user?.id ?? null;
  } catch (error) {
    if (isRetryableSupabaseError(error)) {
      logSupabaseError(`${context}.getUser`, error);
      return null;
    }
    throw error;
  }
}

function handleRetryableError<T>(
  context: string,
  error: unknown,
  fallback: T,
): T {
  if (isRetryableSupabaseError(error)) {
    logSupabaseError(context, error);
    return fallback;
  }
  throw error;
}

// 获取当前用户的所有workflow
export async function getUserWorkflowsServer() {
  const supabase = await createServerClient();

  const userId = await getServerUserId(supabase, "getUserWorkflowsServer");
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("work_flow")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return handleRetryableError("getUserWorkflowsServer", error, []);
    }

    return data ?? [];
  } catch (error) {
    return handleRetryableError("getUserWorkflowsServer", error, []);
  }
}

// 获取当前用户的所有model
export async function getUserModelsServer() {
  const supabase = await createServerClient();

  const userId = await getServerUserId(supabase, "getUserModelsServer");
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("model")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return handleRetryableError("getUserModelsServer", error, []);
    }

    return data ?? [];
  } catch (error) {
    return handleRetryableError("getUserModelsServer", error, []);
  }
}

export async function getWorkflowByIdServer(id: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("work_flow")
      .select("id,name,description,updated_at,icon")
      .eq("id", id)
      .single();

    if (error) {
      logSupabaseError("getWorkflowByIdServer", error);
      return null;
    }

    return data ?? null;
  } catch (error) {
    logSupabaseError("getWorkflowByIdServer", error);
    return null;
  }
}

export async function getModelByIdServer(id: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("model")
      .select("id,name,provider,model,baseURL,indexedDB_id")
      .eq("id", id)
      .single();

    if (error) {
      logSupabaseError("getModelByIdServer", error);
      return null;
    }

    return data ?? null;
  } catch (error) {
    logSupabaseError("getModelByIdServer", error);
    return null;
  }
}
