
'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets and SMS API.
 */

export type Donor = {
  email: string;
  fullName: string;
  phone: string;
  bloodType: string;
  registrationDate: string;
  district?: string;
  area?: string;
  union?: string;
  organization?: string;
  status?: string;
  totalDonations?: number;
  lastDonationDate?: string;
  password?: string;
};

export type BloodRequest = {
  id: string;
  patientName: string;
  bloodType: string;
  hospitalName: string;
  district: string;
  area: string;
  union: string;
  phone: string;
  neededWhen: string;
  bagsNeeded: string;
  isUrgent: boolean;
  status: 'Pending' | 'Approved' | 'Fullfilled';
  createdAt: string;
  disease?: string;
  diseaseInfo?: string;
  createdBy?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageurl: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
};

export type GalleryItem = {
  id: string;
  imageurl: string;
  title: string;
  category: string;
  createdat: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageurl: string;
  createdat: string;
};

export type ActivityLog = {
  timestamp: string;
  username: string;
  phone: string;
  action: string;
  details: string;
};

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;
const SMS_API_KEY = process.env.SMS_API_KEY;

/**
 * Sends SMS using Anbu InfoSec API
 */
async function sendSMS(recipient: string, message: string) {
  if (!SMS_API_KEY) {
    console.error("SMS API Key is missing in environment variables.");
    return null;
  }

  try {
    // Normalize phone number (Ensure it's in 01XXXXXXXXX format)
    let phone = String(recipient).replace(/\D/g, '');
    if (phone.length === 10) phone = '0' + phone;

    const res = await fetch('https://sms.anbuinfosec.dev/api/v1/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: SMS_API_KEY,
        recipient: phone,
        message: message
      })
    });
    return await res.json();
  } catch (error) {
    console.error("SMS API Error:", error);
    return null;
  }
}

async function postToSheets(payload: any) {
  if (!SHEETS_URL) throw new Error("Backend URL not configured.");
  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Sheets POST Error:", error);
    throw error;
  }
}

async function fetchFromSheets(action: string, params: string = "") {
  if (!SHEETS_URL) return null;
  try {
    const url = `${SHEETS_URL}?action=${action}${params}`;
    const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

export async function getAdminPassword(): Promise<string> {
  const data = await fetchFromSheets('getAdminPass');
  return data?.password || 'admin123';
}

export async function getGlobalStats() {
  const data = await fetchFromSheets('getStats');
  return data || { totalDonors: 0, totalRequests: 0, lastUpdate: '0' };
}

export async function getDonors(): Promise<Donor[]> {
  const data = await fetchFromSheets('getDonors');
  if (!Array.isArray(data)) return [];
  
  return data.map((d: any) => ({
    email: d.email || '',
    fullName: d.fullname || d.fullName || 'নামহীন',
    phone: String(d.phone || ''), 
    bloodType: d.bloodtype || d.bloodType || 'Unknown',
    registrationDate: d.registrationdate || d.registrationDate || '',
    district: d.district || '',
    area: d.area || '',
    union: d.union || '',
    organization: d.organization || '',
    status: d.status || 'Available',
    totalDonations: isNaN(parseInt(d.totaldonations)) ? 0 : parseInt(d.totaldonations),
    lastDonationDate: d.lastdonationdate || 'N/A',
    password: d.password || ''
  }));
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  const result = await postToSheets({ action: 'register', ...data });
  
  if (result.success) {
    const smsMessage = `স্বাগতম ${data.fullName}! RoktoDao-তে নিবন্ধিত হওয়ার জন্য ধন্যবাদ। আপনার রক্তের গ্রুপ: ${data.bloodType}। মানবতার সেবায় পাশে থাকুন।`;
    await sendSMS(data.phone, smsMessage);
  }
  
  return result;
}

export async function updateDonorProfile(originalKey: string, data: Partial<Donor>) {
  return postToSheets({ action: 'updateProfile', originalKey, ...data });
}

export async function setDonorPassword(email: string, phone: string, password: string) {
  return postToSheets({ action: 'setPassword', email, phone, password });
}

export async function logActivity(userName: string, phone: string, logAction: string, details: string) {
  return postToSheets({ action: 'logActivity', userName, phone, logAction, details });
}

export async function getLogs(): Promise<ActivityLog[]> {
  const data = await fetchFromSheets('getLogs');
  return Array.isArray(data) ? data : [];
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  const data = await fetchFromSheets('getRequests');
  if (!Array.isArray(data)) return [];
  
  return data.map((d: any) => ({
    id: d.id || '',
    patientName: d.patientname || '',
    bloodType: d.bloodtype || '',
    hospitalName: d.hospitalname || '',
    district: d.district || '',
    area: d.area || '',
    union: d.union || '',
    phone: String(d.phone || ''),
    neededWhen: d.neededwhen || '',
    bagsNeeded: String(d.bagsneeded || '1'),
    isUrgent: String(d.isurgent).toLowerCase() === 'yes',
    status: d.status || 'Pending',
    createdAt: d.createdat || '',
    disease: d.disease || '',
    diseaseInfo: d.diseaseinfo || '',
    createdBy: d.createdby || 'Public'
  }));
}

export async function createBloodRequest(data: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) {
  return postToSheets({ action: 'createRequest', ...data });
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await fetchFromSheets('getTeam');
  return Array.isArray(data) ? data : [];
}

export async function addTeamMember(data: Omit<TeamMember, 'id'>) {
  return postToSheets({ action: 'addTeamMember', ...data });
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>) {
  return postToSheets({ action: 'updateTeamMember', id, ...data });
}

export async function getGallery(): Promise<GalleryItem[]> {
  const data = await fetchFromSheets('getGallery');
  return Array.isArray(data) ? data : [];
}

export async function addGalleryItem(data: { imageurl: string; title: string; category: string }) {
  return postToSheets({ action: 'addGalleryItem', ...data });
}

export async function getBlogs(): Promise<BlogPost[]> {
  const data = await fetchFromSheets('getBlogs');
  return Array.isArray(data) ? data : [];
}

export async function addBlog(data: Omit<BlogPost, 'id' | 'createdat'>) {
  return postToSheets({ action: 'addBlog', ...data });
}

export async function updateBlog(id: string, data: Partial<BlogPost>) {
  return postToSheets({ action: 'updateBlog', id, ...data });
}

export async function deleteEntry(sheetName: string, keyValue: string) {
  return postToSheets({ action: 'deleteEntry', sheetName, keyValue });
}
