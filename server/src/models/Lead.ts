import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  source: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    message: { type: String, default: '' },
    source: { type: String, default: 'modal' },
  },
  { timestamps: true }
);

export const LeadModel = mongoose.model<ILeadDocument>('Lead', LeadSchema);

