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
        // 1. Donors Table - Added role column
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
          role TEXT DEFAULT 'user'
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
        // 3. Team Members Table
        `CREATE TABLE IF NOT EXISTS team (
          id TEXT PRIMARY KEY,
          name TEXT,
          role TEXT,
          bio TEXT,
          imageurl TEXT,
          twitter TEXT,
          linkedin TEXT,
          email TEXT
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
        // 7. Blood Drives Table
        `CREATE TABLE IF NOT EXISTS drives (
          id TEXT PRIMARY KEY,
          name TEXT,
          location TEXT,
          date TEXT,
          time TEXT,
          distance TEXT DEFAULT '0 km'
        )`,
        // 8. Appointments Table
        `CREATE TABLE IF NOT EXISTS appointments (
          id TEXT PRIMARY KEY,
          driveId TEXT,
          driveName TEXT,
          userEmail TEXT,
          userName TEXT,
          date TEXT,
          time TEXT,
          status TEXT DEFAULT 'Scheduled'
        )`
      ], "write");
      
      // Try to add role column to existing databases if it doesn't exist
      try {
        await db.execute("ALTER TABLE donors ADD COLUMN role TEXT DEFAULT 'user'");
      } catch (e) {
        // Column might already exist
      }
      
      console.log("Database tables initialized successfully.");
    } catch (error) {
      initPromise = null; // Reset to allow retry on next call
      console.error("Database initialization failed:", error);
      throw error;
    }
  })();

  return initPromise;
}
