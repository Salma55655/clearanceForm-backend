
import { Router } from 'express';
import { 
    getIssuableItems, 
    issueItemsToStudents, 
    removeItemFromStudent,
    getLogs,
    createLog
} from '../controllers/action.controller';

const router = Router();

router.get('/issuable-items', getIssuableItems);
router.post('/issue-items', issueItemsToStudents);
router.delete('/remove-item/:studentId/:itemId', removeItemFromStudent);

router.get('/logs', getLogs);
router.post('/logs', createLog);

export default router;