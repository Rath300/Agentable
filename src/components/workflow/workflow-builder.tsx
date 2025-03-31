"use client";

import { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
  NodeTypes,
} from "reactflow";
import { Background } from "@reactflow/background";
import { Controls } from "@reactflow/controls";
import { MiniMap } from "@reactflow/minimap";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/store/workflow-store";
import { WorkflowNode, WorkflowEdge, WorkflowNodeData } from "@/types/workflow";
import { NodeToolbar } from "./node-toolbar";
import { CustomNode } from "./custom-node";
import { generateId } from "@/lib/utils";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function WorkflowBuilderContent() {
  const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges } = useWorkflowStore();
  const [nodes, setNodesState, onNodesChange] = useNodesState<WorkflowNodeData>(storeNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState<WorkflowEdge>(storeEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      try {
        if (!params.source || !params.target) return;
        
        const newEdge: WorkflowEdge = {
          id: generateId(),
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          type: "default",
          animated: true,
        };
        
        const updatedEdges = addEdge(newEdge, edges) as WorkflowEdge[];
        setEdges(updatedEdges);
        setEdgesState(updatedEdges);
      } catch (error) {
        console.error("Error connecting nodes:", error);
      }
    },
    [setEdges, setEdgesState, edges]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      try {
        const updateNodes = (nds: WorkflowNode[]) =>
          nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n));
        setNodes(updateNodes(nodes));
        setNodesState(updateNodes(nodes));
      } catch (error) {
        console.error("Error updating node position:", error);
      }
    },
    [setNodes, setNodesState, nodes]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      try {
        event.preventDefault();

        const reactFlowBounds = document.querySelector(".react-flow")?.getBoundingClientRect();
        if (!reactFlowBounds) {
          console.error("React Flow container not found");
          return;
        }

        const nodeData = JSON.parse(event.dataTransfer.getData("application/reactflow"));
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode: WorkflowNode = {
          id: generateId(),
          type: "custom",
          position,
          data: {
            label: nodeData.label,
            type: nodeData.type,
            config: {},
          },
        };

        setNodes([...nodes, newNode]);
        setNodesState([...nodes, newNode]);
      } catch (error) {
        console.error("Error adding new node:", error);
      }
    },
    [setNodes, setNodesState, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      <div className="absolute left-4 top-4 z-10">
        <NodeToolbar />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  );
} 