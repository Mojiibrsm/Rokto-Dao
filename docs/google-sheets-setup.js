/**
 * RoktoDao - Google Sheets Backend Setup Script (Auto-Setup Version)
 * 
 * INSTRUCTIONS:
 * 1. Create a NEW BLANK Google Sheet.
 * 2. Go to 'Extensions' > 'Apps Script'.
 * 3. Delete any code there and paste THIS script.
 * 4. Click the 'Save' icon (Project Name: RoktoDao Backend).
 * 5. Click 'Deploy' > 'New Deployment'.
 *    - Select type: 'Web App'
 *    - Description: 'RoktoDao API'
 *    - Execute as: 'Me'
 *    - Who has access: 'Anyone'
 * 6. Click 'Deploy' and authorize permissions.
 * 7. Copy the 'Web App URL' and add it to your .env file as NEXT_PUBLIC_SHEETS_URL.
 * 
 * NOTE: The script will automatically create 'Donors', 'Appointments', 'BloodDrives', and 'Requests' tabs with correct headers on the first request.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

// Sheet Names and their required Headers
const SCHEMA = {
  'Donors': ['Email', 'Full Name', 'Phone', 'Blood Type', 'Registration Date', 'District', 'Area', 'Last Donation Date', 'Total Donations'],
  'Appointments': ['ID', 'Drive ID', 'Drive Name', 'User Email', 'User Name', 'Date', 'Time', 'Status'],
  'BloodDrives': ['ID', 'Name', 'Location', 'Date', 'Time', 'Distance'],
  'Requests': ['ID', 'Patient Name', 'Blood Type', 'Hospital Name', 'District', 'Area', 'Phone', 'Needed When', 'Bags Needed', 'Is Urgent', 'Status', 'Created At']
};

/**
 * Ensures all required sheets exist and have the correct headers.
 */
function initSheets() {
  Object.keys(SCHEMA).forEach(name => {
    let sheet = SS.getSheetByName(name);
    if (!sheet) {
      sheet = SS.insertSheet(name);
      sheet.appendRow(SCHEMA[name]);
      // Format header row (Bold)
      sheet.getRange(1, 1, 1, SCHEMA[name].length).setFontWeight('bold');
    }
  });
}

function doGet(e) {
  initSheets(); // Auto-create tabs if missing
  const action = e.parameter.action;
  
  if (action === 'getDrives') return getBloodDrives();
  if (action === 'getDonors') return getDonors();
  if (action === 'getRequests') return getBloodRequests();
  if (action === 'getHistory') return getDonationHistory(e.parameter.email);
  
  return jsonResponse({ error: 'Invalid action' });
}

function doPost(e) {
  initSheets(); // Auto-create tabs if missing
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON payload' });
  }

  const action = data.action;
  if (action === 'register') return registerDonor(data);
  if (action === 'book') return scheduleAppointment(data);
  if (action === 'createRequest') return createBloodRequest(data);
  
  return jsonResponse({ error: 'Invalid action' });
}

// Data Fetching Functions
function getBloodDrives() { return getSheetData(SS.getSheetByName('BloodDrives')); }
function getDonors() { return getSheetData(SS.getSheetByName('Donors')); }
function getBloodRequests() { return getSheetData(SS.getSheetByName('Requests')); }

function getDonationHistory(email) {
  const data = getSheetData(SS.getSheetByName('Appointments'));
  if (data.error) return jsonResponse(data);
  return jsonResponse(data.filter(item => item.useremail === email));
}

// Data Writing Functions
function registerDonor(data) {
  const sheet = SS.getSheetByName('Donors');
  const row = [
    data.email,
    data.fullName,
    data.phone,
    data.bloodType,
    new Date().toISOString(),
    data.district || '',
    data.area || '',
    'N/A',
    0
  ];
  sheet.appendRow(row);
  return jsonResponse({ success: true });
}

function scheduleAppointment(data) {
  const sheet = SS.getSheetByName('Appointments');
  const id = Math.random().toString(36).substring(7);
  const row = [id, data.driveId, data.driveName, data.userEmail, data.userName, data.date, data.time, 'Scheduled'];
  sheet.appendRow(row);
  return jsonResponse({ success: true, id: id });
}

function createBloodRequest(data) {
  const sheet = SS.getSheetByName('Requests');
  const id = Math.random().toString(36).substring(7);
  const row = [
    id, data.patientName, data.bloodType, data.hospitalName, data.district, data.area, 
    data.phone, data.neededWhen, data.bagsNeeded, data.isUrgent ? 'Yes' : 'No', 'Approved', 
    new Date().toISOString()
  ];
  sheet.appendRow(row);
  return jsonResponse({ success: true, id: id });
}

// Utilities
function getSheetData(sheet) {
  if (!sheet) return { error: 'Sheet not found' };
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only header exists
  
  const headers = data.shift();
  const result = data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      const key = header.toLowerCase().replace(/\s/g, '');
      obj[key] = row[i];
    });
    return obj;
  });
  return jsonResponse(result);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
