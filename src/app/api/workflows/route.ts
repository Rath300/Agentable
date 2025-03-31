import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, nodes, edges } = body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        nodes,
        edges,
        userId: session.user.id,
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("[WORKFLOW_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("[WORKFLOW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 