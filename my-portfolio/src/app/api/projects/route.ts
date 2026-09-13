import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    const serialized = projects.map((p) => ({
      ...p.toObject(),
      _id: p._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const project = await Project.create({
      title: body.title,
      description: body.description,
      technologies: body.technologies || [],
      imageUrl: body.imageUrl || "",
      images: body.images || [],
      link: body.link || "",
    });
    return NextResponse.json({ ...project.toObject(), _id: project._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project", details: (error as Error).message }, { status: 500 });
  }
}
