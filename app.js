var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express();
var port = process.env.PORT || 5000;
var message = "";
app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port);

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")


wss.on('connection', socket => {
  console.log('connected!');
  socket.onmessage = (m) => {
    message = m.data;
     console.log("aaa::" + message)
     };
     socket.send(JSON.stringify(message))
  socket.on('message', ms => {
    console.log("ss:::" +ms);
  });

  socket.on('close', () => {
    console.log('good bye.');
  });
});