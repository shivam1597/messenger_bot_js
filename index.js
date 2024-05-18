const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const facebookBot = require('fb-messenger-bot-api');

const app = express();
const puppeteer = require('puppeteer');
const axios = require('axios');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const accessToken = 'EAATLbQ3tltoBOZCxMVigUEphsgPstIxoUqnZB85in8JALXkvONHh7GINVS87Y3fUyIo4CDW9NgQyZAnhQ01i2EEjtQh7DWQuanxkl0mM2HyWGI7F6fp8DN6ZCZAtINe1i75fkI6oHSWs5inYsMIVwhjt6RhRPR98c96LthooEEayVyFUMvTmTKUH3ketXBl2ZCqgZDZD'
const verifyToken = 'anystring'

const messageClient = new facebookBot.FacebookMessagingAPIClient(process.env.PAGE_ACCESS_TOKEN);

app.get('/', async (req, res) => {
  try {
    const tokenSent = req.query['hub.verify_token'];
    if (tokenSent === verifyToken) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Verification token mismatch');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
 
  let body = req.body;

  if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

          // Gets the message. entry.messaging is an array, but
          // will only ever contain one message, so we get index 0
          let webhook_event = entry.messaging[0];
          console.log(webhook_event);

          // Get the sender PSID
          let sender_psid = webhook_event.sender.id;
          console.log('Sender PSID: ' + sender_psid);

          // Check if the event is a message or postback and
          // pass the event to the appropriate handler function
          if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);
          } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
          }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
  } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
  }

});

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
  let response;

  if (received_message.text) {

  }
}

// 
const handlePostback = async(sender_psid, received_postback) => {

  // Get the payload for the postback
  let payload = received_postback.payload;

  if(payload === 'GET_STARTED'){
    dummyFunction(sender_psid);
  }
}

function sendTextMessage(sender, text) {
  var messageData = {
      text: text
  };

  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
          access_token: token
      },
      method: 'POST',
      json: {
          recipient: {
              id: sender
          },
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error:', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
  });
}

async function sendGetstartedButton(){
  const url = 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+accessToken;
  const headers = {"Content-Type": "application/json"};
  const payloadData = {
    "get_started": {
        "payload": "GET_STARTED"
    }
  };
  await axios.post(url, payloadData, {headers: headers});
}

async function dummyFunction(receipientId){
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to a webpage
  await page.goto('https://www.google.com');

  // Close the browser
  await browser.close();
  messageClient.sendTextMessage(receipientId, 'Scrape done');
}


app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
