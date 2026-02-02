"use client";

import { Button } from "antd";
import { createClient } from "@/lib/supabase/client";
import { GithubOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLoginWithGithub = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/workflows`,
      },
    });
  };

  return (
    <Button
      type="primary"
      size="large"
      block
      className="h-12 rounded-full text-sm font-semibold"
      onClick={handleLoginWithGithub}
      loading={loading}
    >
      <GithubOutlined />
      使用 GitHub 登录
    </Button>
  );
}
