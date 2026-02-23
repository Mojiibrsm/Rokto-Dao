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
  const normalized = data.map((d: any) => ({
    id: d.id,
    name: d.name,
    location: d.location,
    date: d.date,
    time: d.time,
    distance: d.distance
  }));
  if (!query) return normalized;
  return normalized.filter((d: BloodDrive) => 
    d.location?.toLowerCase().includes(query.toLowerCase()) || 
    d.name?.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getDonors(filters?: { bloodType?: string; district?: string; area?: string; union?: string }): Promise<Donor[]> {
  const data = await fetchFromSheets('getDonors');
  const normalized: Donor[] = data.map((d: any) => ({
    email: d.email,
    fullName: d.fullname || d.fullName || 'নামহীন',
    phone: d.phone,
    bloodType: d.bloodtype || d.bloodType,
    registrationDate: d.registrationdate || d.registrationDate,
    district: d.district,
    area: d.area,
    union: d.union,
    status: d.status,
    totalDonations: parseInt(d.totaldonations || d.totalDonations || '0'),
    lastDonationDate: d.lastdonationdate || d.lastDonationDate || 'N/A'
  }));

  let filtered = normalized;
  if (filters?.bloodType) {
    filtered = filtered.filter(d => d.bloodType === filters.bloodType);
  }
  if (filters?.district) {
    filtered = filtered.filter(d => d.district?.toLowerCase() === filters.district?.toLowerCase());
  }
  if (filters?.area) {
    filtered = filtered.filter(d => d.area?.toLowerCase() === filters.area?.toLowerCase());
  }
  if (filters?.union) {
    filtered = filtered.filter(d => d.union?.toLowerCase() === filters.union?.toLowerCase());
  }
  return filtered;
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  return postToSheets({ action: 'register', ...data });
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  const data = await fetchFromSheets('getRequests');
  return data.map((d: any) => ({
    id: d.id,
    patientName: d.patientname || d.patientName,
    bloodType: d.bloodtype || d.bloodType,
    hospitalName: d.hospitalname || d.hospitalName,
    district: d.district,
    area: d.area,
    union: d.union,
    phone: d.phone,
    neededWhen: d.neededwhen || d.neededWhen,
    bagsNeeded: d.bagsneeded || d.bagsNeeded,
    isUrgent: d.isurgent === 'Yes' || d.isUrgent === true,
    status: d.status,
    createdAt: d.createdat || d.createdAt
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
  return data.map((d: any) => ({
    id: d.id,
    driveId: d.driveid || d.driveId,
    driveName: d.drivename || d.driveName,
    userEmail: d.useremail || d.userEmail,
    userName: d.username || d.userName,
    date: d.date,
    time: d.time,
    status: d.status
  }));
}

export async function seedLocationData(rows: string[][]) {
  return postToSheets({ action: 'seedLocations', rows });
}
