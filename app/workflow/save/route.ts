import { createClient } from "@/lib/supabase/server";
import { TEdge, TNode } from "@/types/workflow";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🚀 ~ route.ts:7 ~ POST ~ req:", req);

  const { workflowId, nodes, edges } = (await req.json()) as {
    workflowId: string;
    nodes: TNode[];
    edges: TEdge[];
  };

  if (!workflowId) {
    return NextResponse.json({ error: "缺少工作流ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: "用户未登录" }, { status: 401 });
  }

  const nodeParams = nodes.map((node: TNode) => {
    const { id, data, updated_at, position, type } = node;
    return {
      id,
      data,
      updated_at,
      position,
      type,
      work_flow_id: workflowId,
    };
  });

  console.log("🚀 ~ route.ts:41 ~ POST ~ nodeParams:", nodeParams);

  const edgeParams = edges.map((edge: TEdge) => {
    const { id, updated_at, source, sourceHandle, target, targetHandle, data } =
      edge;
    return {
      id,
      updated_at,
      source,
      sourceHandle,
      target,
      targetHandle,
      data,
      work_flow_id: workflowId,
    };
  });

  console.log("🚀 ~ route.ts:59 ~ POST ~ edgeParams:", edgeParams);

  const [nodeRes, edgeRes] = await Promise.all([
    supabase.from("node").upsert(nodeParams, { onConflict: "id" }),
    supabase.from("edge").upsert(edgeParams, { onConflict: "id" }),
  ]);

  console.log("🚀 ~ route.ts:68 ~ POST ~ edgeRes:", edgeRes);

  console.log("🚀 ~ route.ts:68 ~ POST ~ nodeRes:", nodeRes);

  if (nodeRes.error || edgeRes.error) {
    return NextResponse.json({ error: "保存工作流失败" }, { status: 500 });
  }

  return NextResponse.json({
    message: "保存工作流成功",
  });
}
