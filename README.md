# Lifeline Hub - Setup Guide

Lifeline Hub is a blood donation management prototype built with Next.js and integrated with Google Sheets as a lightweight backend.

## 🚀 Quick Setup: Google Sheets Backend

Follow these steps to move from mock data to a real database using Google Sheets.

### 1. Create the Google Sheet
1. Go to [sheets.new](https://sheets.new) to create a new spreadsheet.
2. **Rename the tabs** at the bottom exactly as follows:
   - **Donors**: Add headers in row 1: `Email`, `Full Name`, `Phone`, `Blood Type`, `Registration Date`.
   - **Appointments**: Add headers in row 1: `ID`, `Drive ID`, `Drive Name`, `User Email`, `User Name`, `Date`, `Time`, `Status`.
   - **BloodDrives**: Add headers in row 1: `ID`, `Name`, `Location`, `Date`, `Time`, `Distance`.
3. **Add Sample Data**: Fill in a few rows in the `BloodDrives` sheet so you have something to see in the app.

### 2. Deploy the Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the editor and paste the content from `docs/google-sheets-setup.js` found in this project.
3. Click the **Save** icon and name the project "Lifeline Backend".
4. Click **Deploy** > **New Deployment**.
5. Select **Type**: "Web App".
6. **Description**: "Lifeline Hub API".
7. **Execute as**: "Me".
8. **Who has access**: "Anyone".
9. Click **Deploy**.
10. **IMPORTANT**: Copy the "Web App URL" (it ends in `/exec`).

### 3. Connect to your App
1. In this project, open or create a `.env` file.
2. Add your URL: `NEXT_PUBLIC_SHEETS_URL=your_copied_url_here`
3. The `src/lib/sheets.ts` file is currently configured to use mock data. To switch to the real sheet, you would update the fetch calls in that file to point to your new URL.

## Features
- **Donor Registration**: Join the community.
- **Drive Finder**: Locate nearby donation events.
- **Eligibility Check**: AI-powered preliminary screening.
- **Impact Tracking**: See your donation history and lives saved.
