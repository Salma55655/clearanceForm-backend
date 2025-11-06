import { Schema, model, models, Document, Model } from 'mongoose';
import { Role, ClearanceStatus } from '../types'; // Re-using frontend types

const subSchemaOptions = {
    toJSON: {
        virtuals: true,
        transform: function (doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
};

const BookSchema = new Schema({
    title: { type: String, required: true },
    returned: { type: Boolean, default: false },
    category: { type: String, enum: ['Book', 'Other Item'], default: 'Book' },
    issuedDate: { type: String },
    issuerComment: { type: String },
    issuerId: { type: String }, // Corresponds to a Staff user's `id`
}, subSchemaOptions);

const FineSchema = new Schema({
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
}, subSchemaOptions);

const SubjectClearanceSchema = new Schema({
    subjectName: { type: String, required: true },
    teacherName: { type: String, required: true },
    teacherId: { type: String, required: true }, // Corresponds to a Staff user's `id`
    status: { type: String, enum: Object.values(ClearanceStatus), default: ClearanceStatus.Pending },
    comment: { type: String },
    updatedAt: { type: String },
}, subSchemaOptions);

const ApprovalSchema = new Schema({
    department: { type: String, enum: ['HallHead', 'Finance', 'Security'], required: true },
    status: { type: String, enum: Object.values(ClearanceStatus), default: ClearanceStatus.Pending },
    approverName: { type: String, required: true },
    comment: { type: String },
    updatedAt: { type: String },
}, subSchemaOptions);

// Fix: Define interfaces for Mongoose documents
export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
    role: Role;
}

export interface IStudent extends IUser {
    studentId: string;
    hall: string;
    room: string;
    hallHeadName: string;
    books: any[];
    fines: any[];
    subjectClearances: any[];
    approvals: any[];
}

export interface IStaff extends IUser {
    subject?: string;
}

const baseUserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
}, { 
    discriminatorKey: 'kind',
    toJSON: { 
        virtuals: true,
        // Fix: Type 'ret' as 'any' to allow adding the 'id' property.
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        // Fix: Type 'ret' as 'any' to allow adding the 'id' property.
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
}); 

// Fix: Cast models to resolve union type and fix "not callable" errors.
export const User = (models.User as Model<IUser>) || model<IUser>('User', baseUserSchema);

export const Student = (models.Student as Model<IStudent>) || User.discriminator<IStudent>('Student', new Schema({
    studentId: { type: String, required: true, unique: true },
    hall: { type: String, required: true },
    room: { type: String, required: true },
    hallHeadName: { type: String, required: true },
    books: [BookSchema],
    fines: [FineSchema],
    subjectClearances: [SubjectClearanceSchema],
    approvals: [ApprovalSchema],
}));

export const Staff = (models.Staff as Model<IStaff>) || User.discriminator<IStaff>('Staff', new Schema({
    subject: { type: String }, // For Subject Teachers
}));