'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets.
 * Optimized with better mapping for Organization/Team features.
 */

export type BloodDrive = {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  distance: string;
};

export type Appointment = {
  id: string;
  driveId: string;
  driveName: string;
  userEmail: string;
  userName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
};

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
};

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

async function postToSheets(payload: any) {
  if (!SHEETS_URL) {
    console.error("Backend URL not configured in .env file.");
    throw new Error("Backend URL not configured.");
  }
  
  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON from Sheets POST:", text);
      return { success: false, error: "Invalid response from server" };
    }
  } catch (error) {
    console.error("Sheets POST Error:", error);
    throw error;
  }
}

async function fetchFromSheets(action: string, params: string = "") {
  if (!SHEETS_URL) {
    console.warn("NEXT_PUBLIC_SHEETS_URL is missing. Please check your .env file.");
    return [];
  }
  
  try {
    const url = `${SHEETS_URL}?action=${action}${params}`;
    const res = await fetch(url, { 
      cache: 'no-store',
      redirect: 'follow'
    });
    
    if (!res.ok) {
      console.error(`Fetch failed for ${action}: ${res.status}`);
      return [];
    }

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (data && data.error) {
        console.warn(`API returned error for ${action}:`, data.error);
        return [];
      }
      return Array.isArray(data) ? data : data;
    } catch (parseError) {
      console.error(`Failed to parse JSON for ${action}. Response was:`, text.substring(0, 200));
      return [];
    }
  } catch (error) {
    console.error(`Network error fetching ${action}:`, error);
    return [];
  }
}

export async function getGlobalStats() {
  const data = await fetchFromSheets('getStats');
  return data || { totalDonors: 0, totalRequests: 0, totalAppointments: 0 };
}

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  const data = await fetchFromSheets('getDrives');
  if (!Array.isArray(data)) return [];
  
  const normalized = data.map((d: any) => ({
    id: d.id || '',
    name: d.name || d.driveName || 'Unknown Drive',
    location: d.location || '',
    date: d.date || '',
    time: d.time || '',
    distance: d.distance || 'N/A'
  }));
  
  if (!query) return normalized;
  return normalized.filter((d: BloodDrive) => 
    d.location?.toLowerCase().includes(query.toLowerCase()) || 
    d.name?.toLowerCase().includes(query.toLowerCase())
  );
}

export async function createBloodDrive(data: Omit<BloodDrive, 'id'>) {
  const id = Math.random().toString(36).substring(7);
  return postToSheets({ action: 'createDrive', id, ...data });
}

export async function getDonors(filters?: { bloodType?: string; district?: string; area?: string; union?: string; organization?: string }): Promise<Donor[]> {
  const data = await fetchFromSheets('getDonors');
  if (!Array.isArray(data)) return [];
  
  const normalized: Donor[] = data.map((d: any) => ({
    email: d.email || '',
    fullName: d.fullname || d.fullName || 'নামহীন',
    phone: d.phone || '',
    bloodType: d.bloodtype || d.bloodType || 'Unknown',
    registrationDate: d.registrationdate || d.registrationDate || '',
    district: d.district || '',
    area: d.area || '',
    union: d.union || '',
    organization: d.organization || '',
    status: d.status || 'Available',
    totalDonations: isNaN(parseInt(d.totaldonations)) ? 0 : parseInt(d.totaldonations),
    lastDonationDate: d.lastdonationdate || 'N/A'
  }));

  let filtered = normalized;
  if (filters?.bloodType && filters.bloodType !== 'যেকোনো গ্রুপ') {
    filtered = filtered.filter(d => d.bloodType === filters.bloodType);
  }
  if (filters?.district && filters.district !== 'যেকোনো জেলা') {
    filtered = filtered.filter(d => d.district?.toLowerCase() === filters.district?.toLowerCase());
  }
  if (filters?.area && filters.area !== 'যেকোনো উপজেলা') {
    filtered = filtered.filter(d => d.area?.toLowerCase() === filters.area?.toLowerCase());
  }
  if (filters?.union && filters.union !== 'যেকোনো ইউনিয়ন') {
    filtered = filtered.filter(d => d.union?.toLowerCase() === filters.union?.toLowerCase());
  }
  if (filters?.organization && filters.organization !== 'যেকোনো সংগঠন') {
    filtered = filtered.filter(d => d.organization?.toLowerCase() === filters.organization?.toLowerCase());
  }
  return filtered;
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  return postToSheets({ action: 'register', ...data });
}

export async function updateDonorProfile(originalKey: string, data: Partial<Donor>) {
  return postToSheets({ action: 'updateProfile', originalKey, ...data });
}

export async function bulkRegisterDonors(donors: any[]) {
  return postToSheets({ action: 'bulkRegister', donors });
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  const data = await fetchFromSheets('getRequests');
  if (!Array.isArray(data)) return [];
  
  return data.map((d: any) => ({
    id: d.id || Math.random().toString(36).substring(7),
    patientName: d.patientname || d.patientName || 'Unknown Patient',
    bloodType: d.bloodtype || d.bloodType || '',
    hospitalName: d.hospitalname || d.hospitalName || 'Unknown Hospital',
    district: d.district || '',
    area: d.area || '',
    union: d.union || '',
    phone: d.phone || '',
    neededWhen: d.neededwhen || d.neededWhen || 'Urgent',
    bagsNeeded: d.bagsneeded || d.bagsNeeded || '1',
    isUrgent: d.isurgent === 'Yes' || d.isUrgent === true,
    status: d.status || 'Pending',
    createdAt: d.createdat || d.createdAt || new Date().toISOString()
  }));
}

export async function createBloodRequest(data: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) {
  return postToSheets({ action: 'createRequest', ...data });
}

export async function updateStatus(sheetName: string, id: string, newStatus: string) {
  return postToSheets({ action: 'updateStatus', sheetName, id, newStatus });
}

export async function deleteEntry(sheetName: string, id: string) {
  return postToSheets({ action: 'deleteEntry', sheetName, id });
}

export async function scheduleAppointment(data: Omit<Appointment, 'id' | 'status'>) {
  return postToSheets({ action: 'book', ...data });
}

export async function getDonationHistory(email: string): Promise<Appointment[]> {
  const data = await fetchFromSheets('getHistory', `&email=${email}`);
  if (!Array.isArray(data)) return [];
  
  return data.map((d: any) => ({
    id: d.id || '',
    driveId: d.driveid || d.driveId || '',
    driveName: d.drivename || d.driveName || '',
    userEmail: d.useremail || d.userEmail || '',
    userName: d.username || d.userName || '',
    date: d.date || '',
    time: d.time || '',
    status: d.status || 'Scheduled'
  }));
}

export async function seedLocationData(rows: string[][]) {
  return postToSheets({ action: 'seedLocations', rows });
}