'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const request = require('request');

const PORT = process.env.PORT || 3000;
const HEART_HOST = process.env.HEART_HTTP_HOST || 'heart';
const HEART_PORT = process.env.HEART_HTTP_PORT || '8080';
const HEART_URL = `http://${HEART_HOST}:${HEART_PORT}`;
const TIMEOUT = 2000;

// setup web server
const server = express()
  .use(express.static(path.join(__dirname, 'client')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// setup websocket server
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

function sendState(state) {
  wss.clients.forEach((client) => {
    client.send(state);
  });
}

// get heart state via REST API
function getState() {
  //console.log(`GET ${HEART_URL}...`);
  request
    .get(HEART_URL, { timeout: TIMEOUT })
    .on('response', (response) => {
      console.log(`Received status code: ${response.statusCode}`);
      sendState(response.statusCode < 400 ? 'alive' : 'dead');
    })
    .on('error', (err) => {
      console.log(err);
      sendState('dead');
    });
}

// send state to all websocket clients every second
setInterval(getState, 1000);