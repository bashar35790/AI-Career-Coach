import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  fileUrl?: string;
  aiScore?: number;
  suggestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
    aiScore: { type: Number, min: 0, max: 100 },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
