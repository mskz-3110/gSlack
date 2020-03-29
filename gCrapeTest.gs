function gCrapeTest() {
  var e = {
    parameter: {
      token: GetScriptProperty( "SLACK_TOKEN" ),
      user_id: "",
      channel_name: "",
      text: ""
    }
  };
  
  e.parameter.text = "href";
  doPost( e );
  
  e.parameter.text = "href\n<https://www.google.com>";
  doPost( e );
}
