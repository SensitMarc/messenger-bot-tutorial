
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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
 const token = process.env.FB_PAGE_ACCESS_TOKEN
//const token = "FB_PAGE_ACCESS_TOKEN"

function sendTextMessage(sender, text) {
	messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN},
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
	 messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://api.keen.io/3.0/projects/563a13c896773d4a75c3bf93/queries/count_unique?api_key=9d45d36b3d3040533eb3a9f2e8bcc9e317d6b4e7e2cbb413ce959e7c0f8b926a7b82523fc0acd774ef024a0f4bddcc2bd8e992e2f61d9aed7b7f09bcb63bc0a1ebee2e0ebd0e2792dba3dc4ae1ae9c11c19e54753574a726dea4eec16e463aa06196d6876d167a9d668f236f25a8857d&event_collection=kWhr&target_property=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"web_url": "https://api.keen.io/3.0/projects/563a13c896773d4a75c3bf93/queries/count_unique?api_key=9d45d36b3d3040533eb3a9f2e8bcc9e317d6b4e7e2cbb413ce959e7c0f8b926a7b82523fc0acd774ef024a0f4bddcc2bd8e992e2f61d9aed7b7f09bcb63bc0a1ebee2e0ebd0e2792dba3dc4ae1ae9c11c19e54753574a726dea4eec16e463aa06196d6876d167a9d668f236f25a8857d&event_collection=kWhr&target_property=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D",
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
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN},
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
