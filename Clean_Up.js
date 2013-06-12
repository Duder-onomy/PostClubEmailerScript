function cleanUpSentEmails()
{
  //
  var myEmailAddress = Session.getUser().getEmail();
  //
  // Check if it is Ok to send emails to this person.
  var rightNow = new Date();
  var hourRightNow = rightNow.getHours();
  Logger.log("Initiated 'Clean Up Send Emails' for this user:" + myEmailAddress + " at " + hourRightNow);
  var theCorrectEmailAddy = ScriptProperties.getProperty("Time"+hourRightNow);
  if (theCorrectEmailAddy != myEmailAddress && myEmailAddress != "greg.larrenaga@postclubusa.com")
    {
       Logger.log("Failed, it is not time for this user to Clean Up Emails: " + myEmailAddress);
       return;
    }
  //
  // try and get a spreadsheet lock, if cannot, wait 5 minutes to try again.
  var locked = LockService.getPublicLock();
  locked.tryLock(300000);
  if (locked == false)
    {
      Logger.log("Failed to retrieve Lock, another function was running");
      return;
    }
  //
  //
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  //
  var newEmailsSheet = ss.getSheetByName("Emails To Send");
  //
  // check if it is the last minutes of the hour, if it is in the last 50, then proceed
  if (myEmailAddress != "greg.larrenaga@postclubusa.com")
    {
      if (rightNow.getMinutes() < 50)
       {
         Logger.log("Failed, Tried to Clean Up during Send Emails time window");
         return;
        }
     }
   //
   // Make sure there are actual emails to clean up
   if (!newEmailsSheet.getRange("A2").getValue())
   {
     Logger.log("Failed, There Were No Emails to clean up.");
     return;
   }
   //
   // If Evertyhing Has Checked Out, Proceed
   Logger.log("Passed all tests and begining CleanUp session");
   //
   var db = ScriptDb.getMyDb();
   var hawb = newEmailsSheet.getRange("A2");
   var dayEmailed = rightNow.getDate().toString();
   var numberOfRows = newEmailsSheet.getLastRow();
   //
   if (hawb.getValue())
    {
      for (i=0; i < numberOfRows; i++)
        {
          if (hawb.offset(0, newEmailsSheet.getLastColumn()-1).getValue() === "EMAIL_SENT" || hawb.offset(0, newEmailsSheet.getLastColumn()-1).getValue() === "EMAIL_SKIPPED")
           {
             var stored = db.save({hawb: hawb.getValue().toString(), dayEmailed: dayEmailed});
             newEmailsSheet.deleteRow(hawb.getRow());
           }
           else
           {
             hawb = hawb.offset(1, 0);
           }
         }
     }
     Logger.log("Finished Clean Up Session");
}

