import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    fullDesc: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);
