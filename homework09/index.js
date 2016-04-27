'use strict';

const server = require('./server');

// Define configurable port
const port = process.env.PORT || 3000;

// Listen for connections
server.listen(port);

console.log('Server listening on port ' + port);