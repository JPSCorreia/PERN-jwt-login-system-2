const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port = 5001;


// middleware
app.use(morgan('dev')); // logs HTTP requests to the server in detail
app.use(cors()); // enables CORS so our backend can communicate with the frontend
app.use(express.json()); // parses incoming requests with JSON payloads as request.body


// routes
// register and login routes
app.use('/auth', require('./routes/jwtAuth'));
// dashboard route
app.use('/dashboard', require('./routes/dashboard'));

// server listen
app.listen(port, () => {
  console.log(`server is running on port ${port}:`)
})