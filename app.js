const WebSocketServer = require("ws").Server;
const { SESSION_SECRET } = require("./public/javascripts/app.config.js").security;
const http = require("http");
const express = require("express");
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const port = process.env.PORT || 5000;

//const passport = require('./auth');
const indexRouter = require('./routes/index.js');
const conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('htm', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + "/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// routing
//app.use('/boccia', indexRouter);
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


var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on('connection', socket => {
  console.log("connected!!!!");
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
