'use server';

import { createClient } from "@libsql/client";

/**
 * @fileOverview Turso Database Client configuration.
 * Uses environment variables for security and flexibility.
 */

const url = process.env.TURSO_URL || "libsql://rokto-rokto.aws-ap-northeast-1.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!authToken && process.env.NODE_ENV === 'production') {
  console.warn("Warning: TURSO_AUTH_TOKEN is not defined in environment variables.");
}

export const db = createClient({
  url,
  authToken,
});

/**
 * Initializes the database tables if they don't exist.
 * This is called before every major database operation to ensure schema integrity.
 */
export async function initDb() {
  try {
    // 1. Donors Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS donors (
        email TEXT,
        fullName TEXT,
        phone TEXT PRIMARY KEY,
        bloodType TEXT,
        registrationDate TEXT,
        district TEXT,
        area TEXT,
        union TEXT,
        organization TEXT,
        status TEXT DEFAULT 'Available',
        totalDonations INTEGER DEFAULT 0,
        lastDonationDate TEXT,
        password TEXT
      )
    `);

    // 2. Blood Requests Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        patientName TEXT,
        bloodType TEXT,
        hospitalName TEXT,
        district TEXT,
        area TEXT,
        union TEXT,
        phone TEXT,
        neededWhen TEXT,
        bagsNeeded TEXT,
        isUrgent TEXT,
        status TEXT DEFAULT 'Approved',
        createdAt TEXT,
        disease TEXT,
        diseaseInfo TEXT,
        createdBy TEXT
      )
    `);

    // 3. Team Members Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS team (
        id TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        bio TEXT,
        imageurl TEXT,
        twitter TEXT,
        linkedin TEXT,
        email TEXT
      )
    `);

    // 4. Gallery Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        imageurl TEXT,
        title TEXT,
        category TEXT,
        createdat TEXT
      )
    `);

    // 5. Blogs Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        title TEXT,
        slug TEXT,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        author TEXT,
        imageurl TEXT,
        createdat TEXT
      )
    `);

    // 6. Activity Logs Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        timestamp TEXT,
        username TEXT,
        phone TEXT,
        action TEXT,
        details TEXT
      )
    `);
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}
