import { create } from "zustand";
import { WorkflowNode, WorkflowEdge, WorkflowTemplate } from "@/types/workflow";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  templates: WorkflowTemplate[];
  history: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
  historyIndex: number;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  updateNode: (node: WorkflowNode) => void;
  addNode: (node: WorkflowNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (edgeId: string) => void;
  saveWorkflow: (name: string, description: string) => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  validateWorkflow: () => boolean;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 10;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  templates: [],
  history: [],
  historyIndex: -1,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (node) => set({ selectedNode: node }),

  updateNode: (node) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((n) => (n.id === node.id ? node : n));
    set({ nodes: updatedNodes });
  },

  addNode: (node) => {
    const { nodes } = get();
    set({ nodes: [...nodes, node] });
  },

  removeNode: (nodeId) => {
    const { nodes, edges } = get();
    const updatedNodes = nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
    set({ nodes: updatedNodes, edges: updatedEdges });
  },

  addEdge: (edge) => {
    const { edges } = get();
    set({ edges: [...edges, edge] });
  },

  removeEdge: (edgeId) => {
    const { edges } = get();
    set({ edges: edges.filter((e) => e.id !== edgeId) });
  },

  saveWorkflow: async (name, description) => {
    const { nodes, edges } = get();
    const workflow = {
      id: crypto.randomUUID(),
      name,
      description,
      nodes,
      edges,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error("Failed to save workflow");
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      throw error;
    }
  },

  loadWorkflow: async (id) => {
    try {
      const response = await fetch(`/api/workflows/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load workflow");
      }

      const workflow = await response.json();
      set({ nodes: workflow.nodes, edges: workflow.edges });
    } catch (error) {
      console.error("Error loading workflow:", error);
      throw error;
    }
  },

  validateWorkflow: () => {
    const { nodes, edges } = get();

    // Check if there's at least one trigger node
    const hasTrigger = nodes.some((node) => node.data.type === "trigger");
    if (!hasTrigger) {
      return false;
    }

    // Check if all nodes are connected
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const allNodesConnected = nodes.every((node) =>
      connectedNodeIds.has(node.id)
    );

    return allNodesConnected;
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        nodes: previousState.nodes,
        edges: previousState.edges,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: historyIndex + 1,
      });
    }
  },
})); 