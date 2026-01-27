import ModelModal from "@/components/modals/ModelModal";
import { getModelByIdServer } from "@/lib/supabase/queries";

export default async function ModelEditModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getModelByIdServer(id);

  return (
    <ModelModal
      model={{
        id,
        ...(data || {}),
      }}
    />
  );
}
