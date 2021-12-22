# Notifier
This is a cloud function that is triggered by a Pub/Sub topic and sends a text message with the current USD price in COP. This runs daily at 8am `0 8 * * *`

## Install
`nvm use && npm i`

## Start
`node index.js`
