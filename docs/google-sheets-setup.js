/**
 * RoktoDao - Google Sheets Backend Setup Script (Updated with Admin Password Fix)
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

const SCHEMA = {
  'Donors': ['Email', 'Full Name', 'Phone', 'Blood Type', 'Registration Date', 'District', 'Area', 'Union', 'Organization', 'Last Donation Date', 'Total Donations', 'Password'],
  'Appointments': ['ID', 'Drive ID', 'Drive Name', 'User Email', 'User Name', 'Date', 'Time', 'Status'],
  'BloodDrives': ['ID', 'Name', 'Location', 'Date', 'Time', 'Distance'],
  'Requests': ['ID', 'Patient Name', 'Blood Type', 'Hospital Name', 'District', 'Area', 'Union', 'Phone', 'Needed When', 'Bags Needed', 'Is Urgent', 'Status', 'Created At', 'Disease', 'Disease Info', 'Created By'],
  'Team': ['ID', 'Name', 'Role', 'Bio', 'Image URL', 'Twitter', 'Linkedin', 'Email'],
  'Gallery': ['ID', 'Image URL', 'Title', 'Category', 'Created At'],
  'Blogs': ['ID', 'Title', 'Slug', 'Excerpt', 'Content', 'Category', 'Author', 'Image URL', 'Created At'],
  'Locations': ['District', 'Upazila', 'Union'],
  'Config': ['Key', 'Value'],
  'Logs': ['Timestamp', 'User Name', 'Phone', 'Action', 'Details']
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
        const newHeaders = targetHeaders.slice(existingHeaders.length);
        sheet.getRange(1, existingHeaders.length + 1, 1, newHeaders.length).setValues([newHeaders]).setFontWeight('bold').setBackground('#fce4ec');
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
  if (action === 'getLogs') return getLogs();
  if (action === 'getTeam') return getTeamMembers();
  if (action === 'getGallery') return getGalleryItems();
  if (action === 'getBlogs') return getBlogPosts();
  
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
  else if (action === 'createRequest') result = createBloodRequest(data);
  else if (action === 'logActivity') result = logActivity(data);
  else if (action === 'setPassword') result = setDonorPassword(data);
  else if (action === 'bulkRegister') result = bulkRegisterDonors(data);
  else if (action === 'updateStatus') result = updateEntryStatus(data);
  else if (action === 'deleteEntry') result = deleteEntry(data);
  else if (action === 'createDrive') result = createDrive(data);
  else if (action === 'addTeamMember') result = addTeamMember(data);
  else if (action === 'updateTeamMember') result = updateTeamMember(data);
  else if (action === 'addGalleryItem') result = addGalleryItem(data);
  else if (action === 'addBlog') result = addBlog(data);
  else if (action === 'updateBlog') result = updateBlog(data);
  
  PropertiesService.getScriptProperties().setProperty('LAST_UPDATE', new Date().getTime().toString());
  return result;
}

function getAdminPassword() {
  const sheet = SS.getSheetByName('Config');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === 'admin_password') {
      return jsonResponse({ password: String(rows[i][1]).trim() });
    }
  }
  return jsonResponse({ password: 'admin123' });
}

function getGalleryItems() {
  return jsonResponse(getSheetData(SS.getSheetByName('Gallery')));
}

function addGalleryItem(data) {
  const sheet = SS.getSheetByName('Gallery');
  const id = 'G' + Math.random().toString(36).substring(7).toUpperCase();
  sheet.appendRow([id, data.imageurl, data.title || '', data.category || '', new Date().toISOString()]);
  return jsonResponse({ success: true, id: id });
}

function getBlogPosts() {
  return jsonResponse(getSheetData(SS.getSheetByName('Blogs')));
}

function addBlog(data) {
  const sheet = SS.getSheetByName('Blogs');
  const id = 'B' + Math.random().toString(36).substring(7).toUpperCase();
  sheet.appendRow([id, data.title, data.slug, data.excerpt, data.content, data.category, data.author, data.imageurl, new Date().toISOString()]);
  return jsonResponse({ success: true, id: id });
}

function updateBlog(data) {
  const sheet = SS.getSheetByName('Blogs');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idCol = headers.indexOf('ID');
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idCol].toString() === data.id.toString()) {
      const rowNum = i + 1;
      sheet.getRange(rowNum, headers.indexOf('Title') + 1).setValue(data.title);
      sheet.getRange(rowNum, headers.indexOf('Slug') + 1).setValue(data.slug);
      sheet.getRange(rowNum, headers.indexOf('Excerpt') + 1).setValue(data.excerpt);
      sheet.getRange(rowNum, headers.indexOf('Content') + 1).setValue(data.content);
      sheet.getRange(rowNum, headers.indexOf('Category') + 1).setValue(data.category);
      sheet.getRange(rowNum, headers.indexOf('Author') + 1).setValue(data.author);
      sheet.getRange(rowNum, headers.indexOf('Image URL') + 1).setValue(data.imageurl);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Blog not found' });
}

function logActivity(data) {
  const sheet = SS.getSheetByName('Logs');
  sheet.appendRow([new Date().toISOString(), data.userName || 'Unknown', data.phone || 'N/A', data.logAction || '', data.details || '']);
  return jsonResponse({ success: true });
}

function getTeamMembers() {
  const data = getSheetData(SS.getSheetByName('Team'));
  return jsonResponse(data);
}

function addTeamMember(data) {
  const sheet = SS.getSheetByName('Team');
  const id = Math.random().toString(36).substring(7);
  sheet.appendRow([id, data.name, data.role, data.bio, data.imageurl, data.twitter || '', data.linkedin || '', data.email || '']);
  return jsonResponse({ success: true, id: id });
}

function updateTeamMember(data) {
  const sheet = SS.getSheetByName('Team');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idCol = headers.indexOf('ID');
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idCol].toString() === data.id.toString()) {
      const rowNum = i + 1;
      sheet.getRange(rowNum, headers.indexOf('Name') + 1).setValue(data.name);
      sheet.getRange(rowNum, headers.indexOf('Role') + 1).setValue(data.role);
      sheet.getRange(rowNum, headers.indexOf('Bio') + 1).setValue(data.bio);
      sheet.getRange(rowNum, headers.indexOf('Image URL') + 1).setValue(data.imageurl);
      sheet.getRange(rowNum, headers.indexOf('Twitter') + 1).setValue(data.twitter || '');
      sheet.getRange(rowNum, headers.indexOf('Linkedin') + 1).setValue(data.linkedin || '');
      sheet.getRange(rowNum, headers.indexOf('Email') + 1).setValue(data.email || '');
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Member not found' });
}

function deleteEntry(data) {
  const sheet = SS.getSheetByName(data.sheetName);
  if (!sheet) return jsonResponse({ error: 'Sheet not found' });
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  
  // Identify key column based on sheet name
  let keyCol = 0;
  if (['Team', 'Gallery', 'Blogs'].includes(data.sheetName)) {
    keyCol = headers.indexOf('ID');
  } else if (data.sheetName === 'Donors') {
    keyCol = headers.indexOf('Phone');
  }
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][keyCol].toString() === data.keyValue.toString()) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ error: 'Entry not found' });
}

function getDonors() { 
  const data = getSheetData(SS.getSheetByName('Donors'));
  return jsonResponse(data); 
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
  sheet.appendRow([data.email, data.fullName, data.phone, data.bloodType, new Date().toISOString(), data.district, data.area, data.union, data.organization, 'N/A', 0, '']);
  return jsonResponse({ success: true });
}

function getBloodRequests() { return jsonResponse(getSheetData(SS.getSheetByName('Requests'))); }
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}