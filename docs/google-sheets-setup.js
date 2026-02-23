
/**
 * RoktoDao - Google Sheets Backend Setup Script
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Prepare the sheets:
 *    - Rename 'Sheet1' to 'Donors'. Headers: Email, Full Name, Phone, Blood Type, Registration Date, District, Area, Last Donation Date, Total Donations.
 *    - Create sheet 'Appointments'. Headers: ID, Drive ID, Drive Name, User Email, User Name, Date, Time, Status.
 *    - Create sheet 'BloodDrives'. Headers: ID, Name, Location, Date, Time, Distance.
 *    - Create sheet 'Requests'. Headers: ID, Patient Name, Blood Type, Hospital Name, District, Area, Phone, Needed When, Bags Needed, Is Urgent, Status, Created At.
 * 3. Open 'Extensions' > 'Apps Script'.
 * 4. Paste this script, click 'Deploy' > 'New Deployment' (Web App, Anyone access).
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();
const DONORS_SHEET = SS.getSheetByName('Donors');
const APPOINTMENTS_SHEET = SS.getSheetByName('Appointments');
const DRIVES_SHEET = SS.getSheetByName('BloodDrives');
const REQUESTS_SHEET = SS.getSheetByName('Requests');

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getDrives') return getBloodDrives();
  if (action === 'getDonors') return getDonors();
  if (action === 'getRequests') return getBloodRequests();
  if (action === 'getHistory') return getDonationHistory(e.parameter.email);
  
  return jsonResponse({ error: 'Invalid action' });
}

function doPost(e) {
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

function getBloodDrives() { return getSheetData(DRIVES_SHEET); }
function getDonors() { return getSheetData(DONORS_SHEET); }
function getBloodRequests() { return getSheetData(REQUESTS_SHEET); }

function getDonationHistory(email) {
  const data = getSheetData(APPOINTMENTS_SHEET);
  return jsonResponse(data.filter(item => item.useremail === email));
}

function registerDonor(data) {
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
  DONORS_SHEET.appendRow(row);
  return jsonResponse({ success: true });
}

function scheduleAppointment(data) {
  const id = Math.random().toString(36).substring(7);
  const row = [id, data.driveId, data.driveName, data.userEmail, data.userName, data.date, data.time, 'Scheduled'];
  APPOINTMENTS_SHEET.appendRow(row);
  return jsonResponse({ success: true, id: id });
}

function createBloodRequest(data) {
  const id = Math.random().toString(36).substring(7);
  const row = [
    id, data.patientName, data.bloodType, data.hospitalName, data.district, data.area, 
    data.phone, data.neededWhen, data.bagsNeeded, data.isUrgent ? 'Yes' : 'No', 'Approved', 
    new Date().toISOString()
  ];
  REQUESTS_SHEET.appendRow(row);
  return jsonResponse({ success: true, id: id });
}

function getSheetData(sheet) {
  if (!sheet) return jsonResponse({ error: 'Sheet not found' });
  const data = sheet.getDataRange().getValues();
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
