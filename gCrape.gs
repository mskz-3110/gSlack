function doPost( e ){
  Cook( e, ( payload, sheet, lines ) => {
    var rules = {};
    var records = sheet.getDataRange().getValues();
    records.forEach( record => {
      if ( 0 < record[ 0 ].length ){
        var flags = ( undefined == record[ 2 ] ) ? "" : record[ 2 ];
        if ( flags.indexOf( "g" ) < 0 ) flags += "g";
        rules[ record[ 0 ] ] = {
          pattern: record[ 1 ],
          flags: flags
        };
      }
    });
    if ( 0 == lines.length ){
      var results = [];
      for ( var key in rules ){
        var rule = rules[ key ];
        results.push( key +": /"+ rule.pattern +"/"+ rule.flags );
      }
      payload.text += "調理前だよ！\n"+ results.join( "\n" );
    }else{
      var results = [];
      var url = UrlTrim( lines.shift() );
      var response = UrlFetchApp.fetch( url );
      var html = response.getContentText( "UTF-8" );
      if ( 0 == Object.keys( rules ).length ){
        payload.text += "完成！\n```"+ html +"```";
      }else{
        for ( var key in rules ){
          var rule = rules[ key ];
          var regex = new RegExp( rule.pattern, rule.flags );
          var matches;
          while ( null != ( matches = regex.exec( html ) ) ){
            results.push( key +": "+ matches[ ( 1 == matches.length ) ? 0 : 1 ] );
          }
        }
        payload.text += "完成！\n"+ results.join( "\n" );
      }
    }
    return payload;
  });
}
