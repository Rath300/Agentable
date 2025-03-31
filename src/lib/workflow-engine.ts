import { WorkflowNode, WorkflowEdge, NodeType } from "@/types/workflow";

interface NodeConfig {
  type: string;
  [key: string]: unknown;
}

interface NodeResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface WorkflowResult {
  success: boolean;
  results: Record<string, NodeResult>;
  error?: string;
}

export class WorkflowEngine {
  private nodes: WorkflowNode[];
  private edges: WorkflowEdge[];

  constructor(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  private async executeNode(node: WorkflowNode): Promise<NodeResult> {
    try {
      const config = node.data.config as NodeConfig;
      switch (node.data.type) {
        case "trigger":
          return await this.executeTriggerNode(config);
        case "action":
          return await this.executeActionNode(config);
        case "condition":
          return await this.executeConditionNode(config);
        default:
          throw new Error(`Unknown node type: ${node.data.type}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async executeTriggerNode(config: NodeConfig): Promise<NodeResult> {
    // Implement trigger node logic
    return {
      success: true,
      data: config.data,
    };
  }

  private async executeActionNode(config: NodeConfig): Promise<NodeResult> {
    // Implement action node logic
    return {
      success: true,
      data: config.data,
    };
  }

  private async executeConditionNode(config: NodeConfig): Promise<NodeResult> {
    // Implement condition node logic
    return {
      success: true,
      data: config.data,
    };
  }

  private getNodeInputs(nodeId: string): unknown[] {
    const inputEdges = this.edges.filter((edge) => edge.target === nodeId);
    return inputEdges.map((edge) => {
      const sourceNode = this.nodes.find((node) => node.id === edge.source);
      return sourceNode?.data?.config?.data;
    });
  }

  private getNodeOutputs(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  public async execute(): Promise<WorkflowResult> {
    const results: Record<string, NodeResult> = {};
    const visited = new Set<string>();

    try {
      // Find start nodes (nodes with no incoming edges)
      const startNodes = this.nodes.filter(
        (node) => !this.edges.some((edge) => edge.target === node.id)
      );

      // Execute each start node and its connected nodes
      for (const startNode of startNodes) {
        await this.executeNodeAndDependencies(startNode, results, visited);
      }

      return {
        success: true,
        results,
      };
    } catch (error) {
      return {
        success: false,
        results,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async executeNodeAndDependencies(
    node: WorkflowNode,
    results: Record<string, NodeResult>,
    visited: Set<string>
  ): Promise<void> {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    // Get input values from connected nodes
    const inputs = this.getNodeInputs(node.id);
    node.data.config = {
      ...node.data.config,
      inputs,
    };

    // Execute the node
    results[node.id] = await this.executeNode(node);

    // Execute connected output nodes
    const outputNodes = this.getNodeOutputs(node.id);
    for (const outputNodeId of outputNodes) {
      const outputNode = this.nodes.find((n) => n.id === outputNodeId);
      if (outputNode) {
        await this.executeNodeAndDependencies(outputNode, results, visited);
      }
    }
  }
} 