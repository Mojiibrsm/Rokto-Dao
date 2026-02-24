/**
 * RoktoDao - Google Sheets Backend Setup Script (Professional Admin Version)
 * 
 * INSTRUCTIONS:
 * 1. Go to your existing Apps Script editor.
 * 2. Replace the old code with THIS new version.
 * 3. Click 'Save' and 'Deploy' > 'Manage Deployments'.
 * 4. Edit the current deployment and select 'New Version'.
 * 5. Click 'Deploy'.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

const SCHEMA = {
  'Donors': ['Email', 'Full Name', 'Phone', 'Blood Type', 'Registration Date', 'District', 'Area', 'Union', 'Organization', 'Last Donation Date', 'Total Donations'],
  'Appointments': ['ID', 'Drive ID', 'Drive Name', 'User Email', 'User Name', 'Date', 'Time', 'Status'],
  'BloodDrives': ['ID', 'Name', 'Location', 'Date', 'Time', 'Distance'],
  'Requests': ['ID', 'Patient Name', 'Blood Type', 'Hospital Name', 'District', 'Area', 'Union', 'Phone', 'Needed When', 'Bags Needed', 'Is Urgent', 'Status', 'Created At'],
  'Locations': ['District', 'Upazila', 'Union']
};

function initSheets() {
  Object.keys(SCHEMA).forEach(name => {
    let sheet = SS.getSheetByName(name);
    if (!sheet) {
      sheet = SS.insertSheet(name);
      sheet.appendRow(SCHEMA[name]);
      sheet.getRange(1, 1, 1, SCHEMA[name].length).setFontWeight('bold').setBackground('#fce4ec');
    } else {
      // Update headers if missing Organization
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      if (!headers.includes('Organization')) {
        sheet.insertColumnBefore(9);
        sheet.getRange(1, 9).setValue('Organization').setFontWeight('bold').setBackground('#fce4ec');
      }
    }
  });
}

function doGet(e) {
  initSheets();
  const action = e.parameter.action;
  
  if (action === 'getDrives') return getBloodDrives();
  if (action === 'getDonors') return getDonors();
  if (action === 'getRequests') return getBloodRequests();
  if (action === 'getHistory') return getDonationHistory(e.parameter.email);
  if (action === 'getStats') return getGlobalStats();
  if (action === 'getLocations') return getLocations();
  
  return jsonResponse({ error: 'Invalid action' });
}

function doPost(e) {
  initSheets();
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON payload' });
  }

  const action = data.action;
  if (action === 'register') return registerDonor(data);
  if (action === 'bulkRegister') return bulkRegisterDonors(data);
  if (action === 'book') return scheduleAppointment(data);
  if (action === 'createRequest') return createBloodRequest(data);
  if (action === 'updateStatus') return updateEntryStatus(data);
  if (action === 'deleteEntry') return deleteEntry(data);
  if (action === 'seedLocations') return seedLocations(data.rows);
  if (action === 'createDrive') return createDrive(data);
  
  return jsonResponse({ error: 'Invalid action' });
}

function getGlobalStats() {
  const donors = SS.getSheetByName('Donors').getLastRow() - 1;
  const requests = SS.getSheetByName('Requests').getLastRow() - 1;
  const appointments = SS.getSheetByName('Appointments').getLastRow() - 1;
  return jsonResponse({
    totalDonors: Math.max(0, donors),
    totalRequests: Math.max(0, requests),
    totalAppointments: Math.max(0, appointments)
  });
}

function getSheetData(sheet) {
  if (!sheet) return { error: 'Sheet not found' };
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      const key = header.toLowerCase().replace(/\s/g, '');
      obj[key] = row[i];
    });
    return obj;
  });
}

function registerDonor(data) {
  const sheet = SS.getSheetByName('Donors');
  sheet.appendRow([
    data.email || '', 
    data.fullName || '', 
    data.phone || '', 
    data.bloodType || '', 
    new Date().toISOString(), 
    data.district || '', 
    data.area || '', 
    data.union || '', 
    data.organization || '',
    'N/A', 
    0
  ]);
  return jsonResponse({ success: true });
}

function bulkRegisterDonors(data) {
  const sheet = SS.getSheetByName('Donors');
  if (!data.donors || !Array.isArray(data.donors)) return jsonResponse({ error: 'No data provided' });
  
  const now = new Date().toISOString();
  const rows = data.donors.map(d => [
    d.email || '', 
    d.fullName || '', 
    d.phone || '', 
    d.bloodType || '', 
    now, 
    d.district || '', 
    d.area || '', 
    d.union || '', 
    d.organization || '',
    'N/A', 
    0
  ]);
  
  if (rows.length > 0) {
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, 11).setValues(rows);
  }
  
  return jsonResponse({ success: true, count: rows.length });
}

function createBloodRequest(data) {
  const sheet = SS.getSheetByName('Requests');
  const id = Math.random().toString(36).substring(7);
  sheet.appendRow([id, data.patientName, data.bloodType, data.hospitalName, data.district, data.area, data.union || '', data.phone, data.neededWhen, data.bagsNeeded, data.isUrgent ? 'Yes' : 'No', 'Pending', new Date().toISOString()]);
  return jsonResponse({ success: true, id: id });
}

function createDrive(data) {
  const sheet = SS.getSheetByName('BloodDrives');
  sheet.appendRow([data.id, data.name, data.location, data.date, data.time, data.distance]);
  return jsonResponse({ success: true });
}

function seedLocations(rows) {
  const sheet = SS.getSheetByName('Locations');
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, SCHEMA.Locations.length).clearContent();
  }
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
  return jsonResponse({ success: true, count: rows.length });
}

function getLocations() { return jsonResponse(getSheetData(SS.getSheetByName('Locations'))); }

function updateEntryStatus(data) {
  const sheet = SS.getSheetByName(data.sheetName);
  const rows = sheet.getDataRange().getValues();
  const idCol = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idCol].toString() === data.id.toString()) {
      const statusCol = SCHEMA[data.sheetName].indexOf('Status') + 1;
      sheet.getRange(i + 1, statusCol).setValue(data.newStatus);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Entry not found' });
}

function deleteEntry(data) {
  const sheet = SS.getSheetByName(data.sheetName);
  const rows = sheet.getDataRange().getValues();
  const idCol = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idCol].toString() === data.id.toString()) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Entry not found' });
}

function getBloodDrives() { return jsonResponse(getSheetData(SS.getSheetByName('BloodDrives'))); }
function getDonors() { return jsonResponse(getSheetData(SS.getSheetByName('Donors'))); }
function getBloodRequests() { return jsonResponse(getSheetData(SS.getSheetByName('Requests'))); }
function getDonationHistory(email) {
  const data = getSheetData(SS.getSheetByName('Appointments'));
  return jsonResponse(data.filter(item => item.useremail === email));
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}