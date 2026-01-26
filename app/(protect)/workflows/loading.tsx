import Avatar from "antd/es/skeleton/Avatar";
import CreateWorkflowButton from "./_components/CreateWorkflowButton";
import { Skeleton } from "antd";
import Input from "antd/es/skeleton/Input";
import Button from "antd/es/skeleton/Button";

export default function WorkflowsLoading() {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto">
      <div className="bg-secondary sticky top-0 z-10 mb-4 flex justify-end px-6 pt-7 pb-5">
        <CreateWorkflowButton />
      </div>
      <div className="2k:grid-cols-6 relative mb-4 grid grow grid-cols-1 content-start gap-x-6 gap-y-8 px-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 6 }, (_, index) => index).map((item) => (
          <div
            key={`workflow-skeleton-${item}`}
            className="flex h-50 cursor-pointer flex-col justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar active size={40} shape="square" />
              <div className="flex flex-1 flex-col gap-2">
                <Input active size="small" style={{ width: 140 }} />
                <Input active size="small" style={{ width: 180 }} />
              </div>
            </div>
            <Skeleton paragraph={{ rows: 2 }} title={false} active />
            <div className="flex justify-end gap-2">
              <Button active size="small" />
              <Button active size="small" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
