
import { Request, Response } from 'express';
import { Student } from '../models/user.model';
import { Log } from '../models/log.model';
import { Item } from '../models/item.model';

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const getIssuableItems = async (req: any, res: any) => {
    try {
        const items = await Item.find();
        const books = items.filter(i => i.category === 'Book').map(i => ({ title: i.title }));
        const otherItems = items.filter(i => i.category === 'Other Item').map(i => ({ title: i.title }));
        res.json({ books, otherItems });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const issueItemsToStudents = async (req: any, res: any) => {
    const { studentIds, items, comment, issuerId } = req.body;
    try {
        const newBooks = items.map((item: any) => ({
            title: item.title,
            returned: false,
            issuedDate: new Date().toISOString(),
            issuerComment: comment,
            issuerId: issuerId,
            category: item.category,
        }));

        await Student.updateMany(
            { _id: { $in: studentIds } },
            { $push: { books: { $each: newBooks } } }
        );

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const removeItemFromStudent = async (req: any, res: any) => {
    const { studentId, itemId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.books = student.books.filter(b => b._id.toString() !== itemId);
        await student.save();
        
        res.json(student.toObject());
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const getLogs = async (req: any, res: any) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 });
        res.json(logs.map(l => l.toObject()));
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const createLog = async (req: any, res: any) => {
    const { loggerId, role, action } = req.body;
    try {
        const newLog = new Log({
            loggerId,
            role,
            action,
            timestamp: new Date().toISOString(),
        });
        await newLog.save();
        res.status(201).json(newLog.toObject());
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};