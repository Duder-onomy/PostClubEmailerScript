function preliminaryChecks()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Emails To Send");
  var headers = dataSheet.getRange(1, 1, 1, dataSheet.getLastColumn()).getValues();
  var emailColumnFound = false;
  var accountNumberColumnFound = false;
  var translateColumnFound = false;
  var agentCodeColumnFound = false;
  var trackingNumberColumnFound = false;

 for(i in headers[0])
 {
   if(headers[0][i] == "Email Address")
   {
    emailColumnFound = true;
   }
   if(headers[0][i] == "Account Number")
   {
    accountNumberColumnFound = true;
   }
   if(headers[0][i] == "Agent Code")
   {
    agentCodeColumnFound = true;
   }
   if(headers[0][i] == "Tracking Number")
   {
    trackingNumberColumnFound = true;
   }
 }

 if(!emailColumnFound)
 {
   var emailColumn = Browser.inputBox("Which Column Contains the Recipients?");
   dataSheet.getRange(emailColumn+''+1).setValue("Email Address");
 }
 if(!accountNumberColumnFound)
 {
   var accountNumberColumn = Browser.inputBox("Whih Column has the Client Account Number");
   dataSheet.getRange(accountNumberColumn+''+1).setValue("Account Number");
 }
 if(!agentCodeColumnFound)
 {
   var agentCodeColumn = Browser.inputBox("Whih Column has the Agent Code");
   dataSheet.getRange(agentCodeColumn+''+1).setValue("Agent Code");
 }
 if(!trackingNumberColumnFound)
 {
   var trackingNumberColumn = Browser.inputBox("Which Column Contains the Tracking Number?");
   dataSheet.getRange(trackingNumberColumn+''+1).setValue("Tracking Number");
 }
  Browser.msgBox("Everything Is Good To Go!");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////