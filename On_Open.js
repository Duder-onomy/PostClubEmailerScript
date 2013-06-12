//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onOpen(){
 var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.addMenu("Pre Alerts", [{name: "Send Emails", functionName: "sendNewEmails"},
                            {name: "Preliminary Checks", functionName: "preliminaryChecks"},
                            {name: "Clean Up Sent", functionName: "cleanUpSentEmails"},
                            {name: "Show Remaining Quota", functionName: "displayRemainingEmails"},
                            {name: "Show me the current Hour", functionName: "showMeTheCurrentTime"}]);

  if (Session.getActiveUser().getEmail() == "greg.larrenaga@postclubusa.com")
  {
  ss.addMenu("Database", [{name: "Load Database From Sheet", functionName: "loadDatabaseFromSheet"},
                            {name: "Dump Database Into Sheet", functionName: "dumpDatabaseIntoSheet"},
                            {name: "Delete Database", functionName: "deleteAll"},
                            {name: "Display Database Size", functionName: "displayTheSizeOfMyScriptDB"},
                            {name: "Clean Database of Old Entries", functionName: "cleanDatabaseOfOldEntries"}]);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////