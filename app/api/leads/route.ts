import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/storage';
import { sendLeadNotifications } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  service: z.string().min(2, 'Please select a service'),
  message: z.string().optional().default(''),
  source: z.enum(['home-cta', 'modal', 'newsletter', 'custom']).optional().default('modal'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);
    const savedLead = await saveLead(validatedData);

    // Asynchronously send emails (does not block HTTP response)
    sendLeadNotifications(savedLead).catch((err) => {
      console.error('Background email dispatch error:', err);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your request has been received. Our team will contact you within 24 hours.',
        data: { id: savedLead.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
