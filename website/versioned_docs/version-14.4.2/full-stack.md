---
id: version-14.4.2-full-stack
title: Full stack pub/sub with SocketCluster
sidebar_label: Full stack pub/sub with SocketCluster
original_id: full-stack
---

In addition to Socket.io style emit/on functionality, SocketCluster also lets you interact with pub/sub channels from either the client or the server using JavaScript (Node.js on the server).
By defining middleware functions, SC gives you complete control over your real-time data. Middleware can be used to block clients from subscribing and
publishing to particular channels but they can also be used to transform your real-time streams (on the backend) before they reach other clients.

To subscribe to a 'physics' channel on the client-side, all you need to do is this:

```js
var physChannel = socket.subscribe('physics');

physChannel.watch(function (data) {...});
```

To send messages to the physics room; you would just call:

```js
socket.publish('physics', messageData);
```

... or

```js
physChannel.publish(messageData);
```

Note that channels don't have to be shared by multiple users - You could setup channels for individual users. For example, the user with username 'bob123' could subscribe and watch the channel 'bob123' - That way if any other user that wants to send some data to bob123, they can simply call:

```js
socket.publish('bob123', {from: 'alice456', message: 'Hi Bob!'});
```

By default, SC allows anyone to subscribe and publish to any channel they want - It lets you specify middleware on the server to allow or block specific users from subscribing, publishing or emitting certain events. Examples:

```js
scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (req, next) {
  // ...
  if (...) {
    next(); // Allow
  } else {
    next(req.socket.id + ' is not allowed to subscribe to ' + req.channel); // Block
  }
});
```

```js
scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (req, next) {
  // ...
  if (...) {
    next(); // Allow
  } else {
    next(req.socket.id + ' is not allowed to publish to the ' + req.channel + ' channel'); // Block
  }
});
```

```js
scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
  // ...
  if (...) {
    next(); // Allow
  } else {
    next(req.socket.id + ' is not allowed to emit the ' + req.event + ' req.event'); // Block
  }
});
```

SocketCluster also exposes an Exchange object on the server-side (scServer.exchange) through which you can publish events to clients:

```js
scServer.exchange.publish(eventName, data, cb);
```

An emitted event is only sent to the other side of the socket (I.e. server &#8594; client or client &#8594; server); on the other hand, data published to a channel will be sent to all subscribed client sockets (and nobody else!).

To subscribe a client socket to a channel, you just use:

```js
var channelObject = socket.subscribe(channelName);
```

Then, to handle incoming channel data, you just use:

```js
channelObject.watch(handlerFn);
```

Note that subscription requests will have to pass through the SUBSCRIBE middleware before the client can receive channel events.

## Design Patterns

If you need a high-level overview of some patterns to follow when using SocketCluster, you may want to read [SocketCluster Design Patterns for Chat](https://jonathangrosdubois.medium.com/socketcluster-design-patterns-for-chat-69e76a4b1966).
