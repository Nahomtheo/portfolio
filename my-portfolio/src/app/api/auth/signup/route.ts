import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      role: "client",
      company: body.company || "",
      phone: body.phone || "",
    });
    return NextResponse.json(
      {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}