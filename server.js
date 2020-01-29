// set up ======================================================================
const express = require('express');
const mongoose = require('mongoose'); // mongoose for mongodb
const dbConfig = require('./config/database.config'); // load the database config
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');

const port = process.env.PORT || 3000; // set the port
const app = express(); // create our app w/ express
app.use(cors());

// configuration ===============================================================
mongoose.connect(dbConfig.localUrl, { // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

app.use(express.static('./public')); // set the static files location /public/img will be /img for users
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// routes ======================================================================
require('./app/routes/note.routes.js')(app);
// define a simple route
app.get('/', (req, res) => {
  res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

// listen for requests (start app with node server.js) =========================
app.listen(port);
console.log("Server is listening on port " + port);
