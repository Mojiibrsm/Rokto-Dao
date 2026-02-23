
'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets.
 * 
 * This file handles real-time data sync with Google Sheets via an Apps Script Web App.
 * Requires NEXT_PUBLIC_SHEETS_URL to be defined in .env.
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
};

export type BloodRequest = {
  id: string;
  patientName: string;
  bloodType: string;
  hospitalName: string;
  district: string;
  area: string;
  phone: string;
  neededWhen: string;
  bagsNeeded: string;
  isUrgent: boolean;
  status: 'Pending' | 'Approved' | 'Fullfilled';
  createdAt: string;
};

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

/**
 * Helper for POST requests to Google Apps Script (bypasses CORS preflight)
 */
async function postToSheets(payload: any) {
  if (!SHEETS_URL) {
    console.error("NEXT_PUBLIC_SHEETS_URL is not defined in your environment variables.");
    throw new Error("Backend URL not configured. Please check your .env file.");
  }

  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      redirect: 'follow',
      // We use text/plain to avoid CORS preflight OPTIONS request
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP Error ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Sheets POST Error:", error);
    throw error;
  }
}

/**
 * Fetches blood drives from the Google Sheet.
 */
export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  if (!SHEETS_URL) return [];
  try {
    const res = await fetch(`${SHEETS_URL}?action=getDrives`, { 
      cache: 'no-store',
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    if (!query) return data;
    return data.filter((d: BloodDrive) => 
      d.location?.toLowerCase().includes(query.toLowerCase()) || 
      d.name?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Failed to fetch real-time blood drives:", error);
    return [];
  }
}

/**
 * Registers a new donor.
 */
export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  return postToSheets({ action: 'register', ...data });
}

/**
 * Fetches all blood requests.
 */
export async function getBloodRequests(): Promise<BloodRequest[]> {
  if (!SHEETS_URL) return [];
  try {
    const res = await fetch(`${SHEETS_URL}?action=getRequests`, { 
      cache: 'no-store',
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch blood requests:", error);
    return [];
  }
}

/**
 * Creates a new blood request.
 */
export async function createBloodRequest(data: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) {
  return postToSheets({ action: 'createRequest', ...data });
}

/**
 * Schedules a new donation appointment.
 */
export async function scheduleAppointment(data: Omit<Appointment, 'id' | 'status'>) {
  return postToSheets({ action: 'book', ...data });
}

/**
 * Fetches donation history.
 */
export async function getDonationHistory(email: string): Promise<Appointment[]> {
  if (!SHEETS_URL) return [];
  try {
    const res = await fetch(`${SHEETS_URL}?action=getHistory&email=${email}`, { 
      cache: 'no-store',
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch donation history:", error);
    return [];
  }
}
