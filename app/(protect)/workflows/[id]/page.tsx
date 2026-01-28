import { ReactFlowProvider } from "@xyflow/react";
import WorkFlowCanvas from "../_components/WorkFlowCanvas";
import { getWorkflowByIdServer } from "@/lib/supabase/queries";

export default async function WorkflowDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflowDetail = await getWorkflowByIdServer(id);

  return (
    <ReactFlowProvider>
      <WorkFlowCanvas
        key={id}
        workflowId={id}
        workflowDetail={workflowDetail}
      />
    </ReactFlowProvider>
  );
}
