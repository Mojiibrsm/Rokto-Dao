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

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

/**
 * Fetches blood drives from the Google Sheet.
 * @param query Optional search query to filter results.
 */
export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  if (!SHEETS_URL) {
    console.error("NEXT_PUBLIC_SHEETS_URL is not configured in environment variables.");
    return [];
  }

  try {
    const res = await fetch(`${SHEETS_URL}?action=getDrives`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    if (!query) return data;
    
    return data.filter((d: BloodDrive) => 
      d.location.toLowerCase().includes(query.toLowerCase()) || 
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Failed to fetch real-time blood drives:", error);
    return [];
  }
}

/**
 * Registers a new donor in the Google Sheet.
 */
export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  if (!SHEETS_URL) {
    throw new Error("NEXT_PUBLIC_SHEETS_URL is not configured.");
  }

  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'register', ...data }),
    });
    
    if (!res.ok) throw new Error("Failed to register donor in sheet.");
    return await res.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Schedules a new donation appointment in the Google Sheet.
 */
export async function scheduleAppointment(data: Omit<Appointment, 'id' | 'status'>) {
  if (!SHEETS_URL) {
    throw new Error("NEXT_PUBLIC_SHEETS_URL is not configured.");
  }

  try {
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'book', ...data }),
    });
    
    if (!res.ok) throw new Error("Failed to schedule appointment in sheet.");
    return await res.json();
  } catch (error) {
    console.error("Booking error:", error);
    throw error;
  }
}

/**
 * Fetches donation history for a specific email from the Google Sheet.
 */
export async function getDonationHistory(email: string): Promise<Appointment[]> {
  if (!SHEETS_URL) {
    console.error("NEXT_PUBLIC_SHEETS_URL is not configured.");
    return [];
  }

  try {
    const res = await fetch(`${SHEETS_URL}?action=getHistory&email=${email}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch real-time donation history:", error);
    return [];
  }
}
