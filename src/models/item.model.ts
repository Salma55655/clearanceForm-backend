import { Schema, model, models, Document, Model } from 'mongoose';

// Fix: Add IItem interface for document typing
export interface IItem extends Document {
    title: string;
    category: 'Book' | 'Other Item';
}

const ItemSchema = new Schema<IItem>({
    title: { type: String, required: true, unique: true },
    category: { type: String, enum: ['Book', 'Other Item'], required: true },
});

// Fix: Cast model to Model<IItem> to resolve union type and fix "not callable" errors.
export const Item = (models.Item as Model<IItem>) || model<IItem>('Item', ItemSchema);