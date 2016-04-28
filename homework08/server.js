'use strict';

const server = require('./index');

// Define configurable port
const port = process.env.PORT || 3000;

// Listen for connections
server.listen(port);

console.log('Server listening on port ' + port);