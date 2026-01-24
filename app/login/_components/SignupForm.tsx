"use client";
import { Button } from "antd";
import { createClient } from "@/lib/supabase/client";
import { GithubOutlined } from "@ant-design/icons";

export function SignupForm() {
  const supabase = createClient();

  const handleLoginWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/workflows`,
      },
    });
  };

  return (
    <Button color="default" variant="solid" onClick={handleLoginWithGithub}>
      <GithubOutlined />
      使用 GitHub 登录
    </Button>
  );
}
