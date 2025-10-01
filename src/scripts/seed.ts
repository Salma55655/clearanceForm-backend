import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Student, Staff, User } from '../models/user.model';
import { Log } from '../models/log.model';
import { Item } from '../models/item.model';
import { Role, ClearanceStatus } from '../types';

// This is a standalone script. We copy the raw data here.
// In a real-world scenario, this might come from CSV files or another source.

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('MongoDB URI not found in .env file');
        process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected for seeding...');

    try {
        // Clear existing data
        await User.deleteMany({});
        await Log.deleteMany({});
        await Item.deleteMany({});
        console.log('Cleared existing data.');

        // --- MASTER DATA FROM TABLES ---
        // Fix: Explicitly type the arrays to match the Item schema.
        const masterIssuableBooks: { title: string; category: 'Book' }[] = [
            { title: 'Entrepreneurial Leadership 101', category: 'Book' },
            { title: 'African Studies: A History', category: 'Book' },
            { title: 'Writing & Rhetoric Fundamentals', category: 'Book' },
            { title: 'Calculus I', category: 'Book' },
            { title: 'Intro to Physics', category: 'Book' },
            { title: 'Data Structures in Python', category: 'Book' },
            { title: 'Chemistry Lab Manual', category: 'Book' },
            { title: 'World Literature Anthology', category: 'Book' },
        ];
        const masterIssuableOtherItems: { title: string; category: 'Other Item' }[] = [
            { title: 'Scientific Calculator (TI-84)', category: 'Other Item' },
            { title: 'Lab Coat (Size M)', category: 'Other Item' },
            { title: 'Safety Goggles', category: 'Other Item' },
            { title: 'Art Kit', category: 'Other Item' },
            { title: 'Music Stand', category: 'Other Item' },
        ];
        // Fix: Cast to 'any' to resolve insertMany typing issue.
        await Item.insertMany([...masterIssuableBooks, ...masterIssuableOtherItems] as any);
        console.log('Items seeded.');

        const subjectTeachersData = [
          { email: 'bopape@ala.org', name: 'Dr. Bopape', role: Role.SubjectTeacher, subject: 'Entrepreneurial Leadership', password: 'pass-bopape' },
          { email: 'nkosi@ala.org', name: 'Ms. Nkosi', role: Role.SubjectTeacher, subject: 'African Studies', password: 'pass-nkosi' },
          { email: 'williams@ala.org', name: 'Mr. Williams', role: Role.SubjectTeacher, subject: 'Writing & Rhetoric', password: 'pass-williams' },
          { email: 'pdavis@ala.org', name: 'Prof. Davis', role: Role.SubjectTeacher, subject: 'Mathematics', password: 'pass-pdavis' },
          { email: 'einstein@ala.org', name: 'Dr. Einstein', role: Role.SubjectTeacher, subject: 'Physics', password: 'pass-einstein' },
          { email: 'ada@ala.org', name: 'Prof. Ada', role: Role.SubjectTeacher, subject: 'Computer Science', password: 'pass-ada' }
        ];
        const subjectTeachers = await Staff.insertMany(subjectTeachersData);
        console.log('Subject Teachers seeded.');

        const otherStaffData = [
          { email: 'tladi@ala.org', name: 'Ms. Tladi', role: Role.HallHead, password: 'pass-tladi' },
          { email: 'venter@ala.org', name: 'Ms. Venter', role: Role.HallHead, password: 'pass-venter' },
          { email: 'williams.h@ala.org', name: 'Mr. Williams (H)', role: Role.HallHead, password: 'pass-williamsh' },
          { email: 'xavier@ala.org', name: 'Mr. Xavier', role: Role.HallHead, password: 'pass-xavier' },
          { email: 'yusuf@ala.org', name: 'Ms. Yusuf', role: Role.HallHead, password: 'pass-yusuf' },
          { email: 'davis@ala.org', name: 'Mrs. Davis', role: Role.Finance, password: 'pass-davis' },
          { email: 'mike@ala.org', name: 'Officer Mike', role: Role.Security, password: 'pass-mike' },
          { email: 'admin@ala.org', name: 'Admin User', role: Role.Admin, password: 'pass-admin' },
        ];
        await Staff.insertMany(otherStaffData);
        console.log('Other Staff seeded.');
        
        const teacherMap = subjectTeachers.reduce((acc, t) => ({ ...acc, [t.name]: t }), {});
        const csTeacher = subjectTeachers.find(t => t.subject === 'Computer Science');
        const englishTeacher = subjectTeachers.find(t => t.subject === 'Writing & Rhetoric');
        const mathTeacher = subjectTeachers.find(t => t.subject === 'Mathematics');

        const studentInfo = [
            { studentId: 'ALA24-059', firstName: 'Jason', lastName: 'Alombah', advisor: 'Ms. Tladi', dorm: 'Office', books: [{ title: 'Computer Science', returned: true, issuerId: csTeacher?.id, category: 'Book' }], fines: [] },
            { studentId: 'ALA24-013', firstName: 'Ushe', lastName: 'Omebudu', advisor: 'Ms. Venter', dorm: 'Jeshi', books: [{ title: 'English', returned: true, issuerId: englishTeacher?.id, category: 'Book' }], fines: [{ reason: 'School Fine', amount: 3333, paid: true }] },
            { studentId: 'ALA24-056', firstName: 'Jeremy', lastName: 'Gitiba', advisor: 'Mr. Williams (H)', dorm: 'Titans', books: [{ title: 'Pure mathematics 1', returned: false, issuerId: mathTeacher?.id, category: 'Book' }], fines: [{ reason: 'School Fine', amount: 2222, paid: false }] },
            { studentId: 'ALA24-111', firstName: 'Lubanzi', lastName: 'Tsabedze', advisor: 'Mr. Xavier', dorm: 'Titans', books: [{ title: 'Shakespeare', returned: false, issuerId: englishTeacher?.id, category: 'Book' }], fines: [{ reason: 'School Fine', amount: 2222, paid: true }] },
            { studentId: 'ALA21-52', firstName: 'Salma', lastName: 'Ismail', advisor: 'Ms. Yusuf', dorm: 'Keza', books: [], fines: [] },
            { studentId: 'ALA24-088', firstName: 'Maria', lastName: 'Okoro', advisor: 'Ms. Tladi', dorm: 'Office', books: [{ title: 'Pure mathematics 1', returned: false, issuerId: mathTeacher?.id, category: 'Book' }], fines: [{ reason: 'Late Library Book', amount: 500, paid: false }] },
            { studentId: 'ALA24-102', firstName: 'David', lastName: 'Chen', advisor: 'Mr. Xavier', dorm: 'Titans', books: [], fines: [] },
        ];

        const studentsData = studentInfo.map((info, index) => {
            const year = info.studentId.substring(3, 5);
            return {
                studentId: info.studentId,
                email: `${info.firstName.charAt(0).toLowerCase()}${info.lastName.toLowerCase()}${year}@alastudents.org`,
                name: `${info.firstName} ${info.lastName}`,
                role: Role.Student,
                hall: `${info.dorm} Dorm`,
                room: `${101 + index}`,
                hallHeadName: info.advisor,
                books: info.books,
                fines: info.fines,
                password: `pass-${info.studentId.toLowerCase()}`,
                subjectClearances: subjectTeachers.map(teacher => ({
                    subjectName: teacher.subject,
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    status: ClearanceStatus.Pending,
                    comment: '',
                    updatedAt: new Date().toISOString()
                })),
                approvals: [
                    { department: 'HallHead', status: ClearanceStatus.Pending, approverName: info.advisor, comment: '', updatedAt: new Date().toISOString() },
                    { department: 'Finance', status: ClearanceStatus.Pending, approverName: 'Mrs. Davis', comment: '', updatedAt: new Date().toISOString() },
                    { department: 'Security', status: ClearanceStatus.Pending, approverName: 'Officer Mike', comment: '', updatedAt: new Date().toISOString() },
                ],
            };
        });
        await Student.insertMany(studentsData);
        console.log('Students seeded.');

        const logsData = [
            { loggerId: 'pdavis@ala.org', role: Role.SubjectTeacher, action: 'Approved Mathematics clearance for Lubanzi Tsabedze (ALA24-111).', timestamp: new Date('2025-03-04T14:10:00Z').toISOString() },
            { loggerId: 'davis@ala.org', role: Role.Finance, action: 'Marked fine as paid for Ushe Omebudu (ALA24-013).', timestamp: new Date('2025-02-03T00:00:00Z').toISOString() },
            { loggerId: 'einstein@ala.org', role: Role.SubjectTeacher, action: 'Flagged Salma Ismail (ALA21-52) in Physics for missing lab report.', timestamp: new Date('2025-02-05T13:50:00Z').toISOString() },
        ];
        // Fix: Cast to 'any' to resolve insertMany typing issue.
        await Log.insertMany(logsData as any);
        console.log('Logs seeded.');

        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDatabase();