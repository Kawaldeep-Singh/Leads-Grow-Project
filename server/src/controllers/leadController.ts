import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { saveLead } from '../services/storage.js';
import { sendLeadNotifications } from '../services/mailer.js';

export const leadValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  service: z.string().min(2, 'Please select a service'),
  message: z.string().optional().default(''),
  source: z.enum(['home-cta', 'modal', 'newsletter', 'custom']).optional().default('modal'),
});

export async function createLeadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = leadValidationSchema.parse(req.body);
    const savedLead = await saveLead(validatedData);

    // Send emails asynchronously
    sendLeadNotifications(savedLead).catch((err) => {
      console.error('Background email dispatch error:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your request has been received. Our team will contact you within 24 hours.',
      data: {
        id: savedLead.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

