"use client";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

const WorkFlows: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      WorkFlows
      <Link href="/workflows/1" onClick={toggleSidebar}>
        1
      </Link>
    </div>
  );
};

export default WorkFlows;
