const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const exchangeApiKey = process.env.API_KEY;
const twilioNumber = process.env.TWILIO_NUMBER;
const personalNumber = process.env.PERSONAL_NUMBER;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
const https = require('https');

/**
 * HTTP Get options.
 */
const options = {
  hostname: 'free.currconv.com',
  path: `/api/v7/convert?q=USD_COP&compact=ultra&apiKey=${exchangeApiKey}`,
  method: 'GET'
};

/**
 * Sends a text message with the USD price in COPs.
 * @param {!string} usdPrice USD price in COP.
 */
const sendTextMessage = (usdPrice) => {
  client.messages
    .create({
      body: `Hello there! Dollar is ${usdPrice}COP`,
      to: personalNumber,
      from: twilioNumber,
    })
    .then((message) => console.log('txt', message.sid));
}

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Hello, World';
  console.log('message', message);

  const req = https.request(options, (res) => {
    let output = '';

    res.on('data', (chunk) => output += chunk);
    res.on('end', () => sendTextMessage(JSON.parse(output).USD_COP));
  });
  req.on('error', (error) => console.error(error));
  req.end();
};
