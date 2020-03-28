function gTemplaTest() {
  doPost({
    parameter: {
      token: GetProperty( "SLACK_TOKEN" ),
      user_name: "test",
      channel_name: "test",
      text: "sample\nwho: だれ\nwhen: いつ\nwhere: どこ\nwhat: なに\nwhy: なぜ\nhow: どのように"
    }
  });
}
