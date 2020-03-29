function doPost( e ){
  Cook( e, ( payload, sheet, lines ) => {
    var template = sheet.getRange( "A1" ).getValues()[ 0 ][ 0 ];
    if ( 0 == lines.length ){
      payload.text += "調理前だよ！\n"+ template;
    }else{
      var result = template;
      lines.forEach(line => {
        var rules = line.split( ": " );
        var key = rules.shift();
        var value = rules.join( ": " );
        result = result.split( "{{ "+ key +" }}" ).join( value );
      });
      payload.text += "完成！\n"+ result;
    }
    return payload;
  });
}
