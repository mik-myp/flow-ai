import { ReactFlowProvider } from "@xyflow/react";
import WorkFlowCanvas from "../_components/WorkFlowCanvas";

export default async function WorkflowDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ReactFlowProvider>
      <WorkFlowCanvas
        key={id}
        workflowId={id}
        workflowDetail={{
          nodes: [
            {
              id: "start",
              type: "start",
              position: { x: 120, y: 140 },
              deletable: false,
              data: {},
            },
            {
              id: "end",
              type: "end",
              position: { x: 220, y: 240 },
              deletable: false,
              data: {},
            },
            {
              id: "llm",
              type: "llm",
              position: { x: 320, y: 340 },
              data: {},
            },
            {
              id: "prompt",
              type: "prompt",
              position: { x: 420, y: 440 },
              data: {},
            },
            {
              id: "userInput",
              type: "userInput",
              position: { x: 520, y: 540 },
              data: {},
            },
          ],
          edges: [],
        }}
      />
    </ReactFlowProvider>
  );
}
