'use server';

import { createClient } from "@libsql/client";

const url = "libsql://rokto-rokto.aws-ap-northeast-1.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

/**
 * Initializes the database tables if they don't exist.
 */
export async function initDb() {
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
      status TEXT DEFAULT 'Pending',
      createdAt TEXT,
      disease TEXT,
      diseaseInfo TEXT,
      createdBy TEXT
    )
  `);

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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      imageurl TEXT,
      title TEXT,
      category TEXT,
      createdat TEXT
    )
  `);

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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS logs (
      timestamp TEXT,
      username TEXT,
      phone TEXT,
      action TEXT,
      details TEXT
    )
  `);
}
