
import { Request, Response } from 'express';
import { Student, Staff } from '../models/user.model';
import { Role, ClearanceStatus } from '../types';

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const getAllStudents = async (req: any, res: any) => {
    try {
        const students = await Student.find();
        res.json(students.map(s => s.toObject()));
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}; 

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const getStudentById = async (req: any, res: any) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student.toObject());
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const updateStudent = async (req: any, res: any) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent.toObject());
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Fix: Using `any` for req and res types to work around what appears to be a broken or conflicting Express type definition issue.
export const createStudent = async (req: any, res: any) => {
    const { firstName, lastName, studentId, dorm, advisor, password, email } = req.body;
    try {
        const subjectTeachers = await Staff.find({ role: Role.SubjectTeacher });
        const year = studentId.split('-')[1].substring(0,2);
        
        const newStudentData = {
            studentId,
            email: `${email.toLowerCase()}`,
            name: `${firstName} ${lastName}`,
            role: Role.Student,
            hall: `${dorm} Dorm`,
            room: `${Math.floor(Math.random() * 900) + 100}`,
            hallHeadName: advisor,
            books: [],
            fines: [],
            password: `${password}`,
            subjectClearances: subjectTeachers.map(teacher => ({
                // Fix: Removed 'as any' cast as 'teacher' is now correctly typed.
                subjectName: teacher.subject || 'Unknown Subject',
                teacherId: teacher.id,
                teacherName: teacher.name,
                status: ClearanceStatus.Pending,
                comment: '',
                updatedAt: new Date().toISOString()
            })),
            approvals: [
                { department: 'HallHead', status: ClearanceStatus.Pending, approverName: advisor, comment: '', updatedAt: new Date().toISOString() },
                { department: 'Finance', status: ClearanceStatus.Pending, approverName: 'Mrs. Davis', comment: '', updatedAt: new Date().toISOString() },
                { department: 'Security', status: ClearanceStatus.Pending, approverName: 'Officer Mike', comment: '', updatedAt: new Date().toISOString() },
            ],
        };
        
        const student = new Student(newStudentData);
        await student.save();
        res.status(201).json(student.toObject());
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};