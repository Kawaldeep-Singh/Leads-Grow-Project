export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  source?: 'home-cta' | 'modal' | 'newsletter' | string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export async function submitLead(payload: LeadPayload): Promise<ApiResponse<{ id: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit lead request.');
    }
    return data;
  } catch (error: any) {
    console.error('API submitLead error:', error);
    throw new Error(error.message || 'Unable to submit your request. Please try again.');
  }
}

export async function subscribeNewsletter(email: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to subscribe to newsletter.');
    }
    return data;
  } catch (error: any) {
    console.error('API subscribeNewsletter error:', error);
    throw new Error(error.message || 'Unable to subscribe. Please try again.');
  }
}

