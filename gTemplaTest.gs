function gTemplaTest() {
  var e = {
    parameter: {
      token: GetScriptProperty( "SLACK_TOKEN" ),
      user_id: "",
      channel_name: "",
      text: ""
    }
  };
  
  e.parameter.text = "おしながき";
  doPost( e );
  
  e.parameter.text = "sample";
  doPost( e );
  
  e.parameter.text = "sample\nwho: だれ\nwhen: いつ\nwhere: どこ\nwhat: なに\nwhy: なぜ\nhow: どのように";
  doPost( e );
  
  e.parameter.text = "a\nb";
  doPost( e );
}
