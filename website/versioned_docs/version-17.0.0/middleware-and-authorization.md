---
id: version-17.0.0-middleware-and-authorization
title: Middleware and authorization
sidebar_label: Middleware and authorization
original_id: middleware-and-authorization
---

## Feature overview

SocketCluster allows you to perform access control from the server side using middleware functions.
Middleware functions in SocketCluster v15+ work by iterating over [asyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#Iterating_over_async_iterables) streams; the advantage of this approach is that performing async operations directly inside a middleware loop will not disrupt the order of messages (e.g. if async operations for some messages take longer than others). This means that it's possible to guarantee that actions and messages will always be processed by your receivers/procedures in the same order that they were sent by the client socket.

## API overview

In SocketCluster v15, unlike previous versions, you can only register a single function using the `agServer.setMiddleware(...)` method.
Another major difference from previous versions is that each middleware line in v15+ can support multiple types of actions. In order to make decisions about which specific actions should be allowed to pass and which should be blocked, it's important to check the `action.type` property first.

### Register middleware functions

SocketCluster v15 supports 4 different middleware lines which allow you to block, delay or preprocess specific actions. Middleware functions in v15+ work differently from those in previous versions. In v15+, a middleware function can handle multiple different types of actions (represented by an `AGAction` instance which has a `type` property).

This is how to setup a middleware (this example shows the `MIDDLEWARE_INBOUND` line handling `TRANSMIT` and `INVOKE` actions):

```js
agServer.setMiddleware(agServer.MIDDLEWARE_INBOUND, async (middlewareStream) => {
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
});
```

!! In SocketCluster v15+, you can only have one middleware function for each middleware line.

The following middleware lines are supported:

| Middleware type | Description |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `agServer.MIDDLEWARE_HANDSHAKE` | The `for-await-of` loop for this middleware line iterates whenever a socket handshake occurs. The `action.type` property can be either `AGAction.HANDSHAKE_WS` or `AGAction.HANDSHAKE_SC`. |
| `agServer.MIDDLEWARE_INBOUND_RAW` | The `for-await-of` loop iterates whenever an inbound message (I.e. from client -> server) is received by the server. This includes all raw messages and operations; including those which are not recognized by SocketCluster. The `action.type` property will always be `AGAction.MESSAGE`. |
| `agServer.MIDDLEWARE_INBOUND` | The `for-await-of` loop iterates whenever an inbound operation (I.e. a recognized operation from client -> server) occurs. The `action.type` property can be `AGAction.TRANSMIT`, `AGAction.INVOKE`, `AGAction.SUBSCRIBE`, `AGAction.PUBLISH_IN` or `AGAction.AUTHENTICATE`. |
| `agServer.MIDDLEWARE_OUTBOUND` | The `for-await-of` loop iterates whenever an outbound operation (I.e. server -> client) occurs. The `action.type` property will always be `AGAction.PUBLISH_OUT`. |

Each `action` object (`AGAction`) which is streamed through the middleware has different properties depending on its `type` property. These are the properties supported by different action types:

| Action type | Available properties |
|-------------------------|------------------------------------------------------|
| `AGAction.HANDSHAKE_WS` | `type`, `request` |
| `AGAction.HANDSHAKE_SC` | `type`, `request`, `socket`, `data` |
| `AGAction.MESSAGE` | `type`, `socket`, `data` |
| `AGAction.TRANSMIT` | `type`, `socket`, `receiver`, `data` |
| `AGAction.INVOKE` | `type`, `socket`, `procedure`, `data` |
| `AGAction.SUBSCRIBE` | `type`, `socket`, `channel`, `data` |
| `AGAction.PUBLISH_IN` | `type`, `socket`, `channel`, `data` |
| `AGAction.PUBLISH_OUT` | `type`, `socket`, `channel`, `data` |
| `AGAction.AUTHENTICATE` | `type`, `socket`, `signedAuthToken`, `authToken` |

^ In all of the above cases, `type` is a string, `channel` is a string, `request` is a Node.js [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object, `socket` is an `AGServerSocket` object, `receiver` is a string, `procedure` is a string, `signedAuthToken` is a string (or null), `authToken` is an object (or null) and `data` can be of any type (depending on what is provided by the client).

!! Middlewares are applied on a per-socket basis. So delaying an action in a middleware will only create back pressure for a single socket and not affect other concurrent sockets.
