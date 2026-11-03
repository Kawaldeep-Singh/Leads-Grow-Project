import { Router } from 'express';
import { createNewsletterHandler } from '../controllers/newsletterController.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/newsletter', apiRateLimiter, createNewsletterHandler);

export default router;

