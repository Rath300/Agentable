import { useCallback } from "react";
import { Node } from "reactflow";
import { WorkflowNodeData } from "@/types/workflow";
import { useWorkflowStore } from "@/store/workflow-store";

interface NodeConfigPanelProps {
  selectedNode: Node<WorkflowNodeData> | null;
}

export function NodeConfigPanel({ selectedNode }: NodeConfigPanelProps) {
  const { updateNode } = useWorkflowStore();

  const handleConfigChange = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!selectedNode) return;

      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          config: {
            ...selectedNode.data.config,
            [key]: value,
          },
        },
      };

      updateNode(updatedNode);
    },
    [selectedNode, updateNode]
  );

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white p-4 border-l border-gray-200">
        <p className="text-gray-500 text-sm">Select a node to configure</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white p-4 border-l border-gray-200">
      <h3 className="text-lg font-medium mb-4">{selectedNode.data.label}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Type
          </label>
          <div className="text-sm text-gray-500">{selectedNode.data.type}</div>
        </div>

        {selectedNode.data.type === "trigger" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger Type
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedNode.data.config.triggerType || "webhook"}
              onChange={(e) => handleConfigChange("triggerType", e.target.value)}
            >
              <option value="webhook">Webhook</option>
              <option value="schedule">Schedule</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        )}

        {selectedNode.data.type === "action" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedNode.data.config.actionType || "api"}
              onChange={(e) => handleConfigChange("actionType", e.target.value)}
            >
              <option value="api">API Call</option>
              <option value="email">Send Email</option>
              <option value="notification">Send Notification</option>
            </select>
          </div>
        )}

        {selectedNode.data.type === "condition" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition Type
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedNode.data.config.conditionType || "equals"}
              onChange={(e) => handleConfigChange("conditionType", e.target.value)}
            >
              <option value="equals">Equals</option>
              <option value="notEquals">Not Equals</option>
              <option value="contains">Contains</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
} 