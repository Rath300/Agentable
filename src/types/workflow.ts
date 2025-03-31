import { Node, Edge } from "reactflow";

export type NodeType = "trigger" | "action" | "condition";

export interface NodeConfig {
  type: string;
  data?: unknown;
  inputs?: unknown[];
  [key: string]: unknown;
}

export interface WorkflowNodeData {
  label: string;
  type: NodeType;
  config: NodeConfig;
}

export type WorkflowNode = Node<WorkflowNodeData>;

export type WorkflowEdge = Edge & {
  animated?: boolean;
};

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  category: "customer-service" | "research" | "data-collection";
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "paused";
  workflow: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  apiKeys: {
    openai?: string;
    [key: string]: string | undefined;
  };
  createdAt: Date;
  updatedAt: Date;
} 