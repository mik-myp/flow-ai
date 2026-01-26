"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function CreateWorkflowButton() {
  const router = useRouter();

  return (
    <Button type="primary" onClick={() => router.push("/workflows/new")}>
      创建工作流
    </Button>
  );
}
