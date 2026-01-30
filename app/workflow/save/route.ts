import { createClient } from "@/lib/supabase/server";
import { TEdge, TNode } from "@/types/workflow";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { workflowId, nodes, edges } = (await req.json()) as {
    workflowId: string;
    nodes: TNode[];
    edges: TEdge[];
  };

  if (!workflowId) {
    return NextResponse.json({ message: "缺少工作流ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ message: "用户未登录" }, { status: 401 });
  }

  // 1. 首先获取数据库中当前工作流的所有节点和边ID
  const [existingNodes, existingEdges] = await Promise.all([
    supabase.from("node").select("id").eq("work_flow_id", workflowId),
    supabase.from("edge").select("id").eq("work_flow_id", workflowId),
  ]);

  const existingNodeIds = existingNodes.data?.map((n) => n.id) || [];
  const existingEdgeIds = existingEdges.data?.map((e) => e.id) || [];

  // 2. 计算需要删除的ID
  const currentNodeIds = nodes.map((n) => n.id);
  const currentEdgeIds = edges.map((e) => e.id);

  const nodesToDelete = existingNodeIds.filter(
    (id) => !currentNodeIds.includes(id),
  );
  const edgesToDelete = existingEdgeIds.filter(
    (id) => !currentEdgeIds.includes(id),
  );

  // 3. 执行删除（先删边，再删节点，因为边可能依赖节点）
  if (edgesToDelete.length > 0) {
    await supabase.from("edge").delete().in("id", edgesToDelete);
  }

  if (nodesToDelete.length > 0) {
    await supabase.from("node").delete().in("id", nodesToDelete);
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

  const [nodeRes, edgeRes] = await Promise.all([
    supabase.from("node").upsert(nodeParams, { onConflict: "id" }),
    supabase.from("edge").upsert(edgeParams, { onConflict: "id" }),
  ]);

  if (nodeRes.error || edgeRes.error) {
    return NextResponse.json({ message: "保存工作流失败" }, { status: 500 });
  }

  return NextResponse.json({
    message: "保存工作流成功",
  });
}
