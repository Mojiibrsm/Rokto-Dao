'use server';

/**
 * @fileOverview A mock service layer for interacting with a simulated database (Google Sheets).
 * 
 * - getBloodDrives - Fetches available blood drives.
 * - registerDonor - Registers a new donor.
 * - scheduleAppointment - Schedules a donation appointment.
 * - getDonationHistory - Retrieves appointment history for a user.
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

// Simulated Database (In-memory for this prototype)
let donors: Donor[] = [];
let appointments: Appointment[] = [];

const MOCK_DRIVES: BloodDrive[] = [
  {
    id: '1',
    name: 'City Community Center',
    location: '123 Main St, Metro City',
    date: '2024-06-15',
    time: '09:00 AM - 04:00 PM',
    distance: '1.2 miles',
  },
  {
    id: '2',
    name: 'Red Cross Mobile Unit',
    location: 'Park Plaza, Westside',
    date: '2024-06-18',
    time: '10:00 AM - 06:00 PM',
    distance: '3.5 miles',
  },
  {
    id: '3',
    name: 'General Hospital Drive',
    location: '456 Healthcare Way',
    date: '2024-06-20',
    time: '08:00 AM - 02:00 PM',
    distance: '5.8 miles',
  },
];

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
  if (!query) return MOCK_DRIVES;
  return MOCK_DRIVES.filter(d => 
    d.location.toLowerCase().includes(query.toLowerCase()) || 
    d.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newDonor: Donor = {
    ...data,
    registrationDate: new Date().toISOString(),
  };
  donors.push(newDonor);
  return { success: true, donor: newDonor };
}

export async function scheduleAppointment(data: Omit<Appointment, 'id' | 'status'>) {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newAppointment: Appointment = {
    ...data,
    id: Math.random().toString(36).substring(7),
    status: 'Scheduled',
  };
  appointments.push(newAppointment);
  return { success: true, appointment: newAppointment };
}

export async function getDonationHistory(email: string): Promise<Appointment[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Mock some past donations if it's a test user for demonstration purposes
  if (email === 'test@example.com') {
    return [
      {
        id: 'hist1',
        driveId: 'old1',
        driveName: 'City Hospital',
        userEmail: email,
        userName: 'Test User',
        date: '2023-12-10',
        time: '10:00 AM',
        status: 'Completed',
      },
      {
        id: 'hist2',
        driveId: 'old2',
        driveName: 'Mobile Unit B',
        userEmail: email,
        userName: 'Test User',
        date: '2024-03-15',
        time: '02:30 PM',
        status: 'Completed',
      },
    ];
  }
  return appointments.filter(a => a.userEmail === email);
}
