
import { Request, Response } from 'express';
import { User, Student } from '../models/user.model';
import { Role } from '../types';

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const login = async (req: any, res: any) => {
    const { identifier, password, role } = req.body;
    
    if (!identifier || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const identifierLower = identifier.toLowerCase();
        // Fix: Await queries separately to avoid callable expression error on union type.
        let user;

        if (role === Role.Student) {
            user = await Student.findOne({
                role: role,
                $or: [{ email: identifierLower }, { studentId: identifier }]
            });
        } else {
            user = await User.findOne({ email: identifierLower, role: role });
        }
        
        if (user && user.password === password) {
            res.json(user.toObject());
        } else {
            res.status(401).json({ message: 'Invalid credentials or role' });
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const recoverPassword = async (req: any, res: any) => {
    const { identifier } = req.body;

    try {
        const identifierLower = identifier.toLowerCase();
        // Fix: Cast part of the query to 'any' because 'studentId' is not on the base User schema.
        const user = await User.findOne({
            $or: [{ email: identifierLower }, { studentId: identifierLower } as any]
        });

        if (user) {
            res.json({ password: user.password });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};