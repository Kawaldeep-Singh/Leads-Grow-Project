import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { saveNewsletter } from '../services/storage.js';

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function createNewsletterHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = newsletterSchema.parse(req.body);
    const subscriber = await saveNewsletter(email);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the LeadsGrow newsletter!',
      data: {
        id: subscriber.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

