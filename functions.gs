
function TMP36( keyName, reading ) {
  var maxScale    = 4095;
  //var maxScale    = 4096;
  var involtage   = 3.28;
  //var involtage   = 3.30;
  var constLoss   = 0.10;
  //var constLoss   = 0.5;
  var voltage     = (reading * involtage) / maxScale;

  // Calculate the temperature and update our static variable
  var temperature = (voltage - constLoss) * 100;
  
  Logger.log( "reading " + reading + " maxScale " + maxScale + " involtage " + involtage + " voltage " + voltage + " temperature " + temperature  );
  
  return [ "Temparature TMP36", temperature ];
}

function BMP085( keyName, data ) {
  var res = [[],[]];
  
  Logger.log( "BMP085 data " );
  Logger.log( data );
  try {
    var p   = JSON.parse( data ); // parse the JSON you created
    Logger.log( "BMP085 parsed data " );
    Logger.log( p );
    
    p["Altitude"   ] = p["altitude"   ]; delete p["altitude"   ];
    p["Temperature"] = p["temperature"]; delete p["temperature"];
    p["Pressure"   ] = p["pressure"   ]; delete p["pressure"   ];
    
    
    if (typeof sea_level_pressure !== 'undefined') {
      Logger.log( "sea_level_pressure " + sea_level_pressure );
      var altitude  = p["Altitude"];
      var nAltitude = 44330 * ( 1 - Math.pow( (p["Pressure"]*1.0) / sea_level_pressure, (1.0/5.255) ) ); //sea_level_pressure
      Logger.log( "Corrected altitude " + nAltitude );
      //p["Corrected altitude"  ] = nAltitude;
      p["Altitude"] = nAltitude;

      if (typeof correct_altitude !== 'undefined') {
        //var dAltitude = p["Corrected altitude"] - correct_altitude;
        //Logger.log( "Corrected altitude " + correct_altitude );  
        //Logger.log( "Delta altitude     " + dAltitude        );  
        //p["Delta altitude"] = dAltitude;
        
        var ePressure   = sea_level_pressure * Math.pow((1.0-(correct_altitude/44330.0)), 5.255);  // expected pressure (in Pa) at altitude
        
        var weatherDiff = p["Pressure"] - ePressure;
        
        p["Pressure difference"] = weatherDiff;
        //https://www.sparkfun.com/tutorials/253
        
      //} else {
        //var dAltitude = nAltitude - altitude;
        //Logger.log( "Delta altitude " + dAltitude );
        //p["Delta altitude"] = dAltitude;
      } else {
        Logger.log( "NO Correct altitude " + correct_altitude );  
      }
    } else {
      Logger.log( "NO Sea Level pressure " + sea_level_pressure );  
    }

    
    for ( var k in p ) {
      Logger.log( "BMP085 data k " + k );
      res[0][ res[0].length ] = k;
      res[1][ res[1].length ] = p[k];
      
    }
  } catch(e)
  {
    Logger.log("Unable to do second parse");
  }
  
  return res;
}


function serializeResults( results ) {
  var rt = [];
  var rv = [];
  for ( var f = 0; f < results[0].length; ++f ) {
    var t = results[0][f];
    var v = results[1][f];
    Logger.log("f " + f + " t "  + t + " v "  + v );
    
    if ( v ) {
      if ( v.constructor === Array ) {
        for ( var g = 0; g < v.length; ++g ) {
          var tt = t[g];
          var vv = v[g];

          Logger.log("f " + f + " g "  + g + " tt " + tt + " vv " + vv );
          
          rt[ rt.length ] = tt;
          rv[ rv.length ] = vv;
        }
        
      } else {
        rt[ rt.length ] = t;
        rv[ rv.length ] = v;
      }
    }
  }
  return [ rt, rv ];
}
