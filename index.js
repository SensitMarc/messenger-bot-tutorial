
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
	      if (text === 'getreal') {
		getReal (sender)
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

function getReal(sender){
	httpRequest ({url: 'https://api.keen.io/3.0/projects/563a13c896773d4a75c3bf93/queries/count_unique?api_key=9d45d36b3d3040533eb3a9f2e8bcc9e317d6b4e7e2cbb413ce959e7c0f8b926a7b82523fc0acd774ef024a0f4bddcc2bd8e992e2f61d9aed7b7f09bcb63bc0a1ebee2e0ebd0e2792dba3dc4ae1ae9c11c19e54753574a726dea4eec16e463aa06196d6876d167a9d668f236f25a8857d&event_collection=kWhr&target_property=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D',
      method: 'GET'}, 

function(error, response, body) 
{var maya;
if (! error && response.statusCode === 200) {
           maya = JSON.parse(body);
	},
	});
	
	//var maya = "owl";
	
	messageData = {
  	"text": maya.result
	};
	
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
                        			"url": "https://www.messenger.com",
                       				 "title": "web url"
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
/*
function processLocation(sender, coords) {
    httpRequest({
        url: 'https://api.keen.io/3.0/projects/563a13c896773d4a75c3bf93/queries/count_unique?api_key=9d45d36b3d3040533eb3a9f2e8bcc9e317d6b4e7e2cbb413ce959e7c0f8b926a7b82523fc0acd774ef024a0f4bddcc2bd8e992e2f61d9aed7b7f09bcb63bc0a1ebee2e0ebd0e2792dba3dc4ae1ae9c11c19e54753574a726dea4eec16e463aa06196d6876d167a9d668f236f25a8857d&event_collection=kWhr&target_property=kWhr&timezone=UTC&timeframe=this_1_days&filters=%5B%5D',
        method: 'GET'
    }, function(error, response, body) {
        var station,
            messageData,
            directionsUrl;

        if (! error && response.statusCode === 200) {
            station = JSON.parse(body);
            directionsUrl = 'http://bing.com/maps/default.aspx?rtop=0~~&rtp=pos.' + coords.lat + '_' + coords.long + '~pos.' + station.gtfs_latitude + '_' + station.gtfs_longitude + '&mode=';

            // Walkable if 2 miles or under
            directionsUrl += (station.distance <= 2 ? 'W' : 'D');

            messageData = {
                'attachment': {
                    'type': 'template',
                    'payload': {
                        'template_type': 'generic',
                        'elements': [{
                            'title': 'Closest BART: ' + station.name,
                            'subtitle': station.distance.toFixed(2) + ' miles',
                            'image_url': 'https://api.mapbox.com/v4/mapbox.streets/' + station.gtfs_longitude + ',' + station.gtfs_latitude + ',18/640x480@2x.png?access_token=' + MAPBOX_API_TOKEN,
                            'buttons': [{
                                'type': 'web_url',
                                'url': 'http://www.bart.gov/stations/' + station.abbr.toLowerCase(),
                                'title': 'Station Information'
                            }, {
                                'type': 'postback',
                                'title': 'Departures',
                                'payload': 'departures ' + station.abbr,
                            }, {
                                'type': 'web_url',
                                'url': directionsUrl,
                                'title': 'Directions'
                            }]
                        }]
                    }
                }
            };

            sendGenericMessage(sender, messageData);
        } else {
            console.log(error);
            sendTextMessage(sender, 'Sorry I was unable to determine your closest BART station.');
        }
    });   
}
*/
	
// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
