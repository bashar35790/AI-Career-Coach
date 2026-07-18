import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true,
    },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ISkill>('Skill', SkillSchema);
