import { Panel } from "@xyflow/react";
import { Button, Drawer, Tag } from "antd";
import { Play, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type RunStatus = "idle" | "running" | "success" | "error";

const runStatusLabel: Record<RunStatus, string> = {
  idle: "等待运行",
  running: "运行中",
  success: "运行成功",
  error: "运行失败",
};

const runStatusColor: Record<RunStatus, string> = {
  idle: "default",
  running: "processing",
  success: "success",
  error: "error",
};

const RunControls = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [runStatus, setRunStatus] = useState<RunStatus>("idle");

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    setRunStatus("idle");
  }, []);

  const startRun = useCallback(async () => {}, []);

  const title = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-base font-semibold">测试运行</div>
          <Tag color={runStatusColor[runStatus]}>
            {runStatusLabel[runStatus]}
          </Tag>
        </div>
        <div
          className="ml-6 flex cursor-pointer items-center"
          onClick={handleClose}
        >
          <X size={16} />
        </div>
      </div>
    ),
    [handleClose, runStatus],
  );

  return (
    <>
      <Panel position="top-right" className="m-4! flex flex-row gap-4">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur">
          <Button
            type="text"
            icon={<Play size={16} />}
            size="small"
            onClick={() => {
              void startRun();
            }}
          >
            测试运行
          </Button>
        </div>
      </Panel>
      <Drawer
        title={title}
        closable={false}
        open={drawerOpen}
        placement="right"
        size={800}
        onClose={handleClose}
        mask={false}
        getContainer={false}
        rootStyle={{ position: "absolute" }}
        styles={{
          root: { overflowX: "hidden" },
          wrapper: {
            maxWidth: "100%",
            top: 66,
            bottom: 14,
            right: 12,
            borderRadius: 20,
          },
          section: { borderRadius: 20 },
          header: {
            padding: "16px 16px 12px",
            borderBottom: "none",
          },
          title: {
            width: "100%",
          },
          body: {
            padding: "12px 16px",
          },
        }}
        destroyOnHidden
      ></Drawer>
    </>
  );
};
export default RunControls;
