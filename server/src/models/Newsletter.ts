import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterDocument extends Document {
  email: string;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletterDocument>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  },
  { timestamps: true }
);

export const NewsletterModel = mongoose.model<INewsletterDocument>('Newsletter', NewsletterSchema);

