import { createClient } from "./client";
import { createClient as createServerClient } from "./server";

// 获取当前用户的所有workflow
export async function getUserWorkflowsServer() {
  const supabase = await createServerClient();

  // 首先获取当前用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("🚀 ~ queries.ts:13 ~ getUserWorkflowsServer ~ user:", user);

  if (!user) {
    throw new Error("用户未登录");
  }

  // 查询该用户的所有workflow
  const { data, error } = await supabase
    .from("work_flow")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("🚀 ~ queries.ts:26 ~ getUserWorkflowsServer ~ data:", data);

  if (error) {
    console.error("获取workflow失败:", error);
    throw error;
  }

  return data;
}
