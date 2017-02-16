console.log("Maya");

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
	res.send('hello world i am a secret booty')
})

function sendGenericMessage() {
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
					"image_url": "https://raw.githubusercontent.com/SensitMarc/dashboards/gh-pages/house-128.png",
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
sendGenericMessage();

/*
function sendGenericMessage() {
	let messageData = {
		"attachment": {
			"type": "video",
			"payload": {
				"url":"http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"
			}
		}
	}
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

sendGenericMessage();
*/
const projectkey=process.env.YOUR_PROJECT_ID; 
const readkey=process.env.YOUR_READ_KEY;

function sendDailyStatus(){
request({
	url: 'https://api.keen.io/3.0/projects/' + projectkey + '/events/KWHR',
	qs: {api_key:process.env.YOUR_READ_KEY},
	method: 'GET'
    }, function(error, response, body) {
        var maya;
            
        if (! error && response.statusCode === 200) {
            maya = JSON.parse(body);
            messageDataPower = {"text":maya.result};
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

sendDailyStatus();

