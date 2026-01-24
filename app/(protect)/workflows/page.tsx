import { Button } from "@/components/ui/button";
import React from "react";
import WorkFlowCards from "./_components/work-flow-cards";
import { getUserWorkflowsServer } from "@/lib/supabase/queries";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderX } from "lucide-react";
const WorkFlows: React.FC = async () => {
  const workflows = await getUserWorkflowsServer();

  return (
    <>
      <div className="relative flex h-full flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 mb-4 flex justify-end bg-[#fbfafc] px-6 pt-7 pb-5">
          <Button>创建工作流</Button>
        </div>
        {workflows.length > 0 ? (
          <WorkFlowCards workflows={workflows} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderX />
              </EmptyMedia>
              <EmptyTitle>暂无数据</EmptyTitle>
              <EmptyDescription>
                你还没有创建任何工作流，快去创建一个吧！
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </>
  );
};

export default WorkFlows;
