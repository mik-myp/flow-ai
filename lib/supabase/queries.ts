import { createClient } from "./client";
import { createClient as createServerClient } from "./server";

// 获取当前用户的所有workflow
export async function getUserWorkflowsServer() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("work_flow")
    .select("*")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("获取workflow失败:", error);
    throw error;
  }

  return data;
}

// 获取当前用户的所有model
export async function getUserModelsServer() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("model")
    .select("*")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("获取model失败:", error);
    throw error;
  }

  return data;
}
