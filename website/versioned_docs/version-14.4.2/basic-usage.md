---
id: version-14.4.2-basic-usage
title: Basic usage
sidebar_label: Basic usage
original_id: basic-usage
---
 

Note that before proceeding with this tutorial, you should read the 'getting started' tutorial.

Once you have setup SocketCluster, you should have a JavaScript file called server.js which looks like [this](https://github.com/SocketCluster/socketcluster/blob/master/sample/server.js).

To make sense of some of these options, it's important to consider that SocketCluster runs as a cluster of 3 different kinds of processes on the server:

### Master process (server.js)

This is where everything starts

### Workers

This is where all your business logic should go - The workerController lets you setup the logic for your HTTP server and your real-time SocketClusterServer for handling real-time socket connections and events.

### Brokers

This is mostly used internally by SocketCluster to allow all your workers to efficiently share channel data with one another. You can also use these to store session data and also to scale your app horizontally across multiple machines.

### Boilerplate app

If you open your <code>workerController</code> file (worker.js), inside the <code>run()</code> method, you should see some code where your httpServer and your scServer are being setup to accept requests/connections. By default, the httpServer is hooked to Express (with static server middleware) which serves the content of the <code>public/</code> folder:

```js
// Server code
app.use(serveStatic(__dirname + '/public'));

httpServer.on('req', app);
```

In the boilerplate app, scServer handles incoming WebSocket connections and listens for a custom 'ping' event from client sockets (among other things):

```js
// Server code
var count = 0;

scServer.on('connection', function (socket) {
  // ...

  socket.on('ping', function (data) {
    count++;
    console.log('PING', data);
    scServer.exchange.publish('pong', count);
  });
});
```

Here, the 'ping' event will be triggered whenever the client sockets emits a ping on the client using:

```js
// Client code
socket.emit('ping', 'This is a PING message')
```

Emitting events is the simplest way to pass messages between clients and the server but it is not the only way to share messages.

Note that you can name your events anything you like except for the reserved event names [in this list](https://github.com/SocketCluster/socketcluster-client/blob/416982105e86494e4f6b12f0244b67b702618588/lib/scsocket.js#L56-L71) - These have special meaning within SC.
If you have a lot of different events in your system, a good convention for naming events is to use a '.' in the format 'myNamespace.myEvent'.

You can also publish data to channels. By publishing to a channel, you can send data to multiple clients at once.
A client which is subscribed to a channel will receive all data published to that channel. Both clients and servers can
publish to a channel (provided that your middleware doesn't block them from doing so). Channels are intended primarily for client to client
communication but SC also offers a way to listen to channels from the server (but this is a topic for another tutorial).


In one of the server-side code snippets above, we are publishing to the 'pong' channel like this:

```js
// Server code
scServer.exchange.publish('pong', count);
```

Any client which is connected to SocketCluster and is subscribed and watching the 'pong' channel will receive the value of the count variable.
On the client, the code might look like this:

```js
// Client code
// New API as of SocketCluster v1.0.0.
var pongChannel = socket.subscribe('pong');

pongChannel.watch(function (count) {
  console.log('Client received data from pong channel:', count);
});
```

To unsubscribe from one or more channels:

```js
// Client code
socket.unsubscribe('pong');
```

As demonstrated earlier, you can publish to channels from the server side using scServer.exchange.publish(...). For convenience, SocketCluster also lets you publish to channels from the client side:

```js
// Client code
socket.publish('pong', 'This PONG event comes from a client');
```

Here we are passing a string as argument.
Note that you can also publish data directly on a channel object - The following snippet does exactly the same thing as the one above:

```js
// Client code
pongChannel.publish('This PONG event comes from a client');
```

Sometimes you may want to restrict read or write access to certain channels by certain individuals - For this purpose,
SC lets you define middleware functions. To find out more about this, you should read the guide on middleware and authorization.

### Summary

The socket.emit(event, data) function allows you to send messages between 1 client socket and 1 matching server socket (1 client socket &#8644; 1 server socket &mdash; One to one communication between client and server).

The socket.publish(event, data) and channel.publish(data) functions allow you to send group messages between multiple client sockets (n client sockets &#8644; n client sockets - Many to many communication directly between clients). As shown earlier, you can also call publish from the server using the exchange object:

```js
// Server code
scServer.exchange.publish('foo', 123);
```

You can also use publish for one to one communication between two clients but you should setup some middleware to make sure that only the two authorized clients can share the same channel (see guide on middleware and authorization for more details).

### Videos by Nick Kotenberg

* [007 Socketcluster Server/Client Communication Basic](https://www.youtube.com/watch?v=ERh0utlP2go&list=PLTxFJWe_410zNJJD0o8njNLv7HidG1CHq&index=8)
* [008 Server/Client Data 1](https://www.youtube.com/watch?v=ODtHFFsUpW4&list=PLTxFJWe_410zNJJD0o8njNLv7HidG1CHq&index=9)
* [009 Server/Client Data 2](https://www.youtube.com/watch?v=hEpcA_gOjvM&list=PLTxFJWe_410zNJJD0o8njNLv7HidG1CHq&index=10)
* [010 Databases and SC 101](https://www.youtube.com/watch?v=3KN1JmWuGt0)
* [011 Server to Server Communication](https://www.youtube.com/watch?v=gY1UzULGLW0&list=PLTxFJWe_410zNJJD0o8njNLv7HidG1CHq&index=12)