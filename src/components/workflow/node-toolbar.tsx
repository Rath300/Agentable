"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NodeType } from "@/types/workflow";

export function NodeToolbar() {
  const { addNode } = useWorkflowStore();

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "trigger" as NodeType, label: "Trigger Node" })}
      >
        <Plus className="h-4 w-4" />
        Trigger Node
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "action" as NodeType, label: "Action Node" })}
      >
        <Plus className="h-4 w-4" />
        Action Node
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "condition" as NodeType, label: "Condition Node" })}
      >
        <Plus className="h-4 w-4" />
        Condition Node
      </Button>
    </div>
  );
} 