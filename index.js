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
/*

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
	    if (text === 'Generic') {
           sendGenericMessage(sender)
            continue
        }
	      if (text === 'web') {
		webView(sender)
		    continue 
	      }
	      if (text === 'menu') {
		addPersistentMenu()
		      continue
	      }
		if (text === 'power') {
		getReal(sender)
		     continue 
	      }      
	      
        sendTextMessage(sender, text.substring(0, 200))
   
    } else if (event.postback && event.postback.payload) {
      payload = event.postback.payload;
      // Handle a payload from this sender
	    if (payload === 'power'){
		getReal(sender)
		     continue     
    }
  }
  res.sendStatus(200);
});

*/

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
		      
        if (text === 'Generic') {
           sendGenericMessage(sender)
            continue
        }
	      if (text === 'web') {
		webView(sender)
		    continue 
	      }
	      if (text === 'menu') {
		addPersistentMenu()
		      continue
	      }
		if (text === 'power') {
		getReal(sender)
		     continue 
	      }      
	      if (text === 'temp'){
		      getTemperature(sender)
		      continue
	      }
    		if (text === 'hey'){
		      sendTextMessage(sender, text.substring(0, 200))
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
 const tokentwo= process.env.DEVICE_ACCESS_TOKEN
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

 function addPersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
    method: 'POST',
    json:{
        setting_type:'call_to_actions',
        thread_state:'existing_thread',
        call_to_actions:[
            {
              type:'postback',
              title:'Power status',
              payload:'power'
		},
		{
	        type:'postback',
              title:'Temp status',
              payload:'temp'
		},
            {
              type:'postback',
              title:'Maintenance',
              payload:'maintenance'
            },
            {
              type:'web_url',
              title:'Analytics',
              url:'http://sensee.ca/prototypes/index.html',
	      webview_height_ratio: 'tall'
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


function sendTextMessage(sender, text) {
let	messageData = { text: "Hi , welcome to this bot." + text }
	
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
           // var messageDataa;
            
        if (! error && response.statusCode === 200) {
            maya = JSON.parse(body);
            messageDataa = {"text":maya.result};
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
			message: messageDataa,
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
           // var messageDataa;
            
        if (! error && response.statusCode === 200) {
            maya2 = JSON.parse(body);
            messageDataa = {"text":maya2.result};
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
			message: messageDataa,
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
"attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
	"buttons": [{
		"type": "web_url",
        	"url": "http://sensee.ca/prototypes/index.html",
         	"title": "my house",
		"webview_height_ratio": "tall"
	},
	      {
            "type":"postback",
            "title":"power",
            "payload":"power"
          }
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



function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First tip",
					"subtitle": "check this out",
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
					"buttons": [{
						 "type": "web_url",
                        			"url": "http://sensee.ca/prototypes/index.html",
                       				 "title": "my house",
						 "webview_height_ratio": "compact"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.pn",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
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
	
// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
