var token = <token_here>;
var tgurl = "https://api.telegram.org/bot" + token;
var webAppUrl = <sheet_url_here>;

function setWebhook() {
  var url = tgurl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  //Logger.log(response.getContentText());
}

function sendMessage(chat_id, text) {
  var url = tgurl + "/sendMessage?chat_id=" + chat_id + "&text="+ text;
  var response = UrlFetchApp.fetch(url);
  //Logger.log(response.getContentText()); 
}

//function getDate() {
// var date = new Date;
// var simplified_date = date.getDate() + "/" + date.getMonth(); 
// Logger.log(simplified_date);
//}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var chat_id = contents.message.from.id; 
  var sender_id = contents.message.from.id;
  var first_name = contents.message.from.first_name;
  var last_name = contents.message.from.last_name;
  var received_text = contents.message.text;
  var response_text = "You're going to win this hackathon " + first_name + " ;)";
  var date = new Date;
  
  var sheet_id = "1i8_1n1zKVQ-opH8O_cC4NwIoUfTYkjGiDu5DGyQln0Y";
  var sheet = SpreadsheetApp.openById(sheet_id).getSheetByName("Sheet1");
  var users = SpreadsheetApp.openById(sheet_id).getSheetByName("Sheet2");
  var split_text = received_text.split(" ");
  
  
  if(split_text[0] == "sleep") {
    sheet.appendRow([sender_id, first_name, last_name, received_text, date, split_text[1]]);
    var hours = split_text[1]
    var identifier = split_text[2]
    var totalhours = users.getDataRange().getCell((2 + Number(identifier)), 6).getValue();
    users.getDataRange().getCell((2 + Number(identifier)), 6).setValue(totalhours + Number(hours));
    var records = users.getDataRange().getCell((2 + Number(identifier)), 7).getValue();
    users.getDataRange().getCell((2 + Number(identifier)), 7).setValue(records + 1);
    sendMessage(chat_id,"sleep duration recorded");
    
  } else if(split_text[0] == "new") {
    var id_counter = users.getDataRange().getCell(1,2).getValue();
    users.getRange('B1').setValue(id_counter + 1);
    users.appendRow([sender_id, first_name, last_name, received_text, date, 0, 0]);
    var response = "new user added succesfuly: your id is " + (id_counter+1);
    sendMessage(chat_id,response);
    
  } else if(split_text[0] == "get") {
    var identifier = split_text[1]
    var totalhours = users.getDataRange().getCell((2 + Number(identifier)), 6).getValue();
    var response = "your total sleep time: " + totalhours;
    sendMessage(chat_id,response);
    
  } else if(split_text[0] == "average") {
    var identifier = split_text[1]
    var totalhours = users.getDataRange().getCell((2 + Number(identifier)), 6).getValue();
    var records = users.getDataRange().getCell((2 + Number(identifier)), 7).getValue();
    var response = "your total sleep time: " + totalhours/records;
    sendMessage(chat_id,response);
    
  } else {
    sendMessage(chat_id,response_text);
    
  }
  
}