---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

## Requirements

- Node.js v10 (can work with older versions but you won't be able to use the `for-await-of` loop to consume streams). [Download Node.js](https://nodejs.org/en/).

### Optional dependencies

- `docker` CLI for containerization. [Install Docker](https://docs.docker.com/install/).
- `kubectl` CLI for deployment. [Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

---

## CLI overview

### Install the CLI tool

The easiest way to get started with Asyngular is to install the CLI tool from npm (you may need to add `sudo` at the front of the command):

```bash
npm install -g asyngular
```

Use this command to check if the installation was successful:

```bash
asyngular --help
```

^ This should display a list of all available subcommands.

### Create an app

```bash
asyngular create myapp
```

^ This will create a new project directory called `myapp`.

### Start the app with Node.js

From inside your `myapp` directory, run:

```bash
node server
```

!! You can interact with the app by opening http://localhost:8000/ in your browser.

### Start the app with Docker

If you have `docker` installed, you can also run your Asyngular app inside a container on your local machine using the following shortcut command (make sure that `myapp/` is your working directory):

```bash
asyngular run
```

!! You can interact with the app by opening http://localhost:8000/ in your browser.

### Stop the app container

The app docker container runs in the background. To stop it, use:

```bash
asyngular stop
```

---

## API overview

### [Server] Listen for inbound socket connections

Inside `server.js`, you can find the `for-await-of` loop which is handling inbound connections. It should look like this:

```js
// --- in server.js ---

// Asyngular/WebSocket connection handling loop.
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

let socket = asyngularClient.create();
```

^ If the connection succeeds, this will cause the `connection` loop on the server side to iterate once.

!! You can pass an `options` object to the `asyngularClient.create(...)` function.

### [Server] Listen for inbound messages on a socket

You can use a `socket.receiver(...)` within a `for-await-of` loop to handle messages on a socket:

```js
// --- in server.js ---

// Asyngular/WebSocket connection handling loop.
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

// Asyngular/WebSocket connection handling loop.
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
// Publish data; do not wait for an acknowledgement from the back end broker (if there is one).
agServer.exchange.transmitPublish('foo', 'This is some data');
```

### [Server] Publish to a channel and wait for acknowledgement

```js
(async () => {
  try {
    // Publish data; wait for an acknowledgement from the back end broker (if there is one).
    await agServer.exchange.invokePublish('foo', 'This is some more data');
  } catch (error) {
    // ... Handle potential error if broker does not acknowledge before timeout.
  }
})();
```

### [Server] Register middleware functions

Asyngular supports 4 different middleware lines which allow you to block, delay or preprocess specific actions. Middleware functions in Asyngular work differently from those in SocketCluster. In Asyngular, a middleware function can handle multiple different types of actions (represented by an `AGAction` instance which has a `type` property).

This is how to setup a middleware (this example shows the `MIDDLEWARE_INBOUND` line handling `TRANSMIT` and `INVOKE` actions):

```js
agServer.setMiddleware(agServer.MIDDLEWARE_INBOUND,
  async (middlewareStream) => {
    for await (let action of middlewareStream) {
      if (action.type === action.TRANSMIT) {
        if (!action.data) {
          let error = new Error(
            'Transmit action must have a data object'
          );
          error.name = 'InvalidActionError';
          action.block(error);
          continue;
        }
      } else if (action.type === action.INVOKE) {
        if (!action.data) {
          let error = new Error(
            'Invoke action must have a data object'
          );
          error.name = 'InvalidActionError';
          action.block(error);
          continue;
        }
      }
      action.allow();
    }
  }
);
```

!! In Asyngular, you can only have one middleware function for each middleware line.

The following middleware lines are supported:

- `AGServer.MIDDLEWARE_HANDSHAKE`: The `for-await-of` loop for this middleware line iterates whenever a socket handshake occurs. The `action.type` property can be either `AGAction.HANDSHAKE_WS` or `AGAction.HANDSHAKE_AG`.
- `AGServer.MIDDLEWARE_INBOUND_RAW`: The `for-await-of` loop iterates whenever an inbound message (I.e. from client -> server) is received by the server. This includes all raw messages and operations; including those which are not recognized by Asyngular. The `action.type` property will always be `AGAction.MESSAGE`.
- `AGServer.MIDDLEWARE_INBOUND`: The `for-await-of` loop iterates whenever an inbound operation (I.e. a recognized operation from client -> server) occurs. The `action.type` property can be `AGAction.TRANSMIT`, `AGAction.INVOKE`, `AGAction.SUBSCRIBE`, `AGAction.PUBLISH_IN` or `AGAction.AUTHENTICATE`.
- `AGServer.MIDDLEWARE_OUTBOUND`: The `for-await-of` loop iterates whenever an outbound operation (I.e. server -> client) occurs. The `action.type` property will always be `AGAction.PUBLISH_OUT`.

Each `action` object (`AGAction`) which is streamed through the middleware has different properties depending on its `type` property. These are the properties supported by different action types:

- `AGAction.HANDSHAKE_WS`: `type` and `request` properties.
- `AGAction.HANDSHAKE_AG`: `type`, `request` and `socket` properties.
- `AGAction.MESSAGE`: `type`, `socket` and `data` properties.
- `AGAction.TRANSMIT`: `type`, `socket`, `receiver` and `data` properties.
- `AGAction.INVOKE`: `type`, `socket`, `procedure` and `data` properties.
- `AGAction.SUBSCRIBE`: `type`, `socket`, `channel` and `data` properties.
- `AGAction.PUBLISH_IN`: `type`, `socket`, `channel` and `data` properties.
- `AGAction.PUBLISH_OUT`: `type`, `socket`, `channel` and `data` properties.
- `AGAction.AUTHENTICATE`: `type`, `socket`, `signedAuthToken` and `authToken` properties.

^ In all of the above cases, `type` is a string, `channel` is a string, `request` is a Node.js [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object, `socket` is an `AGServerSocket` object, `receiver` is a string, `procedure` is a string, `signedAuthToken` is a string (or null), `authToken` is an object (or null) and `data` can be of any type (depending on what is provided by the client).

!! Middlewares are applied on a per-socket basis. So delaying an action in a middleware will only create back pressure for a single socket and not affect other concurrent sockets.

---

## Related documentation

- https://github.com/SocketCluster/asyngular
- https://github.com/SocketCluster/asyngular-server
- https://github.com/SocketCluster/asyngular-client
- https://socketcluster.io/
