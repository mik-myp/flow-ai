import WorkflowModal from "@/components/modals/WorkflowModal";
import { getWorkflowByIdServer } from "@/lib/supabase/queries";

export default async function WorkflowEditModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getWorkflowByIdServer(id);

  return (
    <WorkflowModal
      workflow={{
        id,
        ...(data || {}),
      }}
    />
  );
}
