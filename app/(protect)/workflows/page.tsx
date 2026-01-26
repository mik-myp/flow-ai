import React from "react";
import WorkFlowCards from "./_components/WorkFlowCards";
import { getUserWorkflowsServer } from "@/lib/supabase/queries";
import { Empty } from "antd";
import CreateWorkflowButton from "./_components/CreateWorkflowButton";

const WorkFlows: React.FC = async () => {
  const workflows = await getUserWorkflowsServer();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto">
      <div className="bg-secondary sticky top-0 z-10 mb-4 flex justify-end px-6 pt-7 pb-5">
        <CreateWorkflowButton />
      </div>
      {workflows.length > 0 ? (
        <WorkFlowCards workflows={workflows} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="flex flex-1 flex-col items-center justify-center"
        />
      )}
    </div>
  );
};

export default WorkFlows;
