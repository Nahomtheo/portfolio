import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const update: Record<string, unknown> = {};
    if (body.title) update.title = body.title;
    if (body.description) update.description = body.description;
    if (body.technologies) update.technologies = body.technologies;
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl;
    if (body.images !== undefined) update.images = body.images;
    if (body.link !== undefined) update.link = body.link;

    await Project.findByIdAndUpdate(id, update);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
