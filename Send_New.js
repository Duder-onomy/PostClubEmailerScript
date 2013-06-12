function sendNewEmails()
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var myEmailAddress = Session.getUser().getEmail();
 //
 //check if it is ok to send emails from this account at this time. Emails are saved in the script properties. Override if user is ME.
 var rightNow = new Date();
 var hourRightNow = rightNow.getHours();
 Logger.log("Initiated 'send new emails' for this user:" + myEmailAddress + " at " + hourRightNow);
 var theCorrectEmailAddy = ScriptProperties.getProperty("Time"+hourRightNow);
 if (theCorrectEmailAddy != myEmailAddress && myEmailAddress != "greg.larrenaga@postclubusa.com")
    {
       Logger.log("Failed, it is not time for this user to send emails: " + myEmailAddress);
       return;
    }
 //
 // check if there are anymore emails this user can send today, returns true if you have any left in quota
 var emailQuota = MailApp.getRemainingDailyQuota();
 if (emailQuota == 0)
    {
       Logger.log("Failed, Maxed out daily email quota for user: " + myEmailAddress);
       return;
    }
 //
 //  check if there are actually any emails to send, returns true if there are no emails to send (A2 gives null value)
 if (!ss.getSheetByName("Emails To Send").getRange("A2").getValue())
    {
      Logger.log("Failed, There were no emails to send.");
      return;
    }
 //
 // check if it is the first 50 minutes of the hour, if it is in the last 50, then exit
 if (rightNow.getMinutes() > 50)
   {
     Logger.log("Failed, Tried to Send Emails during CleanUP time window");
     return;
   }
 //
 //  try and lock the spreadsheet, if it cannot lock, then wait 5 minutes.
 var locked = LockService.getPublicLock();
 locked.tryLock(300000);
 if (locked == false)
    {
      Logger.log("Failed to retrieve Lock, another function was running");
      return;
    }
 //
 Logger.log("Passed all tests and begining email session");
 //
 //
 var dataSheet = ss.getSheetByName("Emails To Send");
 var dataRange = dataSheet.getRange(2, 1, 800, dataSheet.getLastColumn());
 // Create one JavaScript object per row of data.
 if (myEmailAddress == "greg.larrenaga@postclubusa.com")
   {
     //ss.toast("Assembling Email Data");
   }
 var objects = getRowsData(dataSheet, dataRange);
 // for every row object, check if the row is a client we cannot send emails to, if so, then move it to the sent tab
 // For every row object, create a personalized email from a template and send
 // it to the appropriate person.
 //
 // dump the account information tab into a Javascript Object Array.
 var informationSheet = ss.getSheetByName("Account Info");
 var informationDataRange = informationSheet.getRange(2, 1, 40, informationSheet.getLastColumn());
 var accountInformation = getRowsData(informationSheet, informationDataRange);
 //
 //
 var templateSheet = ss.getSheetByName("Verbiage by Agent");
 var templateDataRange = templateSheet.getRange(2, 1, 40, templateSheet.getLastColumn());
 var templateInformation = getRowsData(templateSheet, templateDataRange);
 //
 // Gather array of all the Completed Hawbs. to check the currecnt ones against.
 var completedArray = [];
 if (myEmailAddress == "greg.larrenaga@postclubusa.com")
   {
     // ss.toast("Assembling Duplicate Values from Database");
    }
 //
 //Initiate Script DB
 var db = ScriptDb.getMyDb();
 // query the DB
 var alreadySentArray = db.query({hawb: db.anyValue()});
 // run through the results, pushing all results onto a new array
 var alreadySent = [];
 while (alreadySentArray.hasNext())
    {
       completedArray.push(alreadySentArray.next().hawb);
     }
 //
 // Sets how many emails to send each session, in future version, this should be set from the script properties, if there are less than 60 to send, then use that number.
 var totalEmailsToSend = 60;
 if (objects.length < 60)
   {
     totalEmailsToSend = objects.length - 1;
   }
 //
 //
 // Loop through the RowData (the emails to send) and check, then process, then send the email.
 for (var i = 0; i < totalEmailsToSend; i++)
 {
   //
   //
   if (emailQuota = 0)
     {
       return;
     }
   //
   // Get a row object
   var rowData = objects[i];
   if (myEmailAddress == "greg.larrenaga@postclubusa.com")
   {
     //ss.toast(("Sending: " + rowData.hawb.toString()),'Mail Merge',-1);
   }
   //
   // check if email has allready been sent
   if (dataSheet.getRange(i+2,dataSheet.getLastColumn()).getValue() != "EMAIL_SKIPPED"
         && dataSheet.getRange(i+2,dataSheet.getLastColumn()).getValue() != "EMAIL_SENT"
         //check if email addy is present
         && rowData.emailAddress
         //Check if Email Addy is actually an email
         && rowData.emailAddress.toString().indexOf("@") != -1
         && rowData.emailAddress.toString().indexOf(" ") == -1
         //check if it is ok to send emails to this clients customers
         && okToSendEmailsToThisClientsCustomers(accountInformation, rowData.accountNumber) == true
         //check if this email is a duplicate
         && completedArray.indexOf(rowData.hawb.toString()) == -1
        )
        // This runs if everything above is true
        {
          // Generate a personalized email.
          // Given a template string, replace markers (for instance ${"First Name"}) with
          // the corresponding value in a row object (for instance rowData.firstName).
          //
          // check if it is a hosted file
           if (isClientsCustomFileHosted(accountInformation, rowData.accountNumber) == true)
               {
                 var t = HtmlService.createTemplate(getCodeOfHostedFile(accountInformation, rowData.accountNumber));
               }
               else
               {
                 var t = HtmlService.createTemplateFromFile(getTextFileName(accountInformation, templateInformation, rowData.agentCode, rowData.accountNumber).toString());
               }
           //
           //
           t.customHeaderLogo = getHeaderImage(rowData.accountNumber, ss);
           t.headerLink = getHeaderLink(rowData.accountNumber, rowData.trackingLink, ss);
           t.logoWidth = getLogoWidth(rowData.accountNumber, ss);
           t.logoHeight = getLogoHeight(rowData.accountNumber, ss);
           // format the date correctly
           t.hawb = Utilities.formatString("%012d", parseInt(rowData.hawb));
           t.date = Utilities.formatDate(rowData.export, "EST", "EEE, MMM d, yyyy");
           t.date = Utilities.formatDate(rowData.date, "EST", "EEE, MMM d, yyyy");
           t.accountNumber = rowData.accountNumber;
           t.name = rowData.name;
           t.shippersRef = rowData.shippersRef;
           t.shippersDepartment = rowData.dpt
           t.consignee = (typeof rowData.consignee == 'undefined') ? "" : rowData.consignee;
           t.contact = (typeof rowData.contact == 'undefined') ? "" : rowData.contact;
           t.address1 = (typeof rowData.address1 == 'undefined') ? "" : rowData.address1;
           t.address2 = (typeof rowData.address2 == 'undefined') ? "" : rowData.address2;
           t.address3 = (typeof rowData.address3 == 'undefined') ? "" : rowData.address3;
           t.town = (typeof rowData.town == 'undefined') ? "" : rowData.town;
           t.country = (typeof rowData.country == 'undefined') ? "" : rowData.country;
           t.zip = (typeof rowData.zip == 'undefined') ? "" : rowData.zip;
           t.phone = rowData.phone;
           t.emailAddress = rowData.emailAddress;
           t.pro = rowData.pro;
           t.weight = rowData.weight;
           t.piece = rowData.piece;
           t.serv = rowData.serv;
           t.spec = rowData.spec;
           t.charge = rowData.charge;
           t.cur = rowData.cur;
           t.invoice = rowData.invoice;
           t.agentCode = rowData.agentCode;
           t.cost = rowData.cost;
           t.cur = rowData.cur;
           t.additional = rowData.additional;
           t.linehaul = rowData.linehaul;
           t.podDate = rowData.podDate;
           t.podT = rowData.podT;
           t.pod = rowData.pod;
           t.trackingNumber = rowData.trackingNumber;
           t.trackingLink = getTrackingLink(templateInformation, rowData.agentCode, rowData.hawb.toString(), rowData.trackingNumber);
           t.mawb = rowData.mawb;
           t.manifest = rowData.manifest;
           t.flight = rowData.flight;
           t.departmentCode = rowData.dpt;
           //
           var emailSubject = Utilities.formatString('%012d', parseInt(rowData.hawb)) + " : Shipment Notification";
           var bcc = getCcdEmailAddress(rowData.accountNumber, ss);
           var replyTo = "";
           var noReply = true;

           if (rowData.accountNumber == 700025)
           {
             replyTo = "hello@quarterly.co";
             noReply = true;
             emailSubject = "Your package from Quarterly Co. has shipped.";
           }
            else
           {
              replyTo = "DoNotReply@PostClubUSA.com";
              noReply = true;
           }
           //
           MailApp.sendEmail(rowData.emailAddress, emailSubject, "",
                             {
                               htmlBody: t.evaluate().getContent(),
                               bcc: bcc,
                               name: getEmailName(rowData.accountNumber, ss),
                               noReply: noReply,
                               replyTo: replyTo
                             }
                            );
           dataSheet.getRange(i+2,dataSheet.getLastColumn()).setValue("EMAIL_SENT");
           //
           // reduce the quote by 1 to watch for the quota floor and avoid errors
           emailQuota = emailQuota - 1;
       }
       //
       // This runs if the Checks above return false
       else
       {
         if (dataSheet.getRange(i+2,dataSheet.getLastColumn()).getValue() != "EMAIL_SENT")
         {
         dataSheet.getRange(i+2,dataSheet.getLastColumn()).setValue("EMAIL_SKIPPED");
         ss.toast("HAWB is being skipped for a reason");
         }
         totalEmailsToSend = totalEmailsToSend + 1;
       }

   }
  ss.toast("Everything Is Done",'Mail Merge',-1);
}

