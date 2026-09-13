import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    const serialized = testimonials.map((t) => ({
      ...t.toObject(),
      _id: t._id.toString(),
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
    const testimonial = await Testimonial.create({
      company: body.company,
      role: body.role,
      quote: body.quote,
      logoUrl: body.logoUrl || "",
    });
    return NextResponse.json({ ...testimonial.toObject(), _id: testimonial._id.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
