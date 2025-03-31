import { MainLayout } from "@/components/layout/main-layout";
import { WorkflowTemplate } from "@/types/workflow";

const templates: WorkflowTemplate[] = [
  {
    id: "customer-service-1",
    name: "Customer Service Bot",
    description: "Automate customer inquiries and support requests with AI-powered responses.",
    category: "customer-service",
    nodes: [],
    edges: [],
  },
  {
    id: "research-1",
    name: "Research Assistant",
    description: "Collect and analyze information from multiple sources automatically.",
    category: "research",
    nodes: [],
    edges: [],
  },
  {
    id: "data-collection-1",
    name: "Data Collection Agent",
    description: "Gather and process data from various sources into structured formats.",
    category: "data-collection",
    nodes: [],
    edges: [],
  },
];

export default function TemplatesPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500">
            Start with a pre-built template to quickly create your AI agent.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{template.description}</p>
              <div className="mt-4">
                <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 