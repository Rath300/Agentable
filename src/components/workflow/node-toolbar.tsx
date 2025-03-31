"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NodeToolbar() {
  const { addNode } = useWorkflowStore();

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "input", label: "Input Node" })}
      >
        <Plus className="h-4 w-4" />
        Input Node
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "process", label: "Process Node" })}
      >
        <Plus className="h-4 w-4" />
        Process Node
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => addNode({ type: "output", label: "Output Node" })}
      >
        <Plus className="h-4 w-4" />
        Output Node
      </Button>
    </div>
  );
} 