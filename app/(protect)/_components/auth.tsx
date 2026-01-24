import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const Auth = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) {
    redirect("/login");
  }

  return null;
};

export default Auth;
