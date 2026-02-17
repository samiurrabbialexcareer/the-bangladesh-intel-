/*
  CYBER-NOIR BACKEND SCRIPT (UPDATED)
  To ensure headers are created, replace your setup() function with this one, or just run it.
*/

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const doc = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = doc.getSheetByName('News');

        // Auto-create sheet if missing during POST (fallback)
        if (!sheet) {
            sheet = doc.insertSheet('News');
            sheet.appendRow(['id', 'timestamp', 'title', 'tagline', 'description', 'image', 'category', 'isFeatured', 'isHeading']);
        }

        const data = JSON.parse(e.postData.contents);

        // Generate unique ID
        const id = Utilities.getUuid();
        const timestamp = new Date().toISOString();

        // Append the row
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
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ data: [] })).setMimeType(ContentService.MimeType.JSON);

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

// ROBUST SETUP FUNCTION
function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('News');
    if (!sheet) {
        sheet = ss.insertSheet('News');
    }

    // If sheet is empty or has no rows, add headers
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(['id', 'timestamp', 'title', 'tagline', 'description', 'image', 'category', 'isFeatured', 'isHeading']);
    }
}
