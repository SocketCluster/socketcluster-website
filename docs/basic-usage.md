---
id: basic-usage
title: Basic usage
sidebar_label: Basic usage
---

## API overview

### [Server] Listen for inbound socket connections

Inside `server.js`, you can find the `for-await-of` loop which is handling inbound connections. It should look like this:

```js
// --- in server.js ---

// SocketCluster/WebSocket connection handling loop.
(async () => {
  for await (let {socket} of agServer.listener('connection')) {
    // Handle socket connection.
  }
})();
```

### [Client] Connect to the server

Inside `public/index.html`, a client connects to the server like this:

```js
// --- in public/index.html ---

let socket = socketClusterClient.create();
```

^ If the connection succeeds, this will cause the `connection` loop on the server side to iterate once.

!! You can pass an `options` object to the `socketClusterClient.create(...)` function.

### [Server] Listen for inbound messages on a socket

You can use a `socket.receiver(...)` within a `for-await-of` loop to handle messages on a socket:

```js
// --- in server.js ---

// SocketCluster/WebSocket connection handling loop.
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // Set up a loop to handle remote transmitted events.
      for await (let data of socket.receiver('customRemoteEvent')) {
        // ...
      }
    })();

  }
})();
```

!! You can also iterate over a `socket.receiver(receiverName)` stream on a client socket using the same syntax.

### [Client] transmit messages through a socket

```js
// --- in public/index.html ---

// ... After the socket is created.
socket.transmit('customRemoteEvent', 123);
```

^ If the message reaches the server, this will cause the `customRemoteEvent` loop on the server side to iterate once; `data` will be `123`.

!! You can also use the same syntax to transmit from the server socket. Transmit can never fail, so you don’t need to wrap it in a `try-catch` block.

### [Server] Listen for inbound RPCs on a socket

Unlike messages, RPCs expect a response from the other side.
You can use a `socket.procedure(...)` within a `for-await-of` loop to handle RPCs on a socket:

```js
// --- in server.js ---

// SocketCluster/WebSocket connection handling loop.
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // Set up a loop to handle and respond to RPCs.
      for await (let request of socket.procedure('customProc')) {
        if (request.data && request.data.bad) {
          let badCustomError = new Error('Server failed to execute the procedure');
          badCustomError.name = 'BadCustomError';
          request.error(badCustomError);

          continue;
        }
        request.end('Success');
      }
    })();

  }
})();
```

!! You can also iterate over a `socket.procedure(procedureName)` stream on a client socket using the same syntax.

### [Client] Invoke RPCs through a socket

```js
// --- in public/index.html ---

// ... After the socket is created.
(async () => {
  let result = await socket.invoke('customProc', {foo: 'bar'});
  // result will be 'Success'
})();
```

!! You should always add a `try-catch` block around the `socket.invoke(...)` call to capture async errors:

```js
// --- in public/index.html ---

// ... After the socket is created.
(async () => {
  let result;
  try {
    result = await socket.invoke('customProc', {bad: true});
  } catch (error) {
    // error will throw.
    // error.name will be 'BadCustomError'.
  }
})();
```

!! You can also use the same syntax on server sockets.

### [Client] Subscribe to a channel and watch for messages

```js
(async () => {
  let channel = socket.subscribe('foo');
  for await (let data of channel) {
    // ... Handle channel data.
  }
})();
```

### [Client] Publish to a channel without waiting for acknowledgement

```js
// Publish data; do not wait for an acknowledgement from the server.
socket.transmitPublish('foo', 'This is some data');
```

!! You can also call `transmitPublish` on an `AGChannel` object; in this case, you should omit the first argument, for example:

```js
let fooChannel = socket.channel('foo');
fooChannel.transmitPublish('This is some data');
```

### [Client] Publish to a channel and wait for acknowledgement

```js
(async () => {
  try {
    // Publish data; wait for an acknowledgement from the server.
    await socket.invokePublish('foo', 'This is some more data');
  } catch (error) {
    // ... Handle potential error if server does not acknowledge before timeout.
  }
})();
```

!! You can also call `invokePublish` on an `AGChannel` object; in this case, you should omit the first argument, for example:

```js
(async () => {
  let fooChannel = socket.channel('foo');
  try {
    // Publish data; wait for an acknowledgement from the server.
    await fooChannel.invokePublish('This is some more data');
  } catch (error) {
    // ... Handle potential error if server does not acknowledge before timeout.
  }
})();
```

### [Server] Publish to a channel without waiting for acknowledgement

```js
// Publish data; do not wait for an acknowledgement from the back end broker.
agServer.exchange.transmitPublish('foo', 'This is some data');
```

### [Server] Publish to a channel and wait for acknowledgement

```js
(async () => {
  try {
    // Publish data; wait for an acknowledgement from the back end broker (if it exists).
    await agServer.exchange.invokePublish('foo', 'This is some more data');
  } catch (error) {
    // ... Handle potential error if broker does not acknowledge before timeout.
  }
})();
```

---

## External documentation

- https://github.com/SocketCluster/socketcluster
- https://github.com/SocketCluster/socketcluster-server
- https://github.com/SocketCluster/socketcluster-client
- https://socketcluster.io/
