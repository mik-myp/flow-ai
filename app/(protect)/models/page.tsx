import React from "react";
import { getUserModelsServer } from "@/lib/supabase/queries";
import ModelTable from "./_components/ModelTable";

const Models: React.FC = async () => {
  const models = await getUserModelsServer();

  return <ModelTable models={models} />;
};

export default Models;
