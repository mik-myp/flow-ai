import { IHandle } from "@/types/workflow";
import { Handle, Position, useNodeConnections } from "@xyflow/react";

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
      <div className="relative -left-2 flex flex-row items-center">
        {theHandles[0] && (
          <>
            <Handle
              type="source"
              position={Position.Left}
              className="h-4! w-4! rounded-none! border-0! bg-transparent!"
              id={theHandles[0].handleId}
              isConnectable={
                sourceConnections.length < (theHandles[0].connectionCount || 1)
              }
            ></Handle>
            <label className="px-3">{theHandles[0].label}</label>
          </>
        )}
      </div>
      <div className="relative -right-2 flex flex-row-reverse items-center justify-end justify-self-end">
        {theHandles[1] && (
          <>
            <Handle
              type="target"
              position={Position.Right}
              className="h-4! w-4! rounded-none! border-0! bg-transparent!"
              id={theHandles[1].handleId}
              isConnectable={
                targetConnections.length < (theHandles[1].connectionCount || 1)
              }
            ></Handle>
            <label className="px-3">{theHandles[1].label}</label>
          </>
        )}
      </div>
    </div>
  );
};
export default FlowHandle;
