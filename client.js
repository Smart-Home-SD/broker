const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log("Client websocket opened!");
});

ws.on('message', function incoming(data) {
  console.log(data);
});