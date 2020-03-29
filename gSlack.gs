function Cook( e, on_cook_sheet ){
  if ( ! IsValidParameter( e.parameter ) ) return;
  
  var payload = {
    channel: "#"+ e.parameter.channel_name,
    text: "<@"+ e.parameter.user_id +"> ",
    link_names: 1
  };
  var lines = e.parameter.text.split( "\n" );
  var action = lines.shift();
  switch ( true ){
  case /おしながき|お|し|な|が|き/.test( action ):{
    var sheetNames = GetSheetNames();
    payload.text += "どれにする？\n"+ sheetNames.join( "\n" );
  }break;
  
  default:{
    var sheetNames = GetSheetNames();
    if ( 0 <= sheetNames.indexOf( action ) ){
      var sheet = GetSheet( action );
      payload = on_cook_sheet( payload, sheet, lines );
    }else if ( 0 == lines.length ){
      var spreadsheet_url = GetScriptProperty( "SPREADSHEET_URL" );
      payload.text += action +"は品切れだよ！\n"+ spreadsheet_url;
    }else{
      return;
    }
  }break;
  }
  
  SlackPost( payload );
}

function IsValidParameter( parameter ){
  if ( "slackbot" == parameter.user_name ) return false;
  
  var token = GetScriptProperty( "SLACK_TOKEN" );
  if ( token != parameter.token ){
    throw new Error( "Invalid token" );
  }
  
  return true;
}

function GetSheetNames(){
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheetNames = [];
  sheets.forEach( sheet => {
    var sheetName = sheet.getName();
    sheetNames.push( sheetName );
  });
  return sheetNames;
}

function GetSheet( sheet_name ){
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName( sheet_name );
}

function GetScriptProperty( key ){
  return PropertiesService.getScriptProperties().getProperty( key );
}

function SlackPost( payload ){
  if ( "#" == payload.channel ){
    console.log( JSON.stringify( payload ) );
    return;
  }
  
  var url = GetScriptProperty( "SLACK_URL" );
  UrlFetchApp.fetch( url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify( payload )
  });
}
