#!/usr/local/bin/node
/**
 * ======================
 * krapp websocket server
 * ======================
 */
const express   = require('express');
const http      = require('http');
const WebSocket = require('ws');
const fs        = require('fs');
const tfs       = require('tail-stream');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

const PATH_NGINX_ACCESS_LOG = '/var/log/nginx/access.log';
const PATH_NGINX_ERROR_LOG  = '/var/log/nginx/error.log';
const FILE_REFRESH_INTERVAL = 100;

let sessions = [];
let streams = [];

streams.push(tfs.createReadStream(PATH_NGINX_ACCESS_LOG, { interval: FILE_REFRESH_INTERVAL }));
streams.push(tfs.createReadStream(PATH_NGINX_ERROR_LOG, { interval: FILE_REFRESH_INTERVAL }));

for (let f in streams) {
  streams[f].on('data', (chunk) => {
    let decoded = chunk.toString();

    if (sessions.length) {
      for (let s in sessions) {
        let socket = sessions[s];

        if (socket.readyState === 1) {
          socket.send(decoded);
        }
      }
    }
  });
}

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

wss.on('connection', (ws) => {
  sessions.push(ws);

  ws.on('message', (recv) => {
    console.log(`received: ${recv}`);
    ws.send(`Hello, you send -> ${recv}`);
  });
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} : `);
});