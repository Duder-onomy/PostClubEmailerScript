
function okToSendEmailsToThisClientsCustomers(accountInformation, accountNumber)
{
 for (var i=0; i < accountInformation.length; i++)
 {
   var rowData = accountInformation[i];
   if (rowData.accountNumber == accountNumber)
   {
     if(rowData.sendEmailsTo == "Yes")
     {
       return true;
     }
     else
     {
       return false;
     }
   }

 }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getHeaderImage(accountNumber, ss)
{
 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var customHeaderLogo = lookupAccountNumber.offset(0, 6).getValue().toString();
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  return customHeaderLogo
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getHeaderLink(accountNumber, trackingLink, ss)
{
 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var headerLink = lookupAccountNumber.offset(0, 7).getValue().toString();
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  if (typeof headerLink == "undefined")
      {
      headerLink = trackingLink;
      }
  return headerLink
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCcdEmailAddress(accountNumber, ss)
{
 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var ccdEmail = lookupAccountNumber.offset(0, 5).getValue().toString();
     if (ccdEmail.length <= 0)
         {
         ccdEmail = "greg.larrenaga@postclubusa.com";
         }
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  return ccdEmail
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLogoWidth(accountNumber, ss)
{
 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var logoWidth = lookupAccountNumber.offset(0, 8).getValue().toString();
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  return logoWidth
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLogoHeight(accountNumber, ss)
{
 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var logoHeight = lookupAccountNumber.offset(0, 9).getValue().toString();
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  return logoHeight
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEmailName(accountNumber, ss)
{

 var dataSheet = ss.getSheetByName("Account Info");
 var lookupAccountNumber = dataSheet.getRange("A1");
 for (var i=0; i<25; i++)
 {
   if (lookupAccountNumber.getValue().toString() === accountNumber)
   {
     var emailName = lookupAccountNumber.offset(0, 10).getValue().toString();
     break;
   }
   lookupAccountNumber = lookupAccountNumber.offset(1,0);
 }
  if (typeof emailName == "undefined")
  {
    emailName = "PostClubUSA - Worlwide Ecommerce Parcel Home Delivery Leaders";
  }
  return emailName
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTextFileName(accountInformation, templateInformation, agentCode, accountNumber)
{
  for (var i = 0; accountInformation.length; i++)
  {
    var rowData = accountInformation[i];
    if(rowData.accountNumber == accountNumber)
    {
      if(rowData.useCustomVerbiage == "Yes")
      {
        return rowData.nameOfCustomVerbiageFile;
      }
      else
      {
        for (var j = 0; templateInformation.length; j++)
        {
          var rowData2 = templateInformation[j];
          if(rowData2.agentCode == agentCode)
          {
            return rowData2.nameOfVerbiageFile.toString();
          }
        }
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTrackingLink(templateInformation, agentCode, hawb, trackingNumber)
{
  for (var j = 0; templateInformation.length; j++)
    {
      var rowData2 = templateInformation[j];
      if(rowData2.agentCode == agentCode)
        {
          var trackingLink = rowData2.trackingLink.toString();
          break;
        }
     }
   switch (agentCode)
     {
     case 'BPI':
       trackingLink = trackingLink.replace("XXXX",hawb);
       break;
     case 'PNET':
       trackingLink = trackingLink.replace("XXXX",hawb);
       break;
     case 'DL':
       trackingLink = trackingLink.replace("XXXX",hawb);
       break;
     case 'SL':
       trackingLink = trackingLink.replace("XXXX",trackingNumber);
       break;
     case 'MAXI':
       trackingLink = trackingLink.replace("XXXX",trackingNumber);
       break;
     case 'RM':
       trackingLink = trackingLink.replace("XXXX",trackingNumber);
       break;
     case 'PDN':
       trackingLink = trackingLink;
       break;
     case 'HOLD':
       trackingLink = trackingLink.replace("XXXX",hawb);
       break;
     case 'AUFT':
       trackingLink = trackingLink.replace("XXXX",trackingNumber);
       break
     case 'DLFT':
       trackingLink = trackingLink.replace("XXXX",trackingNumber);
       break
     }
   return trackingLink;
 }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function showMeTheCurrentTime()
{
  var rightNow = new Date();
  var hourRightNow = rightNow.getHours();
  Browser.msgBox("the Hour Index right now is:" + hourRightNow)

}