import { Schema, model, models, Document, Model } from 'mongoose';
import { Role } from '../types';

// Fix: Add ILog interface for document typing
export interface ILog extends Document {
    loggerId: string;
    role: Role;
    action: string;
    timestamp: string;
}

const LogSchema = new Schema<ILog>({
    loggerId: { type: String, required: true }, // staff email
    role: { type: String, enum: Object.values(Role), required: true },
    action: { type: String, required: true },
    timestamp: { type: String, required: true },
}, {
    toJSON: {
        virtuals: true,
        // Fix: Type 'ret' as 'any' to allow adding the 'id' property.
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// Fix: Cast model to Model<ILog> to resolve union type and fix "not callable" errors.
export const Log = (models.Log as Model<ILog>) || model<ILog>('Log', LogSchema);