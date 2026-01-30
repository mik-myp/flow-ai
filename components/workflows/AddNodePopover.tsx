import { nodeCatalog } from "@/lib/workflows";
import { Popover } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import EmEmoji from "../emoji/EmEmoji";
import { FlowNodeType } from "@/types/workflow";

type AddNodePopoverProps = {
  children: ReactNode;
  onSelect: (type: FlowNodeType) => void;
  onOpenChange?: (open: boolean) => void;
};

const AddNodePopover = ({
  children,
  onSelect,
  onOpenChange,
}: AddNodePopoverProps) => {
  const [open, setOpen] = useState(false);

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
                    <EmEmoji id={item.meta.icon} />
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
                  <EmEmoji id={item.meta.icon} />
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
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        onOpenChange?.(nextOpen);
      }}
      placement="top"
      arrow={false}
    >
      {children}
    </Popover>
  );
};

export default AddNodePopover;
