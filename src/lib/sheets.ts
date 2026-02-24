'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets.
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

export type ActivityLog = {
  timestamp: string;
  username: string;
  phone: string;
  action: string;
  details: string;
};

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

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
  return postToSheets({ action: 'register', ...data });
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