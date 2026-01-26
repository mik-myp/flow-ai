import ModelModal from "@/components/modals/ModelModal";
import { createClient } from "@/lib/supabase/server";

export default async function ModelEditModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("model")
    .select("icon,name,description")
    .eq("id", id)
    .single();

  return (
    <ModelModal
      model={{
        id,
        ...(data || {}),
      }}
    />
  );
}
