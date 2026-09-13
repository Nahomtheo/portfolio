import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }
    if (!clientId) {
      return NextResponse.json({ error: "Google auth is not configured" }, { status: 500 });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google credential" }, { status: 400 });
    }

    await connectDB();
    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: `google:${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,
        role: "client",
        company: "",
        phone: "",
      });
    }

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
    return NextResponse.json({ error: "Google login failed" }, { status: 500 });
  }
}