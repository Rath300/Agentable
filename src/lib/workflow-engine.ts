import { WorkflowNode, WorkflowEdge, WorkflowNodeData } from "@/types/workflow";
import { AIService } from "./ai";

export interface WorkflowExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  executionTime: number;
  nodeResults: Record<string, NodeExecutionResult>;
}

interface NodeExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  executionTime: number;
}

export class WorkflowEngine {
  private aiService: AIService;
  private nodes: WorkflowNode[];
  private edges: WorkflowEdge[];

  constructor(aiService: AIService, nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    this.aiService = aiService;
    this.nodes = nodes;
    this.edges = edges;
  }

  async execute(): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const nodeResults: Record<string, NodeExecutionResult> = {};
    let success = true;
    let error: string | undefined;

    try {
      // Find the trigger node
      const triggerNode = this.nodes.find((node) => node.data.type === "trigger");
      if (!triggerNode) {
        throw new Error("No trigger node found in workflow");
      }

      // Execute nodes in topological order
      const executionOrder = this.getExecutionOrder(triggerNode.id);
      for (const nodeId of executionOrder) {
        const node = this.nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        const result = await this.executeNode(node);
        nodeResults[nodeId] = result;

        if (!result.success) {
          success = false;
          error = result.error;
          break;
        }
      }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : "Unknown error occurred";
    }

    return {
      success,
      output: nodeResults,
      error,
      executionTime: Date.now() - startTime,
      nodeResults,
    };
  }

  private async executeNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    try {
      let output: any;

      switch (node.data.type) {
        case "trigger":
          output = await this.executeTriggerNode(node);
          break;
        case "action":
          output = await this.executeActionNode(node);
          break;
        case "condition":
          output = await this.executeConditionNode(node);
          break;
        default:
          throw new Error(`Unsupported node type: ${node.data.type}`);
      }

      return {
        success: true,
        output,
        executionTime: Date.now() - startTime,
      };
    } catch (err) {
      return {
        success: false,
        output: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
        executionTime: Date.now() - startTime,
      };
    }
  }

  private async executeTriggerNode(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    switch (config.triggerType) {
      case "webhook":
        return { event: "webhook_triggered" };
      case "schedule":
        return { event: "schedule_triggered" };
      case "manual":
        return { event: "manual_trigger" };
      default:
        throw new Error(`Unsupported trigger type: ${config.triggerType}`);
    }
  }

  private async executeActionNode(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    switch (config.actionType) {
      case "api":
        return await this.executeAPIAction(config);
      case "email":
        return await this.executeEmailAction(config);
      case "notification":
        return await this.executeNotificationAction(config);
      default:
        throw new Error(`Unsupported action type: ${config.actionType}`);
    }
  }

  private async executeConditionNode(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    const { conditionType, value1, value2 } = config;

    switch (conditionType) {
      case "equals":
        return value1 === value2;
      case "notEquals":
        return value1 !== value2;
      case "contains":
        return String(value1).includes(String(value2));
      case "greaterThan":
        return Number(value1) > Number(value2);
      case "lessThan":
        return Number(value1) < Number(value2);
      default:
        throw new Error(`Unsupported condition type: ${conditionType}`);
    }
  }

  private async executeAPIAction(config: any): Promise<any> {
    const { url, method, headers, body } = config;
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  private async executeEmailAction(config: any): Promise<any> {
    // Implement email sending logic
    return { status: "email_sent" };
  }

  private async executeNotificationAction(config: any): Promise<any> {
    // Implement notification sending logic
    return { status: "notification_sent" };
  }

  private getExecutionOrder(startNodeId: string): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const outgoingEdges = this.edges.filter((edge) => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        visit(edge.target);
      }

      order.push(nodeId);
    };

    visit(startNodeId);
    return order;
  }
} 