function collectData() {
  setup();
  
  var  results = [[],[]];

  for ( var URLp in URLS ) {
    var URL      = URLS[ URLp ];
    var url      = URL["url"    ];
    var option   = URL["options"];
    var keyName  = URL["key"    ];
    var formula  = URL["formula"];
    
    //Logger.log( URL );
    Logger.log( "getting url " + url     );
    Logger.log( "options     "           );
    Logger.log( option                   );
    Logger.log( "keyName     " + keyName );
    //Logger.log( "formula     " );
    //Logger.log( formula       );
    
    try {
      var response = UrlFetchApp.fetch(url, option);
      Logger.log( "response    " + response );
    
      try {
        var responseJ = JSON.parse(response.getContentText()); // parse the JSON the Core API created
        Logger.log( "responseJ   ");
        Logger.log( responseJ );
      
        try {
          //var p = JSON.parse(result); // parse the JSON you created
          //var d = new Date(); // time stamps are always good when taking readings
          //sheet.appendRow([d, p.data1, p.data2]); // append the date, data1, data2 to the sheet
          var val = responseJ[keyName];
          
          Logger.log( "adding resp " + val);
          
          if ( formula ) {
            Logger.log( "formula run " + val);
            var res = formula( keyName, val );
            var n   = res[0];
            val     = res[1];
            results[0][ URLp ] = n;
            results[1][ URLp ] = val;
          } else {
            results[0][ URLp ] = keyName;
            results[1][ URLp ] = val;
          }
          
          Logger.log("results ");
          Logger.log(results);
        } catch(e)
        {
          Logger.log("Unable to do second parse");
          return;
        }
      } catch(e)
      {
        Logger.log("Unable to returned JSON");
        return;
      }
    } catch(e)
    {
      Logger.log("Unable to connect");
      return;
    }
  }
          
  var sres   = serializeResults( results );
  var titles = sres[0];
  var values = sres[1];

  Logger.log("serialize results ");
  Logger.log(sres);

  titles.unshift( "Time"     );
  values.unshift( new Date() );

  Logger.log("serialize titles ");
  Logger.log(titles);
  Logger.log("serialize values ");
  Logger.log(values);
  Logger.log("titles length " + titles.length );
  

  
  //var ss = SpreadsheetApp.openById( dst_sheet_id );
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  //SpreadsheetApp.setActiveSheet( sheet );
  var sheet = ss.getSheetByName( dst_sheet_data_name ) 
  sheet.activate();
  
  sheet.getRange(1, 1, 1, titles.length).setValues( [ titles ] );
  sheet.appendRow(values); // append the date, data1, data2 to the sheet
  
  genReport();
}


