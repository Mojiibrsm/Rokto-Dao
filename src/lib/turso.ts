import { createClient } from "@libsql/client";

/**
 * @fileOverview Turso Database Client configuration.
 */

const url = process.env.TURSO_URL || "libsql://rokto-rokto.aws-ap-northeast-1.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken: authToken || "",
});

// Cache the initialization promise to avoid race conditions
let initPromise: Promise<void> | null = null;

/**
 * Initializes the database tables if they don't exist.
 * Uses a batch operation to ensure atomic creation of schema.
 */
export async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await db.batch([
        // 1. Donors Table (Updated with slug)
        `CREATE TABLE IF NOT EXISTS donors (
          email TEXT,
          fullName TEXT,
          phone TEXT PRIMARY KEY,
          bloodType TEXT,
          registrationDate TEXT,
          district TEXT,
          area TEXT,
          "union" TEXT,
          organization TEXT,
          status TEXT DEFAULT 'Available',
          totalDonations INTEGER DEFAULT 0,
          lastDonationDate TEXT,
          password TEXT,
          role TEXT DEFAULT 'user',
          imageUrl TEXT,
          lat REAL,
          lng REAL,
          slug TEXT UNIQUE
        )`,
        // 2. Blood Requests Table
        `CREATE TABLE IF NOT EXISTS requests (
          id TEXT PRIMARY KEY,
          patientName TEXT,
          bloodType TEXT,
          hospitalName TEXT,
          district TEXT,
          area TEXT,
          "union" TEXT,
          phone TEXT,
          neededWhen TEXT,
          bagsNeeded TEXT,
          isUrgent TEXT,
          status TEXT DEFAULT 'Approved',
          createdAt TEXT,
          disease TEXT,
          diseaseInfo TEXT,
          createdBy TEXT
        )`,
        // 3. Team Members Table (Updated with slug)
        `CREATE TABLE IF NOT EXISTS team (
          id TEXT PRIMARY KEY,
          name TEXT,
          role TEXT,
          bio TEXT,
          imageurl TEXT,
          twitter TEXT,
          linkedin TEXT,
          email TEXT,
          slug TEXT UNIQUE
        )`,
        // 4. Gallery Table
        `CREATE TABLE IF NOT EXISTS gallery (
          id TEXT PRIMARY KEY,
          imageurl TEXT,
          title TEXT,
          category TEXT,
          createdat TEXT
        )`,
        // 5. Blogs Table
        `CREATE TABLE IF NOT EXISTS blogs (
          id TEXT PRIMARY KEY,
          title TEXT,
          slug TEXT,
          excerpt TEXT,
          content TEXT,
          category TEXT,
          author TEXT,
          imageurl TEXT,
          createdat TEXT
        )`,
        // 6. Activity Logs Table
        `CREATE TABLE IF NOT EXISTS logs (
          timestamp TEXT,
          username TEXT,
          phone TEXT,
          action TEXT,
          details TEXT
        )`,
        // 7. Conversations Table
        `CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          p1 TEXT,
          p2 TEXT,
          lastMessage TEXT,
          updatedAt TEXT
        )`,
        // 8. Messages Table
        `CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          convoId TEXT,
          sender TEXT,
          receiver TEXT,
          content TEXT,
          timestamp TEXT,
          isRead INTEGER DEFAULT 0
        )`,
        // 9. Blood Drives Table
        `CREATE TABLE IF NOT EXISTS drives (
          id TEXT PRIMARY KEY,
          name TEXT,
          location TEXT,
          date TEXT,
          time TEXT,
          distance TEXT
        )`,
        // 10. Appointments Table
        `CREATE TABLE IF NOT EXISTS appointments (
          id TEXT PRIMARY KEY,
          driveId TEXT,
          driveName TEXT,
          userEmail TEXT,
          userName TEXT,
          date TEXT,
          time TEXT,
          status TEXT
        )`,
        // 11. Reports Table
        `CREATE TABLE IF NOT EXISTS reports (
          id TEXT PRIMARY KEY,
          type TEXT, -- 'Donor' or 'Request'
          targetId TEXT,
          targetName TEXT,
          reporterPhone TEXT,
          reason TEXT,
          details TEXT,
          timestamp TEXT,
          status TEXT DEFAULT 'Pending'
        )`
      ], "write");
      
      console.log("Database tables initialized successfully.");
    } catch (error) {
      initPromise = null; // Reset to allow retry on next call
      console.error("Database initialization failed:", error);
      throw error;
    }
  })();

  return initPromise;
}
