export interface LeadData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  source: 'home-cta' | 'modal' | 'newsletter' | string;
  createdAt: string;
}

export interface NewsletterData {
  id?: string;
  email: string;
  createdAt: string;
}

