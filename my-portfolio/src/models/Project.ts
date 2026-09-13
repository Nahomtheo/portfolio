import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  images: string[];
  link: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], default: [] },
  imageUrl: { type: String, default: "" },
  images: { type: [String], default: [] },
  link: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
