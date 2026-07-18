import mongoose, { Schema, Document } from 'mongoose';

export interface ICoverLetter extends Document {
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  company: string;
  content: string;
  createdAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICoverLetter>('CoverLetter', CoverLetterSchema);
