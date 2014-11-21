//http://www.jacorre.com/tutorial/move-rows-between-google-sheets/
//http://stackoverflow.com/questions/15649223/google-sheets-script-to-delete-date-expired-rows
function genReport() {
  var ss          = SpreadsheetApp.getActiveSpreadsheet()
  var sheet       = ss.getSheetByName( dst_sheet_data_name ) 
      sheet.activate();

  var datarange    = sheet.getDataRange();
  var numColumns   = datarange.getNumColumns();
  var numRows      = datarange.getNumRows();
  var lastRow      = datarange.getLastRow();
  var values       = datarange.getValues();
  var minI1w       = -1;
  var minI1d       = -1;
  var minI8h       = -1;
  var minI1h       = -1;
  
  var currentDate  = new Date();
  var oneweekago   = new Date();
      oneweekago.setDate(   currentDate.getDate()  - 7);
  var onedayago    = new Date();
      onedayago.setDate(    currentDate.getDate()  - 1);
  var eighthoursago= new Date();
      eighthoursago.setHours(currentDate.getHours() - 8);
  var onehourago   = new Date();
      onehourago.setHours(  currentDate.getHours() - 1);
  
  Logger.log( "clean :: one week " + oneweekago + " one day " + onedayago + " eight hours ago " + eighthoursago + " one hour ago " + onehourago)
  
  Logger.log( "clean :: num columns " + numColumns + " num rows " + numRows + " last row " + lastRow );
  
  for ( i=lastRow; i>=2; i-- ) { // exclude header
    var tempdate = values[ i-1 ][ 0 ]; // column A
    
    //Logger.log( "tempdate " + tempdate );
    
    if(tempdate >= onehourago)
    {
      //Logger.log( "tempdate " + tempdate + " <= onehourago " + onehourago );
      minI1h = i;
    }
    
    if(tempdate >= eighthoursago)
    {
      minI8h = i;
    }
    
    if(tempdate >= onedayago)
    {
      minI1d = i;
    }
    
    if(tempdate >= oneweekago)
    {
      minI1w = i;
      //Logger.log( "clean :: current date " + currentDate + " " + maxDaysToKeep + " days ago " + oneweekago + " tempdate " + tempdate + " i " + i + " num rows " + (minI-1));
      //Logger.log( values[ 1               ] );
      //Logger.log( values[ i-1             ] );
      //Logger.log( values[ values.length-1 ] );
      //break;
    }
    
    if(tempdate < oneweekago) {
      Logger.log( "tempdate " + tempdate + " BREAKING" );
      break;
    }
  }

  
  //if ( minI1h == -1 ) { minI1h = lastRow; }
  //if ( minI8h == -1 ) { minI8h = lastRow; }
  //if ( minI1d == -1 ) { minI1d = lastRow; }
  //if ( minI1w == -1 ) { minI1w = lastRow; }

  Logger.log( "clean :: minI1w " + minI1w + " minI1d " + minI1d + " minI8h " + minI8h + " minI1h " + minI1h );
  
  //sheetName = sheet.getName(),
  //data = sheet.getDataRange().getValues();
  var numValRows1w = lastRow - minI1w + 1;
  var numValRows1d = lastRow - minI1d + 1;
  var numValRows8h = lastRow - minI8h + 1;
  var numValRows1h = lastRow - minI1h + 1;
  
  Logger.log( "numValRows1w " + numValRows1w + " numValRows1d " + numValRows1d + " numValRows8h " + numValRows8h + " numValRows1h " + numValRows1h );
  
  var nextSheet1w  = ss.getSheetByName( dst_sheet_grph_name + "1w" );
  var nextSheet1d  = ss.getSheetByName( dst_sheet_grph_name + "1d" );
  var nextSheet8h  = ss.getSheetByName( dst_sheet_grph_name + "8h" );
  var nextSheet1h  = ss.getSheetByName( dst_sheet_grph_name + "1h" );
  
  
  
  //if ( lastRow <= 1440 ) { // one day's worth
  //  sheet.getRange(1, 1, lastRow, numColumns).copyTo( nextSheet.getRange( 1, 1, lastRow, numColumns ) ); // copy all data
    
  //} else {
  nextSheet1w.clear();
  nextSheet1d.clear();
  nextSheet8h.clear();
  nextSheet1h.clear();
  
  sheet.getRange(1, 1, 1, numColumns).copyTo( nextSheet1h.getRange( 1, 1, 1, numColumns ) ); // copy titles
  sheet.getRange(1, 1, 1, numColumns).copyTo( nextSheet8h.getRange( 1, 1, 1, numColumns ) ); // copy titles
  sheet.getRange(1, 1, 1, numColumns).copyTo( nextSheet1d.getRange( 1, 1, 1, numColumns ) ); // copy titles
  sheet.getRange(1, 1, 1, numColumns).copyTo( nextSheet1w.getRange( 1, 1, 1, numColumns ) ); // copy titles
    
  sheet.getRange(minI1h, 1, numValRows1h, numColumns).copyTo( nextSheet1h.getRange( 2, 1, numValRows1h, numColumns ) ); // copy tail
  Logger.log( "FINISHED REPORT 1h" );
  sheet.getRange(minI8h, 1, numValRows8h, numColumns).copyTo( nextSheet8h.getRange( 2, 1, numValRows8h, numColumns ) ); // copy tail
  Logger.log( "FINISHED REPORT 8h" );
  sheet.getRange(minI1d, 1, numValRows1d, numColumns).copyTo( nextSheet1d.getRange( 2, 1, numValRows1d, numColumns ) ); // copy tail
  Logger.log( "FINISHED REPORT 1d" );
  sheet.getRange(minI1w, 1, numValRows1w, numColumns).copyTo( nextSheet1w.getRange( 2, 1, numValRows1w, numColumns ) ); // copy tail
  Logger.log( "FINISHED REPORT 1w" );
  
  Logger.log( "FINISHED REPORT ALL" );
  


//} 
}

function cleanOld() {
  var ss          = SpreadsheetApp.getActiveSpreadsheet()
  var sheet       = ss.getSheetByName( dst_sheet_data_name ) 
      sheet.activate();

  var datarange    = sheet.getDataRange();
  var numColumns   = datarange.getNumColumns();
  var numRows      = datarange.getNumRows();
  var lastRow      = datarange.getLastRow();
  var currentDate  = new Date();
  var oneweekago   = new Date();
      oneweekago.setDate(   currentDate.getDate()  - 7);
  var onedayago    = new Date();
      onedayago.setDate(    currentDate.getDate()  - 1);
  var eighthoursago= new Date();
      eighthoursago.setHours(currentDate.getHours() - 8);
  var onehourago   = new Date();
      onehourago.setHours(  currentDate.getHours() - 1);
  var values       = datarange.getValues();
  var minI         = -1;
  
  
  Logger.log( "clean :: one week " + oneweekago + " one day " + onedayago + " eight hours ago " + eighthoursago + " one hour ago " + onehourago);
  
  return;
  Logger.log( "clean :: num columns " + numColumns + " num rows " + numRows + " last row " + lastRow );
  
  for ( i=lastRow; i>=2; i-- ) { // exclude header
    var tempdate = values[ i-1 ][ 0 ]; // column A
    if(tempdate < oneweekago)
    {
      minI = i + 1;
      Logger.log( "clean :: current date " + currentDate + " " + maxDaysToKeep + " days ago " + oneweekago + " tempdate " + tempdate + " i " + i + " num rows " + (minI-1));
      Logger.log( values[ 1               ] );
      Logger.log( values[ i-1             ] );
      Logger.log( values[ values.length-1 ] );
      break;
      //sheet.deleteRow(i);
    }
  }
  
  
  
     //sheetName = sheet.getName(),
     //data = sheet.getDataRange().getValues();
  var numValRows = minI - 2;
  var dst_sheet_bckp_name = "bkp";
  
  if ( numValRows > 1 ) {
    var startRow  = 2;
    var nextSheet = ss.getSheetByName( dst_sheet_bckp_name );
    var lastRowNS = nextSheet.getLastRow();
    
    Logger.log( "clean :: next sheet last row " + lastRowNS + " start row " + 2 + " num valid rows " + numValRows );
    
    //var values    = sheet.getRange( 2, 1, numValRows, numColumns ).getValues();
    var oldValues    = values.slice( 1, numValRows+1 );
    Logger.log( oldValues[ 0             ] );
    Logger.log( oldValues[oldValues.length-1] );
    nextSheet.getRange( lastRowNS+1, 1, numValRows, numColumns ).setValues( oldValues );
    
    var leftStart   = minI;
    var leftRows    = numRows - minI + 1;
    var leftLastRow = lastRow - leftRows;
    Logger.log( "clean :: minI " + minI + " left rows " + leftRows );
    //var leftValues = sheet.getRange(leftStart, 1, leftRows, numColumns).getValues();
    var leftValues = values.slice( numValRows+1, values.length );
    
    Logger.log( leftValues[0                 ] );
    Logger.log( leftValues[leftValues.length-1] );
    //sheet.getRange(2       , numColumns, leftRows, numColumns).setValues( leftValues );
    Logger.log( "clean :: cleaning leftRows " + leftRows + " numColumns " + numColumns + " leftLastRow " + leftLastRow + " numColumns " + numColumns );
    //sheet.getRange(leftRows, numColumns, leftLastRow, numColumns).clear();
    //sheet.deleteRows( 2, numValRows ); 
    
  } 
}
