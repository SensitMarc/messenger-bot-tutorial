
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
      if (event.message && event.message.text) {
         text = event.message.text
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
      }
      if (event.postback) {
        text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+ text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

// recommended to inject access tokens as environmental variables, e.g.
 const token = process.env.FB_PAGE_ACCESS_TOKEN_SENSEE
//const token = "FB_PAGE_ACCESS_TOKEN"

 function addPersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[
            {
              type:"postback",
              title:"Home",
              payload:"home"
            },
            {
              type:"postback",
              title:"Joke",
              payload:"joke"
            },
            {
              type:"web_url",
              title:"my website",
              url:"http://www.sensee.ca"
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
let	messageData = { text:text }
	
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
httpRequest({
    //    url:'https://api.keen.io/3.0/projects/563a13c896773d4a75c3bf93/queries/count_unique?api_key=9d45d36b3d3040533eb3a9f2e8bcc9e317d6b4e7e2cbb413ce959e7c0f8b926a7b82523fc0acd774ef024a0f4bddcc2bd8e992e2f61d9aed7b7f09bcb63bc0a1ebee2e0ebd0e2792dba3dc4ae1ae9c11c19e54753574a726dea4eec16e463aa06196d6876d167a9d668f236f25a8857d&event_collection=kWhr&target_property=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D',
    	url:'https://api.particle.io/v1/devices/48ff6e065067555013541287/watts?access_token=83f31cc92f11fd6c6b2c7fe2eb37b7b73b8584d1',
	method: 'GET'
    }, function(error, response, body) {
        var maya;
            //messageData;
            
        if (! error && response.statusCode === 200) {
            maya = JSON.parse(body);
            messageData = {"text": maya.result};
            //sendGetReal(sender, messageData);
        } else {
            console.log(error);
           sendTextMessage(sender, 'Sorry I was unable to determine your closest BART station.');
        }
    });
	
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
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
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
