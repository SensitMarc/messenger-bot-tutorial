const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const httpRequest = require('request')
const http = require('http')

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})


// to post data
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
       event = req.body.entry[0].messaging[i]
      sender = event.sender.id
      //if (event.message && event.message.text) {
       //  text = event.message.text
	      if ((event.message && event.message.text) || (event.postback && event.postback.payload)) {
    var text = event.message ? event.message.text : event.postback.payload;
    // Handle a text message from this sender
	
		      
        if (text === 'MAIN MENU') {
           sendGenericMessage(sender)
            continue
        }
	      if (text === 'ANALYTICS') {
		webView(sender)
		    continue 
	      }
	     // if (text === 'menu') {
	//	addPersistentMenu()
	//	      continue
	  //    }
		if (text === 'NOW') {
		getReal(sender)
		     continue 
	      }      
	      if (text === 'temp'){
		      getTemperature(sender)
		      continue
	      }
    		if (text === 'hey'){
		      getPersonal(sender)
		      continue
	      }
		if (text === 'TODAY'){
		      sendDailyStatus()
		      continue
	      }      
		if (text === 'DIAGNOSTICS'){
		      sendStatus(sender)
		      continue
	      }       
			if (text === 'ON'){
		      sendSensee()
		      continue
	      }          
		      	      
        sendTextMessage(sender, text.substring(0, 200))
      }
   /*
	    if (event.postback && event.postback.payload) {
        text = JSON.stringify(event.postback.payload)
	      if (text === power){
        //sendTextMessage(sender, "Postback received: "+ text.substring(0, 200))
	getReal(sender, JSON.stringify(event.postback.payload))
	console.log(	      
	continue
	      }
      }
    /*   
      else if (event.postback && event.postback.payload) {
      payload = JSON.stringify(event.postback.payload);
      // Handle a payload from this sender
	    if (payload === 'power'){
		//getReal(sender)
		    sendTextMessage(sender, text.substring(0, 200))
		     continue    
		     }
   */
    
    }
    res.sendStatus(200)
  })
	
// recommended to inject access tokens as environmental variables, e.g.
 const token = process.env.FB_PAGE_ACCESS_TOKEN_SENSEE
 const tokentwo = process.env.DEVICE_ACCESS_TOKEN

 //const tokenthree = process.env.sender_id
//const token = "FB_PAGE_ACCESS_TOKEN"

/* function start() {
        var eventSource = new EventSource("  ");
        eventSource.addEventListener('open', function(e) {
            console.log("Opened!"); },false);
        eventSource.addEventListener('error', function(e) {
            console.log("Errored!"); },false);
        eventSource.addEventListener('Uptime', function(e) {
            var parsedData = JSON.parse(e.data);
        }, false);
    }
    */

console.log("hello");
addGetStartedButton();
addPersistentMenu();

function addGetStartedButton(sender){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
    method: 'POST',
    json:{
        setting_type:'call_to_actions',
        thread_state:'new_thread',
        call_to_actions:[
            {
              type:'postback',
              title:'MAIN MENU',
              payload:'MAIN MENU'
		}
          ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})

}


 function addPersistentMenu(sender){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
    method: 'POST',
    
json:
{
	persistent_menu:[{
		
	setting_type:'call_to_actions',
        thread_state:'existing_thread',
	locale:'default',
        composer_input_disabled:'true',
        
	call_to_actions:[
            {
              type:'postback',
              title:'MAIN MENU',
              payload:'MAIN MENU'
		},
		{
	        type:'postback',
              title:'SUBSCRIPTIONS',
              payload:'SUBSCRIPTIONS'
		},
		{
	        type:'postback',
              title:'SUB2',
              payload:'SUB2'
		},
		{
	        type:'postback',
              title:'SUB3',
              payload:'SUB3'
		},
            {
              type:'postback',
              title:'CHAT',
              payload:'CHAT'
            }
          ]
		
    }
			 
]}	 

}, {
composer_input_disabled:'true',
 },
	 
function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})

}

function getPersonal(sender){
let messageData = {"text": sender}; 
request({
    	url: 'https://graph.facebook.com/v2.6/' + sender,//process.env.sender_id,
	qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
	method: 'GET'
    }, function(error, response, body) {
        var name;
            //var messageDataa;
            
        if (! error && response.statusCode === 200) {
            //name = "reset";
		name = JSON.parse(body);
       //     messageDataa = {"text":"Hi, " + name.first_name + ", how can I help you?"};
      //  messageDataa = {"text": sender};    
	//sendGetReal(sender, messageData);
        } else {
            console.log(error);
           sendTextMessage(sender, 'Sorry dude');
        }
    });
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:process.env.sender_id},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})		
}


function sendTextMessage(sender, text) {
let	messageData = { text:text}
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function getReal(sender){
request({
    	url: 'https://api.particle.io/v1/devices/48ff6e065067555013541287/watts',
	qs: {access_token:process.env.DEVICE_ACCESS_TOKEN},
	method: 'GET'
    }, function(error, response, body) {
        var maya;
            //var messageDataPower;
            
        if (! error && response.statusCode === 200) {
            maya = JSON.parse(body);
            messageDataPower = {"text":maya.result + " watts"};
      //  messageDataa = {"text": sender};    
	//sendGetReal(sender, messageData);
        } else {
            console.log(error);
           sendTextMessage(sender, 'Sorry dude');
        }
    });
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageDataPower,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})		
}

function getTemperature(sender){
request({
    	url: 'https://api.particle.io/v1/devices/48ff6e065067555013541287/temperature',
	qs: {access_token:process.env.DEVICE_ACCESS_TOKEN},
	method: 'GET'
    }, function(error, response, body) {
        var maya2;
           // var messageDataTemp;
            
        if (! error && response.statusCode === 200) {
            maya2 = JSON.parse(body);
            messageDataTemp = {"text":maya2.result};
        //messageDataa = {"text": sender};    
	//sendGetReal(sender, messageData);
        } else {
            console.log(error);
           sendTextMessage(sender, 'Sorry dude');
        }
    });
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageDataTemp,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})		
}


function webView(sender){
	let messageData = {
        "type":"web_url",
        "url": "http://sensee.ca/prototypes/index.html",
	"webview_height_ratio": "tall"
      }
request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}   



function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [
					{
					"title": "DIAGNOSTICS",
					"subtitle": "troubleshoot the problem",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
					"buttons": [{
						"type": "postback",
						"title": "DIAGNOSTICS",
						"payload": "DIAGNOSTICS",
					}],
				},  {
					"title": "ANALYTICS",
					"subtitle": "get your analytics",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/assets/img/house-128-green.png",
					"buttons": [{
              					"type": "web_url",
              					"url": "http://sensee.ca/prototypes/index.html",
						"title": "ANALYTICS",
              					"webview_height_ratio": "tall",
					}],
				},
					{
					"title": "CHAT",
					"subtitle": "GROUP CHAT",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/assets/img/house-128-carblue.png",
					"buttons": [{
						"type": "postback",
						"title": "GROUP CHAT",
						"payload": "CLICK HERE FOR GROUP CHAT....https://m.me/g/AbYfV_ec_V9jzVw9",
						
					}],
				}, {
					"title": "ALERTS",
					"subtitle": "troubleshoot the problem",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
					"buttons": [{
						"type": "postback",
						"title": "ALERTS",
						"payload": "ALERTS",
					}],
				},
					{
					"title": "SERVICE CALL",
					"subtitle": "make a service call",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/assets/img/house-128-red.png",
					"buttons": [{
						"type": "postback",
						"title": "SERVICE CALL",
						"payload": "SERVICE CALL",
					}],
				}
				
				]
			}
		}
	},{addPersistentMenu();},
		    
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendStatus(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [
					{
					"title": "SENSEE1",
					"subtitle": "get your status",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/assets/img/logo4.png",
					"buttons": [{
						"type": "postback",
						"title": "NOW",
						"payload": "NOW",
					}],
				}, {
					"title": "SENSEE2",
					"subtitle": "get your status",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/assets/img/logo4.png",
					"buttons": [{
						"type": "postback",
						"title": "NOW",
						"payload": "NOW",
					}],
				},
				
				]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendDailyStatus(){
 const projectkey=process.env.YOUR_PROJECT_ID 
 const readkey=process.env.YOUR_READ_KEY
//var messageData;
request({
	url: 'https://api.keen.io/3.0/projects/'+projectkey+'/queries/count?api_key='+readkey+'&event_collection=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D',
	//qs: {api_key:process.env.YOUR_READ_KEY},
	method: 'GET'
    }, function(error, response, body) {
        var maya3;
           
        if (! error && response.statusCode === 200) {
            maya3 = JSON.parse(body);
            messageData = {"text":maya3.result + " watts"};
        } else {
            console.log(error);
           sendTextMessage(sender, 'Sorry dude');
        }
    });
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:process.env.sender_id},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})		
}


function sendDaily(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "DAILY STATUS",
					"subtitle": "get your status",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
					"buttons": [{
						 "type": "web_url",
                        			"url": "http://sensee.ca/prototypes/index.html",
                       				 "title": "DAILY STATUS",
						 "webview_height_ratio": "tall"
					}, {
						"type": "postback",
						"title": "SERVICE CALL",
						"payload": "SERVICE CALL",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
					"buttons": [{
						"type": "postback",
						"title": "REAL TIME STATUS",
						"payload": "homer",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendSensee() {
//let	messageData = {text:text}
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:process.env.sender_id},
			//message: {'text':'ALERT'},
			message:{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"ALERT",
        "buttons":[
          {
            "type":"postback",
            "title":"get diagnostics",
            "payload":"TODAY"
          }
        ]
      }
    }
  }
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})



