import { nodeCatalog } from "@/lib/workflows/constant";
import { Popover } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import NodeIcon from "@/components/workflows/NodeIcon";
import { FlowNodeType } from "@/types/workflow";

type AddNodePopoverProps = {
  children: ReactNode;
  onSelect: (type: FlowNodeType) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AddNodePopover = ({
  children,
  onSelect,
  open,
  onOpenChange,
}: AddNodePopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const mergedOpen = isControlled ? open : internalOpen;
  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const content = useMemo(
    () => (
      <div className="min-h-75 min-w-35">
        <div
          className="flex max-h-85 flex-col gap-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {nodeCatalog.map((item) => (
            <Popover
              key={item.id}
              content={
                <div className="flex w-50 flex-col gap-1 text-[#101828]">
                  <span className="relative flex h-6 w-6 shrink-0 grow-0 items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-[#10182814] text-[14px]">
                    <NodeIcon icon={item.meta.icon} size={14} />
                  </span>
                  <div>{item.meta.title}</div>
                  <div className="text-[12px] font-normal">
                    {item.meta.description}
                  </div>
                </div>
              }
              placement="right"
              arrow={false}
            >
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(item.type);
                  setOpen(false);
                }}
                onMouseDown={(event) => event.stopPropagation()}
                className="flex h-8 cursor-pointer items-center gap-2 px-2.5 text-[#101828] hover:rounded-sm hover:bg-[#f9fafb]"
              >
                <span className="relative flex h-5 w-5 shrink-0 grow-0 items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-[#10182814] text-[14px]">
                  <NodeIcon icon={item.meta.icon} size={12} />
                </span>
                <span>{item.meta.title}</span>
              </div>
            </Popover>
          ))}
        </div>
      </div>
    ),
    [onSelect],
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={mergedOpen}
      onOpenChange={setOpen}
      placement="top"
      arrow={false}
    >
      {children}
    </Popover>
  );
};

export default AddNodePopover;
