//
//  This Section keeps the script to retrieve a clients custom HTML template.
//  If the template is not in the Cache, then it will be cached.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isClientsCustomFileHosted(accountInformation, accountNumber)
{
  for (var i = 0; i < accountInformation.length; i++)
    {
      var rowData = accountInformation[i];
      if(rowData.accountNumber == accountNumber)
      {
        if (rowData.hostedFileLocation != "No")
        {
          return true;
        }
      }
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCodeOfHostedFile(accountInformation, accountNumber)
{
  var cache = CacheService.getPublicCache();
  if (cache.get("hostedFileUrl_"+accountNumber) == null)
  {
    var url = getClientsHostedFileUrl(accountInformation, accountNumber);
    var response = UrlFetchApp.fetch(url);
    var code = response.getContentText();
    cache.put("hostedFileUrl_"+accountNumber, code, 3600);
  }
  else
  {
    var code = cache.get("hostedFileUrl_"+accountNumber);
  }
  return code;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getClientsHostedFileUrl (accountInformation, accountNumber)
{
  for (var i = 0; i < accountInformation.length; i++)
  {
    var rowData = accountInformation[i];
    if(rowData.accountNumber == accountNumber)
    {
      return rowData.hostedFileLocation.toString();
    }
  }
}