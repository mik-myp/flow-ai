import WorkflowModal from "@/components/modals/WorkflowModal";
import { createClient } from "@/lib/supabase/server";

export default async function WorkflowEditModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data } = await supabase
    .from("work_flow")
    .select("icon,name,description")
    .eq("id", id)
    .single();

  return (
    <WorkflowModal
      workflow={{
        id,
        ...(data || {}),
      }}
    />
  );
}
