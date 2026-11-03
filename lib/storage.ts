import fs from 'fs/promises';
import path from 'path';

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  source?: string;
  createdAt: string;
}

export interface NewsletterData {
  id: string;
  email: string;
  createdAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

async function ensureFiles(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(LEADS_FILE);
    } catch {
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    try {
      await fs.access(NEWSLETTER_FILE);
    } catch {
      await fs.writeFile(NEWSLETTER_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('⚠️ Could not initialize local data storage directory:', err);
  }
}

export async function saveLead(data: Omit<LeadData, 'id' | 'createdAt'>): Promise<LeadData> {
  await ensureFiles();
  const newLead: LeadData = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    const list: LeadData[] = JSON.parse(raw || '[]');
    list.unshift(newLead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing lead to local JSON file:', err);
  }

  return newLead;
}

export async function saveNewsletter(email: string): Promise<NewsletterData> {
  await ensureFiles();
  const subscriber: NewsletterData = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = await fs.readFile(NEWSLETTER_FILE, 'utf-8');
    const list: NewsletterData[] = JSON.parse(raw || '[]');
    const existing = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    list.unshift(subscriber);
    await fs.writeFile(NEWSLETTER_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing newsletter subscriber to local JSON file:', err);
  }

  return subscriber;
}
