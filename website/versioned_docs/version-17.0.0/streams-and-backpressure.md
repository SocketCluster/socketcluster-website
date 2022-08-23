---
id: version-17.0.0-streams-and-backpressure
title: Streams and backpressure
sidebar_label: Streams and backpressure
original_id: streams-and-backpressure
---

## Feature overview

SocketCluster lets you to consume data and events by iterating over asynchrounous streams.
The socket object (`AGServerSocket`) is composed of the following main streams (and substreams):

- Inbound stream
  - Inbound middleware stream
  - Receiver stream
  - Procedure stream
- Outbound stream
  - Outbound middleware stream
- Listener stream

The inbound stream represents a stream of all inbound messages from a remote client socket.
The outbound stream, on the other hand, represents a stream of all outbound messages which are about to be sent to the client socket.
The listener stream represents a stream of all events which are triggered on the socket. The 'disconnect', 'close', 'subscribe', 'message' and all other socket events pass through the same listener stream so awaiting on one event can delay other events. Any object which inherits from `AsyncStreamEmitter` shares the same interface for consuming and managing listener streams. `AGServer`, `AGServerSocket`, `AGClientSocket` and `AGChannel` all expose the same methods for managing listeners.

Messages, events and data which pass through a stream always flow in-order by default.
This feature allows us to perform async/await operations at any point in the stream without disrupting the order of messages; this makes our asynchronous logic a lot more predictable than what could otherwise be achieved using regular event listeners.

A side effect of this feature is that whenever we interrupt a stream's flow using `await`, new data/messages can start to build up in the stream's buffer.
This buildup of data/messages within a stream is called backpressure.

Because a stream in SocketCluster can have multiple loops (aka consumers) iterating over it, and because each loop can consume data from the stream at a different rate, the slowest consumer will determine the backpressure of the stream.

Some backpressure is OK, but too much backpressure can lead to the following problems:

- Increased message latency because data may spend more time waiting in the stream's buffer.
- It can be exploited by malicious clients to carry out DoS attacks against the server by intentionally filling up the server's memory with spam messages faster than they can be consumed.

For these reasons, SocketCluster exposes a simple API for tracking stream backpressure and it lets you immediately kill streams or groups of streams which are becoming overly congested. SocketCluster lets you measure the backpressure of individual streams within a socket and also the aggregate backpressure of all streams within the socket.

## API overview

Note that this section only documents the most important/common methods for managing backpressure.
The full API offers more granularity/flexibility when it comes to measuring and closing/killing specific streams.
For the full API, please see the API docs for the relevant class.

### Measure socket backpressure

```js
// This will get the aggregate/max backpressure of the socket.
// It accounts for all inbound (middlewares, receivers and procedures),
// outbound (middlewares) and listener backpressure caused by
// all consumers of the socket object.
socket.getBackpressure();

// This will get the aggregate backpressure of all listeners on the socket.
socket.getAllListenersBackpressure();

// This will get the aggregate backpressure of all receivers on the socket.
socket.getAllReceiversBackpressure();

// This will get the aggregate backpressure of all procedures on the socket.
socket.getAllProceduresBackpressure();
```

!! The `socket.getBackpressure()` function is very important because it can be used to quickly identify if a client is trying to overload the server socket with actions/messages. If a socket builds up too much backpressure, you should `socket.disconnect()` it. By default, disconnecting a socket will cause all of its streams to be killed immediately and therefore drop the backpressure on that socket to 0. One of the best places to measure backpressure is inside the `MIDDLEWARE_INBOUND_RAW` middleware because all inbound actions and messages from the client socket pass through that middleware stream.

Because client sockets also handle channels, they expose an additional method for monitoring aggregate channel backpressure on the client:

```js
// This method is only available on the client socket.
socket.getAllChannelsBackpressure();
```

!! If you create channels on the server side (e.g. using `agServer.exchange.subscribe('myChannel')`), you can track the aggregate channel backpressure on the `agServer.exchange` client using the same method: `agServer.exchange.getAllChannelsBackpressure()`.

### Measure channel (AGChannel) backpressure

The `AGChannel` class is used on both the client and server side, therefore, channels have the same API everywhere.

```js
// This will get the aggregate backpressure of the channel which accounts for all output
// and listener backpressure caused by all consumers of the channel object.
fooChannel.getBackpressure();

// This will get the aggregate backpressure of all listeners on the channel.
fooChannel.getAllListenersBackpressure();

// This will get the aggregate backpressure of the channel's output stream.
fooChannel.getOutputBackpressure();
```

!! If backpressure for a specific channel gets too high, you can quickly kill that channel and all its listeners using `fooChannel.kill()`. The `fooChannel.close()` method is similar except that it will allow current pending data and events to finish processing before closing consumers.

### Measure agServer (AGServer) backpressure

When consuming an event/listener stream (using a `for-await-of` loop) from the `agServer` instance, you should avoid blocking that stream directly with `await` statements because this can cause backpressure to build up on the `agServer`. For most use cases, you should aim to keep the `agServer` backpressure at 0 at all times - You should use async IIFEs `(async () => { /* Code goes here */ })()` to ensure that your `await` statements do not block the event stream.

There may be unusual cases (e.g. with the server operating in a trusted private network environment and only exposed to trusted clients) where it may be desirable to process a `'connection'` listener stream sequentially (for example to accept and fully initialize new socket connections one at a time on the back end) but this approach is not recommended for typical user-facing scenarios as it would make the server vulnerable to DoS attacks since connections are likely to pile up and increase the backpressure on the `agServer` instance.

If you do not `await` directly on listeners of the `agServer` instance, then you do not need to monitor backpressure on the `agServer` instance at all (since it will always be 0). If you do, however, you can use this method to get the total listeners backpressure on the `agServer` instance:

```js
agServer.getAllListenersBackpressure();
```

!! The best place to measure this backpressure is usually in the `MIDDLEWARE_HANDSHAKE` middleware since this middleware stream will iterate once before each socket connection.
