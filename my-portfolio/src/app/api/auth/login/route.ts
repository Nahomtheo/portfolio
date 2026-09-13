import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}