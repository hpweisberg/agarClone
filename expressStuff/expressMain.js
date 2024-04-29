// Purpose: entry point for all Express stuff

const app = require('../servers').app;
const io = require('../servers').io;


module.exports = app;