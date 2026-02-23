/**
 * Lifeline Hub - Google Sheets Backend Setup Script
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Prepare the sheets:
 *    - Rename 'Sheet1' to 'Donors'. Add headers: Email, Full Name, Phone, Blood Type, Registration Date.
 *    - Create a new sheet 'Appointments'. Add headers: ID, Drive ID, Drive Name, User Email, User Name, Date, Time, Status.
 *    - Create a new sheet 'BloodDrives'. Add headers: ID, Name, Location, Date, Time, Distance.
 * 3. Open 'Extensions' > 'Apps Script'.
 * 4. Delete any existing code and paste this script.
 * 5. Click 'Deploy' > 'New Deployment'.
 * 6. Select type 'Web App'.
 * 7. Set 'Execute as' to 'Me'.
 * 8. Set 'Who has access' to 'Anyone'.
 * 9. Click 'Deploy' and copy the 'Web App URL'.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();
const DONORS_SHEET = SS.getSheetByName('Donors');
const APPOINTMENTS_SHEET = SS.getSheetByName('Appointments');
const DRIVES_SHEET = SS.getSheetByName('BloodDrives');

/**
 * Handles GET requests (Read operations)
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getDrives') {
    return getBloodDrives();
  }
  
  if (action === 'getHistory') {
    const email = e.parameter.email;
    return getDonationHistory(email);
  }
  
  return jsonResponse({ error: 'Invalid action' });
}

/**
 * Handles POST requests (Write operations)
 */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON payload' });
  }

  const action = data.action;
  
  if (action === 'register') {
    return registerDonor(data);
  }
  
  if (action === 'book') {
    return scheduleAppointment(data);
  }
  
  return jsonResponse({ error: 'Invalid action' });
}

function getBloodDrives() {
  const data = DRIVES_SHEET.getDataRange().getValues();
  const headers = data.shift();
  const drives = data.map(row => {
    let drive = {};
    headers.forEach((header, i) => {
      // Convert "Drive ID" to "driveid" etc.
      const key = header.toLowerCase().replace(/\s/g, '');
      drive[key] = row[i];
    });
    return drive;
  });
  return jsonResponse(drives);
}

function getDonationHistory(email) {
  const data = APPOINTMENTS_SHEET.getDataRange().getValues();
  const headers = data.shift();
  const history = data
    .filter(row => row[3] === email) // User Email column index 3
    .map(row => {
      let appt = {};
      headers.forEach((header, i) => {
        const key = header.toLowerCase().replace(/\s/g, '');
        appt[key] = row[i];
      });
      return appt;
    });
  return jsonResponse(history);
}

function registerDonor(data) {
  const row = [
    data.email,
    data.fullName,
    data.phone,
    data.bloodType,
    new Date().toISOString()
  ];
  DONORS_SHEET.appendRow(row);
  return jsonResponse({ success: true });
}

function scheduleAppointment(data) {
  const id = Math.random().toString(36).substring(7);
  const row = [
    id,
    data.driveId,
    data.driveName,
    data.userEmail,
    data.userName,
    data.date,
    data.time,
    'Scheduled'
  ];
  APPOINTMENTS_SHEET.appendRow(row);
  return jsonResponse({ success: true, id: id });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
