"use client";

import { useCallback } from "react";
import { useWorkflowStore } from "@/store/workflow-store";
import { generateId } from "@/lib/utils";
import { WorkflowNode } from "@/types/workflow";

const nodeTypes = [
  {
    type: "trigger",
    label: "Trigger",
    description: "Start a workflow",
  },
  {
    type: "action",
    label: "Action",
    description: "Perform an action",
  },
  {
    type: "condition",
    label: "Condition",
    description: "Add a condition",
  },
];

export function NodeToolbar() {
  const { addNode } = useWorkflowStore();

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ type: nodeType, label }));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="bg-gray-50 p-2 rounded cursor-move hover:bg-gray-100"
            draggable
            onDragStart={(e) => onDragStart(e, node.type, node.label)}
          >
            <div className="text-sm font-medium text-gray-900">{node.label}</div>
            <div className="text-xs text-gray-500">{node.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 