import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { LeadModel } from '../models/Lead.js';
import { NewsletterModel } from '../models/Newsletter.js';
import { LeadData, NewsletterData } from '../types/index.js';

const DATA_DIR = process.cwd().endsWith('server')
  ? path.resolve(process.cwd(), 'data')
  : path.resolve(process.cwd(), 'server', 'data');

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

let isMongoConnected = false;

export async function initDatabase(): Promise<void> {
  // Ensure local data directory exists
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

  if (env.MONGODB_URI) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed. Falling back to local JSON file storage:', err);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ MONGODB_URI not provided. Storing leads and subscribers in local JSON file (server/data/leads.json).');
  }
}

export async function saveLead(data: Omit<LeadData, 'id' | 'createdAt'>): Promise<LeadData> {
  const newLead: LeadData = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConnected) {
    try {
      const doc = await LeadModel.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        source: data.source,
      });
      return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        service: doc.service,
        message: doc.message,
        source: doc.source,
        createdAt: doc.createdAt.toISOString(),
      };
    } catch (err) {
      console.error('Failed to save lead in MongoDB, falling back to local file:', err);
    }
  }

  // Local JSON fallback
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    const list: LeadData[] = JSON.parse(raw);
    list.unshift(newLead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing lead to local JSON file:', err);
  }

  return newLead;
}

export async function saveNewsletter(email: string): Promise<NewsletterData> {
  const subscriber: NewsletterData = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConnected) {
    try {
      const doc = await NewsletterModel.findOneAndUpdate(
        { email },
        { email },
        { upsert: true, new: true }
      );
      return {
        id: doc._id.toString(),
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
      };
    } catch (err) {
      console.error('Failed to save subscriber in MongoDB, falling back to local file:', err);
    }
  }

  // Local JSON fallback
  try {
    const raw = await fs.readFile(NEWSLETTER_FILE, 'utf-8');
    const list: NewsletterData[] = JSON.parse(raw);
    const exists = list.some((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      list.unshift(subscriber);
      await fs.writeFile(NEWSLETTER_FILE, JSON.stringify(list, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing subscriber to local JSON file:', err);
  }

  return subscriber;
}
