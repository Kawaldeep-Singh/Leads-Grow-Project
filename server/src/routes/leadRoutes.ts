import { Router } from 'express';
import { createLeadHandler } from '../controllers/leadController.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/leads', apiRateLimiter, createLeadHandler);

export default router;

