var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our WebSocket server
  var wsServer = worker.getSCServer();
  
  app.use(serveStatic(__dirname + '/public'));

  httpServer.on('req', app);
};
