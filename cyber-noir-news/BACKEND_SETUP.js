/*
  Google Apps Script Backend for Cyber-Noir News Portal
  
  1. Create a new Google Sheet.
  2. Go to Extensions > Apps Script.
  3. Paste this code.
  4. Run 'setup()' once to create headers.
  5. Deploy as Web App -> Execute as: Me -> Who has access: Anyone.
  6. Copy the Current web app URL and use it as VITE_GOOGLE_SHEET_URL.
*/

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('News');
        const data = JSON.parse(e.postData.contents);

        // Auto-generate ID and Timestamp
        const id = Utilities.getUuid();
        const timestamp = new Date().toISOString();

        // Append Row: [ID, Timestamp, Title, Tagline, Description, Image, Category, IsFeatured, IsHeading]
        sheet.appendRow([
            id,
            timestamp,
            data.title,
            data.tagline,
            data.description,
            data.image,
            data.category,
            data.isFeatured || false,
            data.isHeading || false
        ]);

        return ContentService.createTextOutput(JSON.stringify({ result: 'success', id: id }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function doGet(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('News');
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, i) => obj[header] = row[i]);
        return obj;
    });

    return ContentService.createTextOutput(JSON.stringify({ data: data }))
        .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('News');
    if (!sheet) {
        sheet = ss.insertSheet('News');
        sheet.appendRow(['id', 'timestamp', 'title', 'tagline', 'description', 'image', 'category', 'isFeatured', 'isHeading']);
    }
}
