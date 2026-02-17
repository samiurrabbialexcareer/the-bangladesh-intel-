/*
  ⭐️ AUTOMATED SETUP SCRIPT ⭐️
  
  Instructions:
  1. Paste this code into your Google Apps Script editor (replacing everything).
  2. Select 'setup' from the dropdown menu at the top.
  3. Click 'Run'.
  4. It will automatically create the 'News' sheet and add the headers for you.
*/

function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('News');

    if (!sheet) {
        sheet = ss.insertSheet('News');
        console.log("Created 'News' sheet.");
    }

    // Check if headers exist, if not, add them
    if (sheet.getLastRow() === 0) {
        const headers = ['id', 'timestamp', 'title', 'tagline', 'description', 'image', 'category', 'isFeatured', 'isHeading'];
        sheet.appendRow(headers);

        // Style the headers to make them look nice (Optional)
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e0e0e0");
        sheet.setFrozenRows(1);

        console.log("Added headers to 'News' sheet.");
    } else {
        console.log("'News' sheet already has data. Skipping header creation.");
    }
}

// --- STANDARD API FUNCTIONS BELOW ---

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName('News');

        // Auto-fix: Create sheet if it was deleted
        if (!sheet) {
            setup(); // Call setup to recreate it
            sheet = ss.getSheetByName('News');
        }

        const data = JSON.parse(e.postData.contents);
        const id = Utilities.getUuid();

        sheet.appendRow([
            id,
            new Date().toISOString(),
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
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('News');

    // Auto-fix: Create sheet if missing on read too
    if (!sheet) {
        setup();
        return ContentService.createTextOutput(JSON.stringify({ data: [] })).setMimeType(ContentService.MimeType.JSON);
    }

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
