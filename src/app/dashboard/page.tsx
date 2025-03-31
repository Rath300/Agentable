import { MainLayout } from "@/components/layout/main-layout";
import { AgentConfig } from "@/types/workflow";
import { PlayCircle, PauseCircle } from "lucide-react";

const agents: AgentConfig[] = [
  {
    id: "agent-1",
    name: "Customer Support Assistant",
    description: "Handles basic customer inquiries and support tickets.",
    status: "published",
    workflow: {
      nodes: [],
      edges: [],
    },
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
    lastRunAt: new Date("2024-03-15"),
  },
  {
    id: "agent-2",
    name: "Research Bot",
    description: "Collects and summarizes research papers on AI topics.",
    status: "draft",
    workflow: {
      nodes: [],
      edges: [],
    },
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage your AI agents from a central location.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    agent.status === "published"
                      ? "bg-green-100 text-green-800"
                      : agent.status === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{agent.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Last updated: {agent.updatedAt.toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {agent.status === "published" ? (
                    <button className="rounded-md bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100">
                      <PauseCircle className="h-5 w-5" />
                    </button>
                  ) : (
                    <button className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                      <PlayCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 