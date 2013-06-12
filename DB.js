//////////////////////////////////////////////////////////////SCRIPT DB SECTION//////////////////////////////////////////////////////////////////////////////

function displayTheSizeOfMyScriptDB()
{
  var db = ScriptDb.getMyDb();
  var dbSize = db.query({}).getSize();
  Browser.msgBox(dbSize)
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dumpDatabaseIntoSheet(result) {
  var db = ScriptDb.getMyDb();
  // You can change the query below to restrict what to put into
  // the Spreadsheet, or change ordering, etc.  Do note the default
  // query result size limit!
  var result = db.query({hawb: db.not(0)}).limit(45000);
  var data = [];
  var keys = {};

  // load in data and find out the object keys
  while (result.hasNext()) {
    var item = result.next();
    var itemKeys = Object.keys(item);
    for (var i = 0; i < itemKeys.length; i++) {
      if (typeof(item[itemKeys[i]]) != 'function') {
        keys[itemKeys[i]] = true;
      }
    }
    data.push(item);
  }

  var headings = Object.keys(keys);
  var values = [headings];
  // produce the values array containing the bits from the result
  // objects
  for (var rownum = 0 ; rownum < data.length; rownum++) {
    var thisRow = [];
    var item = data[rownum];
    for (var i = 0; i < headings.length; i++) {
      var field = headings[i];
      var thisValue = item[field];
      if (thisValue == undefined || typeof(thisValue) == 'function') {
        thisValue = null;
      }
      thisRow.push(thisValue);
    }
    values.push(thisRow);
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var newSheet = spreadsheet.insertSheet(); // make a new sheet
  var range = newSheet.getRange(1, 1,
      values.length, headings.length);
  range.setValues(values);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function deleteAll() {

  var answer = Browser.msgBox("DELETE DATABASE!!!!", " ARE YOU SURE YOU WANT TO DO THIS!!??", Browser.Buttons.OK_CANCEL);
  var db = ScriptDb.getMyDb();
  var result = db.query({}); // get everything, up to limit
  if (answer != "CANCEL")
  {
    // var db = ScriptDb.getMyDb();
    while (true) {
      // var result = db.query({}); // get everything, up to limit
      if (result.getSize() == 0) {
        break;
      }
      while (result.hasNext()) {
        db.remove(result.next());
        SpreadsheetApp.getActiveSpreadsheet().toast(result.toString())
       }
    }
    Browser.msgBox("everything has been deleted");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadDatabaseFromSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var columns = spreadsheet.getLastColumn();
  var data = spreadsheet.getDataRange().getValues();
  var keys = data[0];
  var db = ScriptDb.getMyDb();
  for (var row = 1; row < data.length; row++) {
    var rowData = data[row];
    var item = {};
    for (var column = 0; column < keys.length; column++) {
      item[keys[column]] = rowData[column];
    }
    db.save(item);
    SpreadsheetApp.getActiveSpreadsheet().toast("saving:" + data[row].toString());
  }
  Browser.msgBox("Database Loaded");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

