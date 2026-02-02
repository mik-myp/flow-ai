import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import { nodeMeta } from "@/lib/workflows/constant";
import AddNodePopover from "../AddNodePopover";
import { Plus } from "lucide-react";
import { Tooltip } from "antd";

const BaseNode = ({
  selected,
  data,
  type,
  showTarget = true,
  showSource = true,
}: NodeProps<Node<BaseNodeData, FlowNodeType>> & {
  showTarget?: boolean;
  showSource?: boolean;
}) => {
  const [isShowTooltip, setIsShowTooltip] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const nodeData = useMemo(() => {
    const node = nodeMeta[type];
    return {
      iconProps: node.meta.iconProps,
      title: data.title ?? node.meta.title,
    };
  }, [type, data]);

  return (
    <div
      className={clsx(
        "min-w-60 rounded-xl bg-white p-3 shadow-sm",
        "transition-shadow",
        selected && "shadow-md ring-2 ring-blue-500",
      )}
    >
      {showTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="h-7.5! w-7.5! rounded-none! border-0! bg-transparent!"
        ></Handle>
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="group h-7.5! w-7.5! rounded-none! border-0! bg-transparent!"
          // onClick={(e) => {
          //   e.stopPropagation();
          //   setIsShowTooltip(false);
          //   setPopoverOpen(true);
          // }}
          // onMouseEnter={() => !popoverOpen && setIsShowTooltip(true)}
          // onMouseLeave={() => setIsShowTooltip(false)}
        >
          {/* <div className="pointer-events-none absolute top-2 right-1.5 flex h-4 w-4 items-center justify-center rounded-2xl bg-[#2970ff] transition-all group-hover:scale-130">
            <AddNodePopover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Tooltip
                title="点击添加节点"
                styles={{
                  container: {
                    background: "#fff",
                    color: "#354052",
                    fontSize: "12px",
                  },
                }}
                color="#fff"
                open={isShowTooltip}
                getPopupContainer={() =>
                  document.getElementById("xflow-container") as HTMLElement
                }
              >
                <Plus size={12} className="text-white" />
              </Tooltip>
            </AddNodePopover>{" "}
          </div> */}
        </Handle>
      )}
      <div className="flex items-center gap-2 text-sm text-black">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-white"
          style={{
            backgroundColor: nodeData.iconProps.bgColor,
          }}
        >
          {nodeData.iconProps.icon && <nodeData.iconProps.icon size={16} />}
        </span>
        <div className="truncate font-bold">{nodeData.title}</div>
      </div>
    </div>
  );
};

export default BaseNode;
