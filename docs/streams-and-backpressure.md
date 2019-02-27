---
id: streams-and-backpressure
title: Streams and backpressure
sidebar_label: Streams and backpressure
---

# Streams and backpressure

Asyngular lets you to consume data and events by iterating over asynchrounous streams.
The socket object (AGServerSocket) is composed of the following independent streams (and substreams):

- Inbound stream
  - Inbound middleware stream
  - Receiver stream
  - Procedure stream
- Outbound stream
  - Outbound middleware stream
- Listener stream

The inbound stream represents a stream of all inbound messages which are received by the server socket from a client socket.
The outbound stream, on the other hand, represents a stream of all outbound messages which are about to be sent to the client socket.
The listener stream represents a stream of all events which are triggered on the socket. The 'disconnect', 'close', 'subscribe', 'message' and all other socket events pass through the same listener stream. Any object which inherits from `AsyncStreamEmitter` has its own listener stream.
`AGServer`, `AGServerSocket` and `AGClientSocket` all inherit from `AsyncStreamEmitter`.

Messages, events and data which pass through a stream always flow in-order.
This feature allows us to perform async/await operations at any point in the stream without disrupting the order of messages; this makes our asynchronous logic a lot more predictable than what could otherwise be achieved using regular event listeners.

A side effect of this feature is that whenever we interrupt a stream's flow using `await`, new data/messages can start to build up in the stream's buffer.
This buildup of data/messages within a stream is called backpressure.

Because a stream in Asyngular can have multiple loops (aka consumers) iterating over it, and because each loop can consume data from the stream at a different rate, the slowest consumer will determine the backpressure of the stream.

Some backpressure is OK, but too much backpressure can lead to the following problems:

- Increased message latency because data may spend more time waiting in the stream's buffer if there is a lot of backpressure.
- It can be exploited by malicious clients to carry out DoS attacks against the server by intentionally filling up the server's memory with spam messages.

For this reason, Asyngular exposes a simple API for tracking stream backpressure and it lets you immediately kill streams or groups of streams which are becoming overly congested.
Asyngular lets you measure the backpressure of individual streams within a socket and also the aggregate backpressure of all streams within the socket.
