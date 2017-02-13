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

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN_SENSEE},
		method: 'POST',
		json: {
			recipient: {id:sender_id},
			message: ("text":"Space"},
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})

