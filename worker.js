var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our WebSocket server
  var scServer = worker.getSCServer();
  
  var mainNavFile = __dirname + '/public/app/shared/nav.html';
  var mainNavContent = fs.readFileSync(mainNavFile, {encoding: 'utf8'});
  
  var subNavFile = __dirname + '/public/app/shared/nav-docs.html';
  var subNavContent = fs.readFileSync(subNavFile, {encoding: 'utf8'});
  
  var navContent = mainNavContent + subNavContent;
  
  var publicDir = path.normalize(__dirname + '/public/');
  
  var templateTagsRegex = /\{{2,3}[^{}]*\}{2,3}/g;
  var escapedFragmentRegex = /^\/[?]_escaped_fragment_=(.*)/;
  var fragment, page;
  app.use(function (req, res, next) {
    fragment = req.url.match(escapedFragmentRegex);
    if (fragment) {
      page = fragment[1];
      if (page == '/' || page == '') {
        page = '/index';
      }
      var resourcePath = path.normalize(publicDir + 'app/views' + page + '.html');

      if (resourcePath.indexOf(publicDir) > -1) {
        fs.readFile(resourcePath, {encoding: 'utf8'}, function (err, data) {
          if (err) {
            data = '';
          }
          var content = (navContent + data).replace(templateTagsRegex, '');
          
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          res.end(content);
        });
      } else {
        res.writeHead(403, {
          'Content-Type': 'text/html'
        });
        res.end('Access denied');
      }
    } else {
      next();
    }
  });
  
  app.use(function (req, res, next) {
    res.setHeader('Set-Cookie', 'sc-cookie=sc12345; path=/;');
    next();
  });
  
  app.use(serveStatic(__dirname + '/public'));
  
  httpServer.on('request', app);
  
  var randInterval = setInterval(function () {
    scServer.global.publish('rand', Math.round(Math.random() * 100000));
  }, 1000);
};
