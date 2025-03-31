import { create } from "zustand";
import { WorkflowNode, WorkflowEdge, NodeType } from "@/types/workflow";
import { generateId } from "@/lib/utils";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (nodeData: { type: NodeType; label: string }) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (source: string, target: string) => void;
  deleteEdge: (edgeId: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (nodeData) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: generateId(),
          type: "custom",
          position: { x: 0, y: 0 },
          data: {
            label: nodeData.label,
            type: nodeData.type,
            config: {},
          },
        },
      ],
    })),
  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...data } : node
      ),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
  addEdge: (source, target) =>
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: generateId(),
          source,
          target,
          type: "default",
          animated: true,
        },
      ],
    })),
  deleteEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
})); 