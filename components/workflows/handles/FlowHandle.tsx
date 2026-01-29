import { IHandle } from "@/types/workflow";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import { Plus } from "lucide-react";

const FlowHandle = ({ handles }: { handles: IHandle | (IHandle | null)[] }) => {
  const theHandles = Array.isArray(handles) ? handles : [handles];

  const sourceConnections = useNodeConnections({
    handleType: "source",
    handleId: theHandles[0]?.handleId,
  });

  const targetConnections = useNodeConnections({
    handleType: "target",
    handleId: theHandles[1]?.handleId,
  });

  return (
    <div className="flex w-full items-center justify-between pt-1">
      <div className="relative -left-3 flex flex-row items-center">
        {theHandles[0] && (
          <>
            <Handle
              type="source"
              position={Position.Left}
              className="h-6! w-6! rounded-none! border-0! bg-transparent!"
              id={theHandles[0].handleId}
              isConnectable={
                sourceConnections.length < (theHandles[0].connectionCount || 1)
              }
            >
              <Plus
                className="pointer-events-none absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-2xl bg-[#2970ff] transition-all"
                size={10}
                color="#fff"
              />
            </Handle>
            <label htmlFor="" className="px-3">
              {theHandles[0].label}
            </label>
          </>
        )}
      </div>
      <div className="relative -right-3 flex flex-row-reverse items-center justify-end justify-self-end">
        {theHandles[1] && (
          <>
            <Handle
              type="target"
              position={Position.Right}
              className="h-6! w-6! rounded-none! border-0! bg-transparent!"
              id={theHandles[1].handleId}
              isConnectable={
                targetConnections.length < (theHandles[1].connectionCount || 1)
              }
            >
              <Plus
                className="pointer-events-none absolute top-1 right-0.75 flex h-4 w-4 items-center justify-center rounded-2xl bg-[#2970ff] transition-all"
                size={10}
                color="#fff"
              />
            </Handle>
            <label htmlFor="" className="px-3">
              {theHandles[1].label}
            </label>
          </>
        )}
      </div>
    </div>
  );
};
export default FlowHandle;
