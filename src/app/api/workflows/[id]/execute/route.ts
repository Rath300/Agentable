// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - Temporarily disable TypeScript checking for this file
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorkflowEngine } from "@/lib/workflow-engine";
import { AIService } from "@/lib/ai";
import { SUBSCRIPTION_PLANS, SubscriptionTier } from "@/types/subscription";
import { WorkflowNode, WorkflowEdge } from "@/types/workflow";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const subscriptionTier = (user.subscription?.tier || "free") as SubscriptionTier;
    const plan = SUBSCRIPTION_PLANS[subscriptionTier];

    // Get workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
    });

    if (!workflow) {
      return new NextResponse("Workflow not found", { status: 404 });
    }

    // Check if user has permission to execute this workflow
    if (workflow.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check usage limits
    const executionCount = await prisma.workflowExecution.count({
      where: {
        workflowId: workflow.id,
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    if (executionCount >= plan.features.maxWorkflowExecutions) {
      return new NextResponse(
        "Monthly execution limit reached. Please upgrade your plan.",
        { status: 429 }
      );
    }

    // Initialize AI service
    const aiService = new AIService(
      {
        openai: user.apiKeys?.openai,
        anthropic: user.apiKeys?.anthropic,
      },
      subscriptionTier
    );

    // Create workflow engine
    const engine = new WorkflowEngine(
      workflow.nodes as WorkflowNode[],
      workflow.edges as WorkflowEdge[],
      aiService
    );

    // Execute workflow
    const result = await engine.execute();

    // Record execution
    await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        userId: session.user.id,
        status: result.success ? "success" : "failed",
        output: JSON.stringify(result.results),
        error: result.error,
        executionTime: Date.now(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[WORKFLOW_EXECUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 