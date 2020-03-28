function doPost( e ){
  if ( "slackbot" == e.parameter.user_name ) return;
  
  var token = GetProperty( "SLACK_TOKEN" );
  if ( token != e.parameter.token ){
    throw new Error( "Invalid token" );
  }
  
  var payload = {
    channel: "#"+ e.parameter.channel_name,
    text: "@"+ e.parameter.user_name +" ",
    link_names: 1
  };
  var values = e.parameter.text.split( "\n" );
  var action = values.shift();
  switch ( true ){
  case /おしながき|お|し|な|が|き/.test( action ):{
    var sheetNames = GetSheetNames();
    payload.text += "どれにする？\n"+ sheetNames.join( "\n" );
    SlackPost( payload );
  }break;
  
  default:{
    var sheetNames = GetSheetNames();
    if ( 0 <= sheetNames.indexOf( action ) ){
      var sheet = GetSheet( action );
      var template = sheet.getRange( "A1" ).getValues()[ 0 ][ 0 ];
      var begin_string = sheet.getRange( "B1" ).getValues()[ 0 ][ 0 ];
      var end_string = sheet.getRange( "C1" ).getValues()[ 0 ][ 0 ];
      if ( 0 == values.length ){
        payload.text += "調理前だよ！\n"+ begin_string + template + end_string;
        SlackPost( payload );
      }else{
        var result = template;
        values.forEach(line => {
          var rules = line.split( ": " );
          var key = rules.shift();
          var value = rules.join( ": " );
          result = result.split( "{{ "+ key +" }}" ).join( value );
        });
        payload.text += "一丁揚がり！\n"+ begin_string + result + end_string;
        SlackPost( payload );
      }
    }else if ( 0 == values.length ){
      var spreadsheet_url = GetProperty( "SPREADSHEET_URL" );
      payload.text += action +"は品切れだよ！\n"+ spreadsheet_url;
      SlackPost( payload );
    }
  }break;
  }
}

function GetSheetNames(){
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheetNames = [];
  sheets.forEach(sheet => {
    var sheetName = sheet.getName();
    sheetNames.push( sheetName );
  });
  return sheetNames;
}

function GetSheet( sheet_name ){
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName( sheet_name );
}

function GetProperty( key ){
  return PropertiesService.getScriptProperties().getProperty( key );
}

function SlackPost( payload ){
  if ( "#test" == payload.channel ){
    console.log( JSON.stringify( payload ) );
    return;
  }
  
  var url = GetProperty( "SLACK_URL" );
  UrlFetchApp.fetch( url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify( payload )
  } );
}
