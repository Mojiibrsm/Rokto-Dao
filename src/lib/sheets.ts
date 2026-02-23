'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets.
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
  if (!SHEETS_URL) throw new Error("Backend URL not configured.");
  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("Sheets POST Error:", error);
    throw error;
  }
}

async function fetchFromSheets(action: string, params: string = "") {
  if (!SHEETS_URL) return [];
  try {
    const res = await fetch(`${SHEETS_URL}?action=${action}${params}`, { 
      cache: 'no-store',
      redirect: 'follow'
    });
    const data = await res.json();
    return Array.isArray(data) ? data : (data.error ? [] : data);
  } catch (error) {
    console.error(`Failed to fetch ${action}:`, error);
    return [];
  }
}

export async function getGlobalStats() {
  return await fetchFromSheets('getStats');
}

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  const data = await fetchFromSheets('getDrives');
  if (!query) return data;
  return data.filter((d: BloodDrive) => 
    d.location?.toLowerCase().includes(query.toLowerCase()) || 
    d.name?.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getDonors(filters?: { bloodType?: string; district?: string; area?: string; union?: string }): Promise<Donor[]> {
  let data = await fetchFromSheets('getDonors');
  if (filters?.bloodType) {
    data = data.filter((d: Donor) => d.bloodtype === filters.bloodType);
  }
  if (filters?.district) {
    data = data.filter((d: Donor) => d.district?.toLowerCase() === filters.district?.toLowerCase());
  }
  if (filters?.area) {
    data = data.filter((d: Donor) => d.area?.toLowerCase() === filters.area?.toLowerCase());
  }
  if (filters?.union) {
    data = data.filter((d: Donor) => d.union?.toLowerCase() === filters.union?.toLowerCase());
  }
  return data;
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  return postToSheets({ action: 'register', ...data });
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  return await fetchFromSheets('getRequests');
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
  return await fetchFromSheets('getHistory', `&email=${email}`);
}

export async function seedLocationData(rows: string[][]) {
  return postToSheets({ action: 'seedLocations', rows });
}
