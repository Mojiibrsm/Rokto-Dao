# Lifeline Hub - Setup Guide

Lifeline Hub is a blood donation management prototype built with Next.js and integrated with Google Sheets as a lightweight backend.

## 🚀 Quick Setup: Google Sheets Backend

### 1. Create the Google Sheet
1. Go to [sheets.new](https://sheets.new).
2. Rename tabs: **Donors**, **Appointments**, **BloodDrives**.
3. Add headers in row 1 for each:
   - **Donors**: `Email`, `Full Name`, `Phone`, `Blood Type`, `Registration Date`.
   - **Appointments**: `ID`, `Drive ID`, `Drive Name`, `User Email`, `User Name`, `Date`, `Time`, `Status`.
   - **BloodDrives**: `ID`, `Name`, `Location`, `Date`, `Time`, `Distance`.
4. **Important**: Add one or two rows of data in the `BloodDrives` tab so you can test it.

### 2. Deploy Apps Script
1. Go to **Extensions** > **Apps Script**.
2. Paste the code from `docs/google-sheets-setup.js`.
3. Click **Deploy** > **New Deployment** > **Web App**.
4. Set **Who has access** to **Anyone**.
5. Copy the **Web App URL**.

### 3. Connect to App
1. Create a `.env` file in the root.
2. Add: `NEXT_PUBLIC_SHEETS_URL=your_copied_url_here`

## ✅ How to Verify Connection
1. **Check the Drives Page**: Go to `/drives` in the app.
2. **Look at the Data**: 
   - If you see names ending in **"(Mock)"**, it is still using local test data.
   - If you see the **exact rows** you typed into your Google Sheet, it is successfully connected!
3. **Check Console**: Open browser inspect (F12) -> Network tab. Look for requests to `script.google.com`. If they return `200 OK`, you are connected.

## Features
- **Donor Registration**: Join the community.
- **Drive Finder**: Locate nearby donation events.
- **Eligibility Check**: AI-powered preliminary screening.
- **Impact Tracking**: See your donation history and lives saved.
