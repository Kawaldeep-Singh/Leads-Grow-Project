import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveNewsletter } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = newsletterSchema.parse(body);
    const subscriber = await saveNewsletter(email);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to the LeadsGrow newsletter!',
        data: { id: subscriber.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0]?.message || 'Please enter a valid email address',
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
