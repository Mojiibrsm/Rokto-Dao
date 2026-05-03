'use server';

import { db, initDb } from './turso';

/**
 * @fileOverview Service layer using Turso Database as primary source.
 * Provides all data fetching and mutation functions for the application.
 */

// --- TYPES ---

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
  imageUrl?: string;
  lat?: number;
  lng?: number;
  slug?: string;
};

// --- HELPERS ---

function generateUserSlug(name: string, district: string = ''): string {
  const base = `${name} ${district}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  const random = Math.random().toString(36).substring(7);
  return `${base}-${random}`;
}

// --- DONOR OPERATIONS ---

export async function getDonors(): Promise<Donor[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM donors ORDER BY registrationDate DESC");
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
    role: (row.role || 'user') as any,
    imageUrl: String(row.imageUrl || ''),
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
    slug: String(row.slug || '')
  }));
}

export async function getDonorByPhone(phone: string): Promise<Donor | null> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM donors WHERE phone = ?",
    args: [phone]
  });
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
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
    role: (row.role || 'user') as any,
    imageUrl: String(row.imageUrl || ''),
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
    slug: String(row.slug || '')
  };
}

export async function getDonorBySlug(slug: string): Promise<Donor | null> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM donors WHERE slug = ?",
    args: [slug]
  });
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
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
    role: (row.role || 'user') as any,
    imageUrl: String(row.imageUrl || ''),
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
    slug: String(row.slug || '')
  };
}

export async function registerDonor(data: Omit<Donor, 'registrationDate' | 'slug'>) {
  await initDb();
  const date = new Date().toISOString();
  const slug = generateUserSlug(data.fullName, data.district);
  
  try {
    const countRes = await db.execute("SELECT COUNT(*) as count FROM donors");
    const count = Number(countRes.rows[0].count);
    const role = count === 0 ? 'admin' : 'user';

    await db.execute({
      sql: `INSERT OR REPLACE INTO donors (email, fullName, phone, bloodType, registrationDate, district, area, "union", organization, totalDonations, lastDonationDate, password, role, imageUrl, lat, lng, slug) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [data.email, data.fullName, data.phone, data.bloodType, date, data.district || '', data.area || '', data.union || '', data.organization || '', data.totalDonations || 0, 'N/A', data.password || '', role, data.imageUrl || '', data.lat || null, data.lng || null, slug]
    });
    
    return { success: true, slug };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function updateDonorProfile(originalKey: string, data: Partial<Donor>) {
  await initDb();
  try {
    const current = await getDonorByPhone(originalKey) || await getDonorBySlug(originalKey);
    let newSlug = current?.slug;
    
    // Update slug if name or district changes
    if (data.fullName || data.district) {
      newSlug = generateUserSlug(data.fullName || current?.fullName || '', data.district || current?.district || '');
    }

    await db.execute({
      sql: `UPDATE donors SET fullName = ?, email = ?, phone = ?, district = ?, area = ?, organization = ?, totalDonations = ?, imageUrl = ?, lat = ?, lng = ?, slug = ? WHERE email = ? OR phone = ? OR slug = ?`,
      args: [
        data.fullName || current?.fullName, 
        data.email || current?.email, 
        data.phone || current?.phone, 
        data.district || current?.district, 
        data.area || current?.area, 
        data.organization || current?.organization, 
        data.totalDonations ?? current?.totalDonations, 
        data.imageUrl || current?.imageUrl, 
        data.lat || current?.lat || null, 
        data.lng || current?.lng || null, 
        newSlug,
        originalKey, 
        originalKey,
        originalKey
      ]
    });
    return { success: true, slug: newSlug };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

// (Rest of the file Omitted as it remains unchanged)
export async function setDonorPassword(email: string, phone: string, password: string) {
  await initDb();
  try {
    await db.execute({
      sql: `UPDATE donors SET password = ? WHERE email = ? OR phone = ?`,
      args: [password, email, phone]
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
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
  
  try {
    await db.execute({
      sql: `INSERT INTO requests (id, patientName, bloodType, hospitalName, district, area, "union", phone, neededWhen, bagsNeeded, isUrgent, status, createdAt, disease, diseaseInfo, createdBy) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, data.patientName || '', data.bloodType, data.hospitalName, data.district, data.area || '', data.union || '', data.phone, data.neededWhen, data.bagsNeeded, data.isUrgent ? 'Yes' : 'No', 'Approved', now, data.disease || '', data.diseaseInfo || '', data.createdBy || 'Public']
    });
    return { success: true, id };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  }
}

export async function submitReport(data: Omit<Report, 'id' | 'timestamp' | 'status'>) {
  await initDb();
  const id = 'REP' + Math.random().toString(36).substring(7).toUpperCase();
  const now = new Date().toISOString();
  try {
    await db.execute({
      sql: `INSERT INTO reports (id, type, targetId, targetName, reporterPhone, reason, details, timestamp, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, data.type, data.targetId, data.targetName, data.reporterPhone, data.reason, data.details, now, 'Pending']
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function getReports(): Promise<Report[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM reports ORDER BY timestamp DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    type: row.type as any,
    targetId: String(row.targetId),
    targetName: String(row.targetName),
    reporterPhone: String(row.reporterPhone),
    reason: String(row.reason),
    details: String(row.details || ''),
    timestamp: String(row.timestamp),
    status: row.status as any
  }));
}

export async function updateReportStatus(id: string, status: string) {
  await initDb();
  await db.execute({
    sql: "UPDATE reports SET status = ? WHERE id = ?",
    args: [status, id]
  });
  return { success: true };
}

export async function getGallery(): Promise<GalleryItem[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM gallery ORDER BY createdat DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    imageurl: String(row.imageurl),
    title: String(row.title || ''),
    category: String(row.category || ''),
    createdat: String(row.createdat || '')
  }));
}

export async function addGalleryItem(data: { title: string; imageurl: string; category: string }) {
  await initDb();
  const id = 'G' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: "INSERT INTO gallery (id, title, imageurl, category, createdat) VALUES (?, ?, ?, ?, ?)",
    args: [id, data.title, data.imageurl, data.category, new Date().toISOString()]
  });
  return { success: true };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM team");
  return res.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    role: String(row.role),
    bio: String(row.bio || ''),
    imageurl: String(row.imageurl || ''),
    twitter: String(row.twitter || ''),
    linkedin: String(row.linkedin || ''),
    email: String(row.email || '')
  }));
}

export async function addTeamMember(data: Omit<TeamMember, 'id'>) {
  await initDb();
  const id = Math.random().toString(36).substring(7);
  await db.execute({
    sql: "INSERT INTO team (id, name, role, bio, imageurl, twitter, linkedin, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, data.name, data.role, data.bio, data.imageurl, data.twitter, data.linkedin, data.email]
  });
  return { success: true };
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>) {
  await initDb();
  await db.execute({
    sql: "UPDATE team SET name = ?, role = ?, bio = ?, imageurl = ?, twitter = ?, linkedin = ?, email = ? WHERE id = ?",
    args: [data.name, data.role, data.bio, data.imageurl, data.twitter, data.linkedin, data.email, id]
  });
  return { success: true };
}

export async function getBlogs(): Promise<BlogPost[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM blogs ORDER BY createdat DESC");
  return res.rows.map(row => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt || ''),
    content: String(row.content || ''),
    category: String(row.category || ''),
    author: String(row.author || ''),
    imageurl: String(row.imageurl || ''),
    createdat: String(row.createdat || '')
  }));
}

export async function addBlog(data: Omit<BlogPost, 'id' | 'createdat'>) {
  await initDb();
  const id = 'B' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: "INSERT INTO blogs (id, title, slug, excerpt, content, category, author, imageurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, data.title, data.slug, data.excerpt, data.content, data.category, data.author, data.imageurl, new Date().toISOString()]
  });
  return { success: true };
}

export async function updateBlog(id: string, data: Partial<BlogPost>) {
  await initDb();
  await db.execute({
    sql: "UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author = ?, imageurl = ? WHERE id = ?",
    args: [data.title, data.slug, data.excerpt, data.content, data.category, data.author, data.imageurl, id]
  });
  return { success: true };
}

export async function getBloodDrives(query?: string): Promise<BloodDrive[]> {
  await initDb();
  const res = await db.execute("SELECT * FROM drives ORDER BY date DESC");
  const drives = res.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    location: String(row.location),
    date: String(row.date),
    time: String(row.time),
    distance: String(row.distance || '0 km')
  }));
  
  if (query) {
    return drives.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) || 
      d.location.toLowerCase().includes(query.toLowerCase())
    );
  }
  return drives;
}

export async function createBloodDrive(data: Omit<BloodDrive, 'id'>) {
  await initDb();
  const id = 'D' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: "INSERT INTO drives (id, name, location, date, time, distance) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, data.name, data.location, data.date, data.time, data.distance || '0 km']
  });
  return { success: true };
}

export async function scheduleAppointment(data: any) {
  await initDb();
  const id = 'APT' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: "INSERT INTO appointments (id, driveId, driveName, userEmail, userName, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, data.driveId, data.driveName, data.userEmail, data.userName, data.date, data.time, 'Confirmed']
  });
  return { success: true };
}

export async function getConversations(userPhone: string): Promise<Conversation[]> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM conversations WHERE p1 = ? OR p2 = ? ORDER BY updatedAt DESC",
    args: [userPhone, userPhone]
  });

  const convos = res.rows.map(row => ({
    id: String(row.id),
    p1: String(row.p1),
    p2: String(row.p2),
    lastMessage: String(row.lastMessage),
    updatedAt: String(row.updatedAt)
  }));

  const populated = [];
  for (const convo of convos) {
    const otherPhone = convo.p1 === userPhone ? convo.p2 : convo.p1;
    const otherUser = await getDonorByPhone(otherPhone);
    populated.push({ ...convo, otherUser: otherUser || undefined });
  }

  return populated as Conversation[];
}

export async function getMessages(convoId: string): Promise<Message[]> {
  await initDb();
  const res = await db.execute({
    sql: "SELECT * FROM messages WHERE convoId = ? ORDER BY timestamp ASC",
    args: [convoId]
  });
  return res.rows.map(row => ({
    id: String(row.id),
    convoId: String(row.convoId),
    sender: String(row.sender),
    receiver: String(row.receiver),
    content: String(row.content),
    timestamp: String(row.timestamp),
    isRead: Number(row.isRead) === 1
  }));
}

export async function sendMessage(sender: string, receiver: string, content: string) {
  await initDb();
  if (sender === receiver) return { success: false, error: "Cannot message self" };

  const sortedPhones = [sender, receiver].sort();
  const convoId = `CHAT_${sortedPhones[0]}_${sortedPhones[1]}`;
  
  await db.execute({
    sql: `INSERT OR REPLACE INTO conversations (id, p1, p2, lastMessage, updatedAt) 
          VALUES (?, ?, ?, ?, ?)`,
    args: [convoId, sortedPhones[0], sortedPhones[1], content, new Date().toISOString()]
  });

  const msgId = 'MSG' + Math.random().toString(36).substring(7).toUpperCase();
  await db.execute({
    sql: `INSERT INTO messages (id, convoId, sender, receiver, content, timestamp) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [msgId, convoId, sender, receiver, content, new Date().toISOString()]
  });

  return { success: true, convoId };
}

export async function logActivity(username: string, phone: string, action: string, details: string) {
  await initDb();
  try {
    await db.execute({
      sql: "INSERT INTO logs (timestamp, username, phone, action, details) VALUES (?, ?, ?, ?, ?)",
      args: [new Date().toISOString(), username, phone, action, details]
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
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

export async function deleteEntry(sheetName: string, keyValue: string) {
  await initDb();
  const table = sheetName.toLowerCase() === 'team' ? 'team' : sheetName.toLowerCase() === 'gallery' ? 'gallery' : sheetName.toLowerCase() === 'blogs' ? 'blogs' : sheetName.toLowerCase() === 'donors' ? 'donors' : sheetName.toLowerCase();
  const pk = (table === 'donors') ? 'phone' : 'id';
  await db.execute({
    sql: `DELETE FROM ${table} WHERE ${pk} = ?`,
    args: [keyValue]
  });
  return { success: true };
}

export async function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123';
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

export async function migrateAllDataFromSheets() {
  const url = process.env.NEXT_PUBLIC_SHEETS_URL;
  if (!url) return { error: 'Sheets URL not configured' };

  const tables = ['Donors', 'Requests', 'Gallery', 'Team', 'Blogs', 'BloodDrives'];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${url}?action=get${table === 'Donors' ? 'Donors' : table === 'Requests' ? 'Requests' : table === 'BloodDrives' ? 'Drives' : table}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        if (table === 'Donors') {
          for (const d of data) {
            const slug = generateUserSlug(d.fullname, d.district);
            await db.execute({
              sql: `INSERT OR REPLACE INTO donors (email, fullName, phone, bloodType, registrationDate, district, area, organization, totalDonations, lastDonationDate, password, role, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [d.email, d.fullname, d.phone, d.bloodtype, d.registrationdate, d.district, d.area, d.organization, d.totaldonations, d.lastdonationdate, d.password, 'user', slug]
            });
          }
        } else if (table === 'Requests') {
          for (const r of data) {
            await db.execute({
              sql: `INSERT OR REPLACE INTO requests (id, patientName, bloodType, hospitalName, district, area, phone, neededWhen, bagsNeeded, isUrgent, status, createdAt, disease, diseaseInfo, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [r.id, r.patientname, r.bloodtype, r.hospitalname, r.district, r.area, r.phone, r.neededwhen, r.bagsneeded, r.isurgent, r.status, r.createdat, r.disease, r.diseaseinfo, r.createdby]
            });
          }
        } else if (table === 'Gallery') {
          for (const g of data) {
            await db.execute({
              sql: `INSERT OR REPLACE INTO gallery (id, title, imageurl, category, createdat) VALUES (?, ?, ?, ?, ?)`,
              args: [g.id, g.title, g.imageurl, g.category, g.createdat]
            });
          }
        } else if (table === 'Team') {
          for (const t of data) {
            await db.execute({
              sql: `INSERT OR REPLACE INTO team (id, name, role, bio, imageurl, twitter, linkedin, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [t.id, t.name, t.role, t.bio, t.imageurl, t.twitter, t.linkedin, t.email]
            });
          }
        } else if (table === 'Blogs') {
          for (const b of data) {
            await db.execute({
              sql: `INSERT OR REPLACE INTO blogs (id, title, slug, excerpt, content, category, author, imageurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [b.id, b.title, b.slug, b.excerpt, b.content, b.category, b.author, b.imageurl, b.createdat]
            });
          }
        }
      }
    } catch (e) {
      console.error(`Migration failed for ${table}:`, e);
    }
  }
  return { success: true };
}
