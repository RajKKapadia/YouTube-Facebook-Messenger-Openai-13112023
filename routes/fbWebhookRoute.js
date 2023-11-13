const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require("axios").default;

router.get('/', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOEKN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

const callSendMessage = async (url, senderId, query) => {
  let options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      senderId: senderId,
      query: query
    }
  };
  await axios.request(options)
}

router.post('/', async (req, res) => {
  try {
    let body = req.body;
    let senderId = body.entry[0].messaging[0].sender.id;
    let query = body.entry[0].messaging[0].message.text;
    const host = req.hostname;
    let requestUrl = `https://${host}/sendMessage`;
    callSendMessage(requestUrl, senderId, query)
    console.log(senderId, query);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send('OK');
});

module.exports = {
  router
};
