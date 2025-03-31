import { MainLayout } from "@/components/layout/main-layout";
import { WorkflowBuilder } from "@/components/workflow/workflow-builder";

export default function WorkflowsPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="text-sm text-gray-500">
            Create and edit your AI agent workflows using the drag-and-drop interface.
          </p>
        </div>
        <div className="h-[calc(100vh-12rem)] rounded-lg border border-gray-200 bg-white">
          <WorkflowBuilder />
        </div>
      </div>
    </MainLayout>
  );
} 