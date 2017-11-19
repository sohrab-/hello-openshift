'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const request = require('request');

const PORT = process.env.PORT || 3000;
const HEART_HOST = process.env.HEART_HOST || 'heart';
const HEART_PORT = process.env.HEART_PORT || '8080';
const HEART_URL = `http://${HEART_HOST}:${HEART_PORT}`

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

// get heart state via REST API
function getState() {
  var state = 'dead'
  request
    .get(HEART_URL)
    .on('response', (response) => {
      if (response.statusCode < 400) {
        state = 'alive';
      }
    })
    .on('error', () => {
      // keep it dead
    });
  return state;
}

// send state to all websocket clients every second
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(getState());
  });
}, 1000);