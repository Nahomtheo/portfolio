import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "client" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  phone?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "client", "user"], default: "user" },
  company: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);