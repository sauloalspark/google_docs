var dst_sheet_data_name = "Data";
var dst_sheet_conf_name = "Formulas";
var dst_sheet_grph_name = "Graph";

var API_url             = "https://api.spark.io/v1/devices/";
var device_1_name       = "XXX";
var device_1_bearer     = "XXX";
var maxDaysToKeep       = 1;
//var sea_level_pressure  = 1008.423435;
//var correct_altitude    = 25;
var sea_level_pressure;
var correct_altitude;

//var fields = ["Temparature TMP36", "Altitude", "Temperature", "Pressure", "Pressure difference"];
var fields = ["Temparature TMP36", "Temperature", "Pressure", "Pressure difference"];

//TODO: TRANSFER TO FORMULAS SHEET
var URLS = [
  { "url": API_url + device_1_name +"/analogread", "options": { "payload": { "params": "A2" }, "method": "post", "headers": { "Authorization": "Bearer " + device_1_bearer } }, "key": "return_value", "formula": TMP36  },
  { "url": API_url + device_1_name +"/BMP085"    , "options": {                                "method": "get" , "headers": { "Authorization": "Bearer " + device_1_bearer } }, "key": "result"      , "formula": BMP085 }
];

function test() {
  Logger.log( "TEST" );
}

function setup() {
  var ssc                = SpreadsheetApp.getActiveSpreadsheet()
  //var ssc                = SpreadsheetApp.openById( dst_sheet_id );
      sea_level_pressure = ssc.getRangeByName("SeaLevelPressure").getValue();
      correct_altitude   = ssc.getRangeByName("RealAltitude"    ).getValue();
  
  Logger.log( "sea_level_pressure " + sea_level_pressure     );
  Logger.log( "correct_altitude   " + correct_altitude       );
  this["test"]();
  //google.script.run.setup();
  //Logger.log( window       );
}
