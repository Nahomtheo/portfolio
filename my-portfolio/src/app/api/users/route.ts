import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const role = req.nextUrl.searchParams.get("role");
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).select("-password");
    const serialized = users.map((u) => ({
      ...(u.toObject() as Partial<IUser>),
      password: undefined,
      _id: u._id.toString(),
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
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      role: body.role || "user",
      company: body.company || "",
      phone: body.phone || "",
    });
    return NextResponse.json(
      { _id: user._id.toString(), name: user.name, email: user.email, role: user.role, company: user.company, phone: user.phone, createdAt: user.createdAt },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}