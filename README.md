# RoktoDao - Setup Guide

RoktoDao uses Google Sheets as a lightweight real-time backend. Follow these steps to connect your site.

## 🚀 Easy Setup: Google Sheets Backend

### 1. Create a Blank Sheet
1. Go to [sheets.new](https://sheets.new).
2. Give it a name (e.g., "RoktoDao Data").
3. **DO NOT** manually create any tabs or headers. The script will do it for you!

### 2. Deploy Apps Script
1. Go to **Extensions** > **Apps Script**.
2. Delete any existing code and paste the content from `docs/google-sheets-setup.js`.
3. Click the **Save** icon.
4. Click **Deploy** > **New Deployment**.
5. Select type: **Web App**.
6. Set **Description** to "RoktoDao API".
7. Set **Execute as** to "Me".
8. Set **Who has access** to **Anyone**.
9. Click **Deploy**. (You will need to authorize permissions for your Google account).
10. Copy the **Web App URL**.

### 3. Connect to App
1. Open your project's `.env` file.
2. Add your URL: `NEXT_PUBLIC_SHEETS_URL=your_copied_url_here`
3. Restart your dev server (`npm run dev`).

## ✅ How to Verify Connection
1. **Try Posting a Request**: Go to the "রক্তের অনুরোধ" (New Request) page and submit a test request.
2. **Check Your Google Sheet**: You should see a new tab named **'Requests'** automatically appear with your test data!
3. **Check Donors**: Registration and searching for donors will also automatically create the **'Donors'** tab.

## Features
- **Donor Registration**: Join the life-saving community.
- **Urgent Requests**: Post and view live blood requirements.
- **Real-time Sync**: Data updates instantly in your Google Sheet.
- **AI Eligibility**: Check if you can donate before going to the center.
