import { Panel, useReactFlow, useViewport } from "@xyflow/react";
import { Button, Popover, Tooltip } from "antd";
import {
  Hand,
  Maximize2,
  Minimize2,
  MousePointer2,
  Plus,
  Redo2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useState } from "react";
import AddNodePopover from "./AddNodePopover";
import useWorkFlow from "@/lib/workflows/store";

type FlowControlsProps = {
  /** 开始添加节点 */
  onStartAddNode: (type: string) => void;
  // /** 撤销 */
  // onUndo: () => void;
  // /** 重做 */
  // onRedo: () => void;
  // /** 是否可以撤销 */
  // canUndo: boolean;
  // /** 是否可以重做 */
  // canRedo: boolean;
  /** 模式：指针模式 | 手模式 */
  interactionMode: "pointer" | "hand";
  /** 改变模式 */
  onModeChange: (mode: "pointer" | "hand") => void;
  /** 切换全屏 */
  onToggleFullscreen: () => void;
  /** 是否全屏 */
  isFullscreen: boolean;
};

const panelItemClassName =
  "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur";

const zoomList = [
  {
    label: "200%",
    value: 200,
  },
  {
    label: "100%",
    value: 100,
  },
  {
    label: "75%",
    value: 75,
  },
  {
    label: "50%",
    value: 50,
  },
  {
    label: "25%",
    value: 25,
  },
];

const FlowControls = ({
  onStartAddNode,
  // onUndo,
  // onRedo,
  // canUndo,
  // canRedo,
  interactionMode,
  onModeChange,
  onToggleFullscreen,
  isFullscreen,
}: FlowControlsProps) => {
  const { startAddPreviewNode } = useWorkFlow();
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);
  const [viewOpen, setViewOpen] = useState(false);

  const zoomContent = useMemo(
    () => (
      <div>
        <div>
          {zoomList.map((zoom) => {
            return (
              <div
                onClick={() => {
                  zoomTo(zoom.value / 100);
                }}
                key={zoom.value}
                className="flex h-7.5 cursor-pointer items-center justify-between rounded-lg px-2.5 text-sm text-black"
              >
                {zoom.label}
              </div>
            );
          })}
        </div>
        <div className="m-1 h-px bg-[#f3f4f6]"></div>
        <div
          onClick={() => {
            fitView({ padding: 0.2 });
            setViewOpen(false);
          }}
          className="flex h-7.5 cursor-pointer items-center justify-between rounded-lg px-2.5 text-sm text-black"
        >
          自适应视图
        </div>
      </div>
    ),
    [fitView, zoomTo],
  );

  return (
    <Panel position="bottom-left" className="m-4! flex flex-row gap-4">
      <div className={panelItemClassName}>
        <Tooltip title="放大">
          <Button
            type="text"
            icon={<ZoomIn size={16} />}
            onClick={() => zoomIn()}
          />
        </Tooltip>

        <Popover
          content={zoomContent}
          trigger="click"
          open={viewOpen}
          onOpenChange={setViewOpen}
          arrow={false}
        >
          <span className="cursor-pointer">{zoomPercent}%</span>
        </Popover>

        <Tooltip title="缩小">
          <Button
            type="text"
            icon={<ZoomOut size={16} />}
            onClick={() => zoomOut()}
          />
        </Tooltip>
      </div>
      {/* <div className={panelItemClassName}>
        <Tooltip title="撤销">
          <Button
            type="text"
            icon={<Undo2 size={16} />}
            onClick={onUndo}
            disabled={!canUndo}
          />
        </Tooltip>
        <Tooltip title="重做">
          <Button
            type="text"
            icon={<Redo2 size={16} />}
            onClick={onRedo}
            disabled={!canRedo}
          />
        </Tooltip>
      </div> */}
      <div className={panelItemClassName}>
        <AddNodePopover onSelect={onStartAddNode}>
          <Tooltip title="添加节点">
            <Button type="text" icon={<Plus size={16} />} />
          </Tooltip>
        </AddNodePopover>
        <Tooltip title="指针模式">
          <Button
            variant="text"
            color={interactionMode === "pointer" ? "primary" : "default"}
            icon={<MousePointer2 size={16} />}
            onClick={() => onModeChange("pointer")}
          />
        </Tooltip>
        <Tooltip title="手模式">
          <Button
            variant="text"
            color={interactionMode === "hand" ? "primary" : "default"}
            icon={<Hand size={16} />}
            onClick={() => onModeChange("hand")}
          />
        </Tooltip>
        <Tooltip title={isFullscreen ? "退出全屏" : "全屏"}>
          <Button
            type="text"
            icon={
              isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />
            }
            onClick={onToggleFullscreen}
          />
        </Tooltip>
      </div>
    </Panel>
  );
};

export default FlowControls;
