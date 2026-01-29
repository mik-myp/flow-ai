import { createClient as createServerClient } from "./server";
import { isRetryableSupabaseError, logSupabaseError } from "./errors";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerClient>>;

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
      return handleRetryableError(`${context}.getUser`, error, null);
    }

    return user?.id ?? null;
  } catch (error) {
    return handleRetryableError(`${context}.getUser`, error, null);
  }
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
export async function getWorkflowWithNodeAndEdgeByIdServer(id: string) {
  const supabase = await createServerClient();

  try {
    const [workflowRes, nodesRes, edgesRes] = await Promise.all([
      supabase.from("work_flow").select("*").eq("id", id).single(),
      supabase.from("node").select("*").eq("work_flow_id", id),
      supabase.from("edge").select("*").eq("work_flow_id", id),
    ]);

    if (workflowRes.error || nodesRes.error || edgesRes.error) {
      return handleRetryableError(
        "getWorkflowWithNodeAndEdgeByIdServer",
        workflowRes.error || nodesRes.error || edgesRes.error,
        {
          workflow: {},
          nodes: [],
          edges: [],
        },
      );
    }

    return {
      workflow: workflowRes.data,
      nodes: nodesRes.data,
      edges: edgesRes.data,
    };
  } catch (error) {
    return handleRetryableError("getWorkflowWithNodeAndEdgeByIdServer", error, {
      workflow: {},
      nodes: [],
      edges: [],
    });
  }
}

export async function getWorkflowByIdServer(id: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("work_flow")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return handleRetryableError("getWorkflowByIdServer", error, null);
    }

    return data ?? null;
  } catch (error) {
    return handleRetryableError("getWorkflowByIdServer", error, null);
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

export async function getModelByIdServer(id: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("model")
      .select("id,name,provider,model,baseURL,indexedDB_id")
      .eq("id", id)
      .single();

    if (error) {
      return handleRetryableError("getModelByIdServer", error, null);
    }

    return data ?? null;
  } catch (error) {
    return handleRetryableError("getModelByIdServer", error, null);
  }
}
