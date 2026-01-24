"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="bg-muted/50 flex h-screen items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Frown className="text-muted-foreground size-8" />
          </EmptyMedia>
          <EmptyTitle>授权登录失败</EmptyTitle>
          <EmptyDescription>
            很抱歉，登录过程中出现了问题，请尝试重新登录
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/login">
            <Button variant="default" size="lg">
              返回登录页面
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
