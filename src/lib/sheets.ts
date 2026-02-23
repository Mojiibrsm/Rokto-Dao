'use server';

/**
 * @fileOverview Service layer for interacting with Google Sheets (Real or Mock).
 * 
 * If NEXT_PUBLIC_SHEETS_URL is defined in .env, it uses the real API.
 * Otherwise, it falls back to mock data for prototyping.
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

const MOCK_DRIVES: BloodDrive[] = [
  {
    id: '1',
    name: 'City Community Center (Mock)',
    location: '123 Main St, Metro City',
    date: '2024-06-15',
    time: '09:00 AM - 04:00 PM',
    distance: '1.2 miles',
  },
  {
    id: '2',
    name: 'Red Cross Mobile Unit (Mock)',
    location: 'Park Plaza, Westside',
    date: '2024-06-18',
    time: '10:00 AM - 06:00 PM',
    distance: '3.5 miles',
  },
];

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  if (SHEETS_URL) {
    try {
      const res = await fetch(`${SHEETS_URL}?action=getDrives`, { cache: 'no-store' });
      const data = await res.json();
      if (!query) return data;
      return data.filter((d: BloodDrive) => 
        d.location.toLowerCase().includes(query.toLowerCase()) || 
        d.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Failed to fetch real drives, using mocks", error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  if (!query) return MOCK_DRIVES;
  return MOCK_DRIVES.filter(d => 
    d.location.toLowerCase().includes(query.toLowerCase()) || 
    d.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  if (SHEETS_URL) {
    try {
      const res = await fetch(SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'register', ...data }),
      });
      return await res.json();
    } catch (error) {
      console.error("Failed to register in real sheet", error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, donor: { ...data, registrationDate: new Date().toISOString() } };
}

export async function scheduleAppointment(data: Omit<Appointment, 'id' | 'status'>) {
  if (SHEETS_URL) {
    try {
      const res = await fetch(SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'book', ...data }),
      });
      return await res.json();
    } catch (error) {
      console.error("Failed to book in real sheet", error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, id: Math.random().toString(36).substring(7) };
}

export async function getDonationHistory(email: string): Promise<Appointment[]> {
  if (SHEETS_URL) {
    try {
      const res = await fetch(`${SHEETS_URL}?action=getHistory&email=${email}`, { cache: 'no-store' });
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch real history", error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  if (email === 'test@example.com') {
    return [
      {
        id: 'hist1',
        driveId: 'old1',
        driveName: 'City Hospital (Mock)',
        userEmail: email,
        userName: 'Test User',
        date: '2023-12-10',
        time: '10:00 AM',
        status: 'Completed',
      },
    ];
  }
  return [];
}
