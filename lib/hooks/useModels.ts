import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getModelApiKey } from "../indexeddb/model-api-keys";
import { IModel } from "@/types/model";

export function useModels<T>() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        return [] as T;
      }

      const { data, error } = await supabase
        .from("model")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const newData = await Promise.all(
        data.map(async (model: IModel) => {
          return {
            ...model,
            apiKey: await getModelApiKey(model.indexedDB_id),
          };
        }),
      );
      return newData as T;
    },
  });
}
