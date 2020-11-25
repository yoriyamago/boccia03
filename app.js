var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var session = require("express-session"); 
var app = express();
var port = process.env.PORT || 5000;
var fs = require('fs');
var path = require('path');
var conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

var indexRouter = require('./routes/index');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('htm', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// error handler
app.use((err, req, res) => {
  if(err.message){
     res.locals.message = err.message;
     res.locals.error = req.app.get('env') === 'development' ? err : {};
     // render the error page
     res.status(err.status || 500);
     res.render('error');
   }
 });

 app.use(express.static(__dirname + "/"))

 app.use(session({
  secret: "secret word",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000
  }
  }));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on('connection', socket => {
  console.log('connected!');
  socket.on('message', ms => {
    wss.clients.forEach(client => {
      client.send(ms);
      console.log("message::" + ms);
    });

    socket.on('close', () => {
      console.log('good bye.');
    });
  });

});
