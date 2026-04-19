import express from 'express';
import { executeCode } from '../controllers/codeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/code/execute — requires authentication
router.post('/execute', protect, executeCode);

export default router;
