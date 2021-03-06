var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);

//mangoose connection
var db = require('./dbConnection.js')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//socke.io
var socketIO = require('socket.io');
var io = socketIO(server);

//routes 
let eventsLog=require("./routes/routes.js");

//routes to use
app.use('/api',eventsLog); 
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/chat', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/register', function(request, response) {
  response.sendFile(path.join(__dirname, 'register.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});


//socket.io functions
require('./sockets.js')(io);



