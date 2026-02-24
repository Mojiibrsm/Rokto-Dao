/**
 * RoktoDao - Google Sheets Backend Setup Script (Updated with Disease Info)
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

const SCHEMA = {
  'Donors': ['Email', 'Full Name', 'Phone', 'Blood Type', 'Registration Date', 'District', 'Area', 'Union', 'Organization', 'Last Donation Date', 'Total Donations'],
  'Appointments': ['ID', 'Drive ID', 'Drive Name', 'User Email', 'User Name', 'Date', 'Time', 'Status'],
  'BloodDrives': ['ID', 'Name', 'Location', 'Date', 'Time', 'Distance'],
  'Requests': ['ID', 'Patient Name', 'Blood Type', 'Hospital Name', 'District', 'Area', 'Union', 'Phone', 'Needed When', 'Bags Needed', 'Is Urgent', 'Status', 'Created At', 'Disease', 'Disease Info'],
  'Locations': ['District', 'Upazila', 'Union'],
  'Config': ['Key', 'Value']
};

function initSheets() {
  Object.keys(SCHEMA).forEach(name => {
    let sheet = SS.getSheetByName(name);
    if (!sheet) {
      sheet = SS.insertSheet(name);
      sheet.appendRow(SCHEMA[name]);
      sheet.getRange(1, 1, 1, SCHEMA[name].length).setFontWeight('bold').setBackground('#fce4ec');
      
      if (name === 'Config') {
        sheet.appendRow(['admin_password', 'admin123']);
      }
    } else {
      const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const targetHeaders = SCHEMA[name];
      if (existingHeaders.length < targetHeaders.length) {
        sheet.getRange(1, 1, 1, targetHeaders.length).setValues([targetHeaders]);
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
  if (action === 'getStats') return getGlobalStats();
  if (action === 'getAdminPass') return getAdminPassword();
  if (action === 'getAppointments') return getAppointments(e.parameter.email);
  
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
  let result;

  if (action === 'register') result = registerDonor(data);
  else if (action === 'updateProfile') result = updateDonorProfile(data);
  else if (action === 'bulkRegister') result = bulkRegisterDonors(data);
  else if (action === 'createRequest') result = createBloodRequest(data);
  else if (action === 'updateStatus') result = updateEntryStatus(data);
  else if (action === 'deleteEntry') result = deleteEntry(data);
  else if (action === 'seedLocations') result = seedLocations(data.rows);
  else if (action === 'createDrive') result = createDrive(data);
  else if (action === 'scheduleAppointment') result = scheduleAppointment(data);
  else return jsonResponse({ error: 'Invalid action' });

  PropertiesService.getScriptProperties().setProperty('LAST_UPDATE', new Date().getTime().toString());
  return result;
}

function createBloodRequest(data) {
  const sheet = SS.getSheetByName('Requests');
  const id = Math.random().toString(36).substring(7);
  sheet.appendRow([
    id, 
    data.patientName, 
    data.bloodType, 
    data.hospitalName, 
    data.district, 
    data.area || '', 
    data.union || '', 
    data.phone, 
    data.neededWhen, 
    data.bagsNeeded, 
    data.isUrgent ? 'Yes' : 'No', 
    'Pending', 
    new Date().toISOString(),
    data.disease || '',
    data.diseaseInfo || ''
  ]);
  return jsonResponse({ success: true, id: id });
}

function getAdminPassword() {
  const sheet = SS.getSheetByName('Config');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'admin_password') return jsonResponse({ password: data[i][1] });
  }
  return jsonResponse({ password: 'admin123' });
}

function getGlobalStats() {
  const donors = SS.getSheetByName('Donors').getLastRow() - 1;
  const requests = SS.getSheetByName('Requests').getLastRow() - 1;
  const lastUpdate = PropertiesService.getScriptProperties().getProperty('LAST_UPDATE') || '0';
  return jsonResponse({ totalDonors: Math.max(0, donors), totalRequests: Math.max(0, requests), lastUpdate: lastUpdate });
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      const key = header.toString().toLowerCase().replace(/\s/g, '');
      obj[key] = row[i];
    });
    return obj;
  });
}

function registerDonor(data) {
  const sheet = SS.getSheetByName('Donors');
  sheet.appendRow([data.email, data.fullName, data.phone, data.bloodType, new Date().toISOString(), data.district, data.area, data.union, data.organization, 'N/A', data.totalDonations || 0]);
  return jsonResponse({ success: true });
}

function updateDonorProfile(data) {
  const sheet = SS.getSheetByName('Donors');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const emailCol = headers.indexOf('Email');
  const phoneCol = headers.indexOf('Phone');
  const searchKey = data.originalKey; 
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][emailCol].toString().toLowerCase() === searchKey.toLowerCase() || rows[i][phoneCol].toString() === searchKey.toString()) {
      const rowNum = i + 1;
      if (data.fullName) sheet.getRange(rowNum, headers.indexOf('Full Name') + 1).setValue(data.fullName);
      if (data.phone) sheet.getRange(rowNum, headers.indexOf('Phone') + 1).setValue(data.phone);
      if (data.email) sheet.getRange(rowNum, headers.indexOf('Email') + 1).setValue(data.email);
      if (data.district) sheet.getRange(rowNum, headers.indexOf('District') + 1).setValue(data.district);
      if (data.area) sheet.getRange(rowNum, headers.indexOf('Area') + 1).setValue(data.area);
      if (data.organization) sheet.getRange(rowNum, headers.indexOf('Organization') + 1).setValue(data.organization);
      if (data.totalDonations !== undefined) sheet.getRange(rowNum, headers.indexOf('Total Donations') + 1).setValue(data.totalDonations);
      if (data.lastDonationDate) sheet.getRange(rowNum, headers.indexOf('Last Donation Date') + 1).setValue(data.lastDonationDate);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Donor not found' });
}

function deleteEntry(data) {
  const sheet = SS.getSheetByName(data.sheetName);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.id.toString()) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Entry not found' });
}

function getDonors() { return jsonResponse(getSheetData(SS.getSheetByName('Donors'))); }
function getBloodRequests() { return jsonResponse(getSheetData(SS.getSheetByName('Requests'))); }
function getBloodDrives() { return jsonResponse(getSheetData(SS.getSheetByName('BloodDrives'))); }

function getAppointments(email) {
  const sheet = SS.getSheetByName('Appointments');
  const data = getSheetData(sheet);
  if (!email) return jsonResponse(data);
  const filtered = data.filter(row => row.useremail.toString().toLowerCase() === email.toLowerCase());
  return jsonResponse(filtered);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}