import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  company: string;
  role: string;
  quote: string;
  logoUrl: string;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  logoUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
