function cleanDatabaseOfOldEntries()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var db = ScriptDb.getMyDb();
  // queary the DB for all dayEmailed: and pass into an array
  var results = db.query({});
  var daysThatHaveBeenEmailed = [];
  while (results.hasNext())
    {
      daysThatHaveBeenEmailed.push(results.next().dayEmailed);
    }

  // scrub the array and remove all duplicates
  // pass the array up to the user
  // user enters a csv of days to delete
  var daysToDelete = getDaysToDeleteFromUser(removeDuplicateElement(daysThatHaveBeenEmailed));
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDaysToDeleteFromUser(days)
{
  var daysToDelete = Browser.inputBox(days);
  var areWeDone = actuallyDeleteTheDays(daysToDelete);
  if(areWeDone == true)
  {
    Browser.msgBox("Days Have Been Deleted: " + daysToDelete);
  }
  else
  {
    Browser.msgBox("It Didnt Work");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function actuallyDeleteTheDays(daysToDelete)
{
  var db = ScriptDb.getMyDb();
  var result = db.query({dayEmailed: daysToDelete})
  while (result.hasNext())
     {
       var current = result.next();
       if (current.dayEmailed.toString() == daysToDelete.toString())
       {
       db.remove(current);
       }
     }
   return true;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////