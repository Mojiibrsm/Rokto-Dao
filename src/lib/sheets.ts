'use server';

import { db, initDb } from './turso';

/**
 * @fileOverview Service layer using Turso Database as primary source.
 * Handles data fetching, registration, and migration from Google Sheets.
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
  role?: 'user' | 'admin';
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

export type BloodDrive = {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  distance?: string;
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

const SMS_API_KEY = process.env.SMS_API_KEY;
const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function sendSMS(recipient: string, message: string) {
  if (!SMS_API_KEY) return null;
  try {
    let phone = String(recipient).replace(/\D/g, '');
    if (phone.length === 10) phone = '0' + phone;
    const res = await fetch('https://sms.anbuinfosec.dev/api/v1/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: SMS_API_KEY, recipient: phone, message })
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

// --- DATABASE OPERATIONS ---

export async function getDonors(): Promise<Donor[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM donors");
  return res.rows.map(row => ({
    email: String(row.email || ''),
    fullName: String(row.fullName || ''),
    phone: String(row.phone || ''),
    bloodType: String(row.bloodType || ''),
    registrationDate: String(row.registrationDate || ''),
    district: String(row.district || ''),
    area: String(row.area || ''),
    union: String(row.union || ''),
    organization: String(row.organization || ''),
    status: String(row.status || ''),
    totalDonations: Number(row.totalDonations || 0),
    lastDonationDate: String(row.lastDonationDate || ''),
    password: String(row.password || ''),
    role: (row.role || 'user') as any
  }));
}

export async function registerDonor(data: Omit<Donor, 'registrationDate'>) {
  await initDb();
  const date = new Date().toISOString();
  try {
    const countRes = await db.execute("SELECT COUNT(*) as count FROM donors");
    const count = Number(countRes.rows[0].count);
    const role = count === 0 ? 'admin' : 'user';

    await db.execute({
      sql: `INSERT OR REPLACE INTO donors (email, fullName, phone, bloodType, registrationDate, district, area, "union", organization, totalDonations, lastDonationDate, password, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [data.email, data.fullName, data.phone, data.bloodType, date, data.district || '', data.area || '', data.union || '', data.organization || '', data.totalDonations || 0, 'N/A', '', role]
    });
    
    const smsMessage = `স্বাগতম ${data.fullName}! RoktoDao-তে নিবন্ধিত হওয়ার জন্য ধন্যবাদ। আপনার রক্তের গ্রুপ: ${data.bloodType}। মানবতার সেবায় পাশে থাকুন।`;
    await sendSMS(data.phone, smsMessage);
    
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function bulkRegisterDonors(donors: any[]) {
  await initDb();
  try {
    for (const d of donors) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO donors (email, fullName, phone, bloodType, registrationDate, district, area, "union", organization, totalDonations, lastDonationDate, password, role) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          d.email || `bulk-${Date.now()}-${Math.random()}@roktodao.com`, 
          d.fullName, 
          d.phone, 
          d.bloodType, 
          new Date().toISOString(), 
          d.district || '', 
          d.area || '', 
          d.union || '',
          d.organization || '', 
          0, 
          'N/A', 
          '',
          'user'
        ]
      });
    }
    return { success: true, count: donors.length };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function updateDonorProfile(originalKey: string, data: Partial<Donor>) {
  await initDb();
  await db.execute({
    sql: `UPDATE donors SET fullName = ?, email = ?, district = ?, area = ?, "union" = ?, organization = ?, totalDonations = ? WHERE phone = ? OR email = ?`,
    args: [data.fullName, data.email, data.district, data.area, data.union, data.organization, data.totalDonations, originalKey, originalKey]
  });
  return { success: true };
}

export async function setDonorPassword(email: string, phone: string, password: string) {
  await initDb();
  await db.execute({
    sql: `UPDATE donors SET password = ? WHERE phone = ? OR email = ?`,
    args: [password, phone, email]
  });
  return { success: true };
}

export async function logActivity(userName: string, phone: string, action: string, details: string) {
  await initDb();
  await db.execute({
    sql: `INSERT INTO logs (timestamp, username, phone, action, details) VALUES (?, ?, ?, ?, ?)`,
    args: [new Date().toISOString(), userName, phone, action, details]
  });
  return { success: true };
}

export async function getLogs(): Promise<ActivityLog[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 200");
  return res.rows.map(row => ({
    timestamp: String(row.timestamp),
    username: String(row.username),
    phone: String(row.phone),
    action: String(row.action),
    details: String(row.details)
  }));
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM requests ORDER BY createdAt DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    patientName: String(row.patientName || ''),
    bloodType: String(row.bloodType || ''),
    hospitalName: String(row.hospitalName || ''),
    district: String(row.district || ''),
    area: String(row.area || ''),
    union: String(row.union || ''),
    phone: String(row.phone || ''),
    neededWhen: String(row.neededWhen || ''),
    bagsNeeded: String(row.bagsNeeded || '1'),
    isUrgent: String(row.isUrgent) === 'Yes',
    status: (row.status || 'Approved') as any,
    createdAt: String(row.createdAt || ''),
    disease: String(row.disease || ''),
    diseaseInfo: String(row.diseaseInfo || ''),
    createdBy: String(row.createdBy || 'Public')
  }));
}

export async function createBloodRequest(data: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) {
  await initDb();
  const id = 'REQ' + Math.random().toString(36).substring(7).toUpperCase();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO requests (id, patientName, bloodType, hospitalName, district, area, "union", phone, neededWhen, bagsNeeded, isUrgent, status, createdAt, disease, diseaseInfo, createdBy) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.patientName || '', data.bloodType, data.hospitalName, data.district, data.area || '', data.union || '', data.phone, data.neededWhen, data.bagsNeeded, data.isUrgent ? 'Yes' : 'No', 'Approved', now, data.disease || '', data.diseaseInfo || '', data.createdBy || 'Public']
  });

  const adminNumber = '01601519007';
  const adminMessage = `নতুন রক্তের অনুরোধ! গ্রুপ: ${data.bloodType}, হাসপাতাল: ${data.hospitalName}, ফোন: ${data.phone}. RoktoDao.`;
  await sendSMS(adminNumber, adminMessage);

  return { success: true, id };
}

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  await initDb();
  let sql = "SELECT * FROM drives";
  let args: any[] = [];
  if (query) {
    sql += " WHERE name LIKE ? OR location LIKE ?";
    args = [`%${query}%`, `%${query}%`];
  }
  const res = await db.execute({ sql, args });
  return res.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    location: String(row.location),
    date: String(row.date),
    time: String(row.time),
    distance: String(row.distance || '0 km')
  }));
}

export async function createBloodDrive(data: Omit<BloodDrive, 'id'>) {
  await initDb();
  const id = 'D' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: `INSERT INTO drives (id, name, location, date, time, distance) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, data.name, data.location, data.date, data.time, data.distance || '0 km']
  });
  return { success: true, id };
}

export async function scheduleAppointment(data: any) {
  await initDb();
  const id = 'APT' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: `INSERT INTO appointments (id, driveId, driveName, userEmail, userName, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.driveId, data.driveName, data.userEmail, data.userName, data.date, data.time, 'Scheduled']
  });
  return { success: true, id };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM team");
  return res.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    role: String(row.role),
    bio: String(row.bio),
    imageurl: String(row.imageurl),
    twitter: String(row.twitter || ''),
    linkedin: String(row.linkedin || ''),
    email: String(row.email || '')
  }));
}

export async function addTeamMember(data: Omit<TeamMember, 'id'>) {
  await initDb();
  const id = Math.random().toString(36).substring(7);
  await db.execute({
    sql: `INSERT INTO team (id, name, role, bio, imageurl, twitter, linkedin, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.name, data.role, data.bio, data.imageurl, data.twitter || '', data.linkedin || '', data.email || '']
  });
  return { success: true, id };
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>) {
  await initDb();
  await db.execute({
    sql: `UPDATE team SET name = ?, role = ?, bio = ?, imageurl = ? WHERE id = ?`,
    args: [data.name, data.role, data.bio, data.imageurl, id]
  });
  return { success: true };
}

export async function getGallery(): Promise<GalleryItem[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM gallery ORDER BY createdat DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    imageurl: String(row.imageurl),
    title: String(row.title),
    category: String(row.category),
    createdat: String(row.createdat)
  }));
}

export async function addGalleryItem(data: { imageurl: string; title: string; category: string }) {
  await initDb();
  const id = 'G' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: `INSERT INTO gallery (id, imageurl, title, category, createdat) VALUES (?, ?, ?, ?, ?)`,
    args: [id, data.imageurl, data.title, data.category, new Date().toISOString()]
  });
  return { success: true, id };
}

export async function getBlogs(): Promise<BlogPost[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM blogs ORDER BY createdat DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt),
    content: String(row.content),
    category: String(row.category),
    author: String(row.author),
    imageurl: String(row.imageurl),
    createdat: String(row.createdat)
  }));
}

export async function addBlog(data: Omit<BlogPost, 'id' | 'createdat'>) {
  await initDb();
  const id = 'B' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: `INSERT INTO blogs (id, title, slug, excerpt, content, category, author, imageurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.title, data.slug, data.excerpt, data.content, data.category, data.author, data.imageurl, new Date().toISOString()]
  });
  return { success: true, id };
}

export async function updateBlog(id: string, data: Partial<BlogPost>) {
  await initDb();
  await db.execute({
    sql: `UPDATE blogs SET title = ?, content = ? WHERE id = ?`,
    args: [data.title, data.content, id]
  });
  return { success: true };
}

export async function deleteEntry(sheetName: string, keyValue: string) {
  await initDb();
  const table = sheetName.toLowerCase();
  const pk = (table === 'donors') ? 'phone' : 'id';
  await db.execute({
    sql: `DELETE FROM ${table} WHERE ${pk} = ?`,
    args: [keyValue]
  });
  return { success: true };
}

export async function getAdminPassword(): Promise<string> {
  return ADMIN_PASSWORD;
}

export async function getGlobalStats() {
  await initDb();
  try {
    const donors = await db.execute("SELECT COUNT(*) as count FROM donors");
    const requests = await db.execute("SELECT COUNT(*) as count FROM requests");
    return {
      totalDonors: Number(donors.rows[0]?.count || 0),
      totalRequests: Number(requests.rows[0]?.count || 0),
      lastUpdate: new Date().getTime().toString()
    };
  } catch (e) {
    return { totalDonors: 0, totalRequests: 0, lastUpdate: '0' };
  }
}

// --- MIGRATION LOGIC ---

export async function migrateAllDataFromSheets() {
  if (!SHEETS_URL) throw new Error("Sheets URL not configured.");
  await initDb();

  const actions = ['getDonors', 'getRequests', 'getTeam', 'getGallery', 'getBlogs', 'getLogs', 'getDrives'];
  const results: any = {};

  for (const action of actions) {
    try {
      const url = `${SHEETS_URL}?action=${action}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        results[action] = await res.json();
      }
    } catch (e) {
      console.error(`Migration error for ${action}:`, e);
    }
  }

  // Migrate Donors
  if (results.getDonors && Array.isArray(results.getDonors)) {
    for (const d of results.getDonors) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO donors (email, fullName, phone, bloodType, registrationDate, district, area, "union", organization, totalDonations, lastDonationDate, password, role) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          args: [
            d.email || '', 
            d.fullname || d.fullName || '', 
            String(d.phone || ''), 
            d.bloodtype || d.bloodType || '', 
            d.registrationdate || d.registrationDate || new Date().toISOString(), 
            d.district || '', 
            d.area || '', 
            d.union || '', 
            d.organization || '', 
            Number(d.totaldonations || d.totalDonations || 0), 
            d.lastdonationdate || d.lastDonationDate || 'N/A', 
            d.password || '', 
            'user'
          ]
        });
      } catch (e) { console.error('Donor insert error:', e); }
    }
  }

  // Migrate Requests
  if (results.getRequests && Array.isArray(results.getRequests)) {
    for (const r of results.getRequests) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO requests (id, patientName, bloodType, hospitalName, district, area, "union", phone, neededWhen, bagsNeeded, isUrgent, status, createdAt, disease, diseaseInfo, createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          args: [
            r.id, 
            r.patientname || r.patientName || '', 
            r.bloodtype || r.bloodType || '', 
            r.hospitalname || r.hospitalName || '', 
            r.district || '', 
            r.area || '', 
            r.union || '', 
            String(r.phone || ''), 
            r.neededwhen || r.neededWhen || '', 
            String(r.bagsneeded || r.bagsNeeded || '1'), 
            String(r.isurgent || r.isUrgent || 'No') === 'Yes' ? 'Yes' : 'No', 
            r.status || 'Approved', 
            r.createdat || r.createdAt || new Date().toISOString(), 
            r.disease || '', 
            r.diseaseinfo || r.diseaseInfo || '', 
            r.createdby || r.createdBy || 'Public'
          ]
        });
      } catch (e) { console.error('Request insert error:', e); }
    }
  }

  // Migrate Blogs
  if (results.getBlogs && Array.isArray(results.getBlogs)) {
    for (const b of results.getBlogs) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO blogs (id, title, slug, excerpt, content, category, author, imageurl, createdat) VALUES (?,?,?,?,?,?,?,?,?)`,
          args: [b.id, b.title, b.slug, b.excerpt, b.content, b.category, b.author, b.imageurl, b.createdat || new Date().toISOString()]
        });
      } catch (e) { console.error('Blog insert error:', e); }
    }
  }

  // Migrate Team
  if (results.getTeam && Array.isArray(results.getTeam)) {
    for (const t of results.getTeam) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO team (id, name, role, bio, imageurl, twitter, linkedin, email) VALUES (?,?,?,?,?,?,?,?)`,
          args: [t.id, t.name, t.role, t.bio, t.imageurl, t.twitter || '', t.linkedin || '', t.email || '']
        });
      } catch (e) { console.error('Team insert error:', e); }
    }
  }

  // Migrate Gallery
  if (results.getGallery && Array.isArray(results.getGallery)) {
    for (const g of results.getGallery) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO gallery (id, imageurl, title, category, createdat) VALUES (?,?,?,?,?)`,
          args: [g.id, g.imageurl, g.title, g.category, g.createdat || new Date().toISOString()]
        });
      } catch (e) { console.error('Gallery insert error:', e); }
    }
  }

  // Migrate Drives
  if (results.getDrives && Array.isArray(results.getDrives)) {
    for (const dr of results.getDrives) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO drives (id, name, location, date, time, distance) VALUES (?,?,?,?,?,?)`,
          args: [dr.id, dr.name, dr.location, dr.date, dr.time, dr.distance || '0 km']
        });
      } catch (e) { console.error('Drive insert error:', e); }
    }
  }

  return { success: true };
}
