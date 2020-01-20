---
id: api-ag-server
title: AGServer
sidebar_label: AGServer
---

## Inherits from

[AsyncStreamEmitter](https://github.com/SocketCluster/async-stream-emitter#async-stream-emitter)

## Properties

<table>
  <tr>
    <td>exchange</td>
    <td>
      A client which lets you interact with pub/sub channels from the server side.
      (See API section on the <a href="/docs/api-ag-exchange">AGExchange</a> object for details).
    </td>
  </tr>
  <tr>
    <td>clients</td>
    <td>
      An object which holds all fully connected clients on the current server (only those which have completed the handshake).
      Keys are socket IDs and the values are <a href="/docs/api-ag-server-socket">AGServerSocket</a> instances.
    </td>
  </tr>
  <tr>
    <td>clientsCount</td>
    <td>
      The number of clients currently connected to this server.
    </td>
  </tr>
  <tr>
    <td>pendingClients</td>
    <td>
      An object which holds all pending clients on the current server.
      Keys are socket IDs and the values are <code>AGServerSocket</code> instances.
      Pending clients are those whose <code>socket.state</code> is 'connecting'; this means
      all sockets which are in the middle of the handshake phase.
      Once a socket completes its handshake, it will be removed from the <code>pendingClients</code> object
      and it will be added to the <code>clients</code> object.
    </td>
  </tr>
  <tr>
    <td>pendingClientsCount</td>
    <td>
      The number of pending clients currently connected to this server.
    </td>
  </tr>
  <tr>
    <td>sourcePort</td>
    <td>The public port on which clients connect to SocketCluster (e.g. 80 for
      HTTP).</td>
  </tr>
  <tr>
    <td>secure</td>
    <td>Whether or not this server uses SSL</td>
  </tr>
  <tr>
    <td>host</td>
    <td>The host name for this server</td>
  </tr>
  <tr>
    <td>ackTimeout</td>
    <td>
      The timeout in milliseconds in which clients have to receive a response to events
      which require acknowledgement. For example, when you call
      <code>socket.invoke(...)</code> or <code>socket.invokePublish(...)</code> on the client.
    </td>
  </tr>
</table>

## Events

<table>
  <tr>
    <td>'error'</td>
    <td>This gets triggered when fatal error occurs on this server. The object produced by the listener will have an <code>error</code> property.</td>
  </tr>
  <tr>
    <td>'warning'</td>
    <td>A warning is a non-fatal error which does not require restarting the server. <code>AGServerSocket</code> errors are emitted as warnings on the <code>AGServer</code> instance. The object produced by the listener will have a <code>warning</code> property.</td>
  </tr>
  <tr>
    <td>'handshake'</td>
    <td>
      Emitted as soon as a new <code>AGServerSocket</code> object is created on the server - This occurs at
      the beginning of the client handshake, before the 'connection' event.
      You should not try to send events to the socket while it is in this state. The object produced by the listener will have a <code>socket</code> property.
    </td>
  </tr>
  <tr>
    <td>'connectionAbort'</td>
    <td>
      Emitted whenever a socket becomes disconnected during the handshake phase. The object produced by the listener will have a <code>socket</code>, <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'connection'</td>
    <td>
      Emitted whenever a new socket connection is established with the server (and the handshake has completed). The object produced by the listener will have a <code>socket</code>, <code>id</code>, <code>pingTimeout</code> and <code>isAuthenticated</code> property. If an authentication error occured during the socket handshake phase, the event object will also have an <code>authError</code> property. The <code>socket</code> object of type <a href="/docs/api-ag-server-socket">AGServerSocket</a> and can be used to interact with the corresponding client.
    </td>
  </tr>
  <tr>
    <td>'disconnection'</td>
    <td>
      Emitted whenever a connected socket becomes disconnected (after the handshake phase). Note that if the socket connection was not fully established (e.g. during the SocketCluster handshake phase), then the <code>'connectionAbort'</code> event will be triggered instead. The object produced by the listener will have a <code>socket</code>, <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'closure'</td>
    <td>
      Emitted whenever a connected socket becomes disconnected (at any stage of the handshake/connection cycle). Note that this event is a catch-all for both <code>'disconnection'</code> and <code>'connectionAbort'</code> events. The object produced by the listener will have a <code>socket</code>, <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'subscription'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes subscribed to a channel. The object produced by the listener will have a <code>socket</code> (<code>AGServerSocket</code>), a <code>channel</code> and <code>channelOptions</code> property.
    </td>
  </tr>
  <tr>
    <td>'unsubscription'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes unsubscribed from a channel. The object produced by the listener will have a <code>socket</code> and <code>channel</code> property.
    </td>
  </tr>
  <tr>
    <td>'authentication'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes authenticated. The object produced by the listener will have a <code>socket</code> and <code>authToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'deauthentication'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes deauthenticated. The object produced by the listener will have a <code>socket</code> and <code>oldAuthToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'authenticationStateChange'</td>
    <td>
      Triggers whenever the <code>authState</code> of a socket which is attached to the server changes (e.g. transitions between authenticated and unauthenticated states). The object produced by the listener will have a <code>socket</code>, <code>oldAuthState</code> and <code>newAuthState</code> property.
    </td>
  </tr>
  <tr>
    <td>'badSocketAuthToken'</td>
    <td>
      Emitted when a client which is attached to the server tries to authenticate itself with an invalid (or expired) token.
      The object produced by the listener will have a <code>socket</code>, <code>authError</code> and <code>signedAuthToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'ready'</td>
    <td>
      Emitted when the server is ready to accept connections.
    </td>
  </tr>
</table>

## Methods

<table>
  <tr>
    <td>constructor(options)</td>
    <td>
      <p>
        Create the server instance (with config options).
        The options object can have any of the following properties (sample showing defaults):
      </p>

```js
{
// This can be the name of an npm module or a path to a
// Node.js module to use as the WebSocket server engine.
wsEngine: 'ws',

// Custom options to pass to the wsEngine when it is being
// instantiated.
wsEngineServerOptions: {},

// The key which SC will use to encrypt/decrypt authTokens,
// defaults to a 256 bits cryptographically random hex
// string. The default JWT algorithm used is 'HS256'.
// If you want to use RSA or ECDSA, you should provide an
// authPrivateKey and authPublicKey instead of authKey.
authKey: null,

// perMessageDeflate compression. Note that this option is
// passed directly to the wsEngine's Server object.
// So if you're using 'ws' as the engine, you can pass an
// object instead of a boolean.
// Note that by default, per-message deflate only kicks in
// for messages > 1024 bytes.
perMessageDeflate: false,

// If using an RSA or ECDSA algorithm to sign the
// authToken, you will need to provide an authPrivateKey
// and authPublicKey in PEM format (string or Buffer).
authPrivateKey: null,
authPublicKey: null,

// The default expiry for auth tokens in seconds
authDefaultExpiry: 86400,

// The algorithm to use to sign and verify JWT tokens.
authAlgorithm: 'HS256',

// Can be 1 or 2. Version 1 is for maximum backwards
// compatibility with SocketCluster clients.
protocolVersion: 2,

// In milliseconds - If the socket handshake hasn't been
// completed before this timeout is reached, the new
// connection attempt will be terminated.
handshakeTimeout: 10000,

// In milliseconds, the timeout for receiving a response
// when using invoke() or invokePublish().
ackTimeout: 10000,

// Origins which are allowed to connect to the server.
origins: '*:*',

// The maximum number of unique channels which a single
// socket can subscribe to.
socketChannelLimit: 1000,

// The interval in milliseconds on which to
// send a ping to the client to check that
// it is still alive.
pingInterval: 8000,

// How many milliseconds to wait without receiving a ping
// before closing the socket.
pingTimeout: 20000,

// Whether or not an error should be emitted on
// the socket whenever an action is blocked by a
// middleware function
middlewareEmitFailures: true,

// The URL path reserved by SocketCluster clients to
// interact with the server.
path: '/socketcluster/',

// Whether or not clients are allowed to publish messages
// to channels.
allowClientPublish: true,

// Whether or not to batch all socket messages
// for some time immediately after completing
// a handshake. This can be useful in failure-recovery
// scenarios (e.g. batch resubscribe).
batchOnHandshake: false,

// If batchOnHandshake is true, this lets you specify
// How long to enable batching (in milliseconds) following
// a successful socket handshake.
batchOnHandshakeDuration: 400,

// If batchOnHandshake is true, this lets you specify
// the size of each batch in milliseconds.
batchInterval: 50,

// Lets you specify the default cleanup behaviour for
// when a socket becomes disconnected.
// Can be either 'kill' or 'close'. Kill mode means
// that all of the socket's streams will be killed and
// so consumption will stop immediately.
// Close mode means that consumers on the socket will
// be able to finish processing their stream backlogs
// bebfore they are ended.
socketStreamCleanupMode: 'kill'
}
```
</td>
  </tr>
  <tr>
    <td>close()</td>
    <td>
      <p>
        Close the server and terminate all sockets.
      </p>
    </td>
  </tr>
  <tr>
    <td>setMiddleware(type, middlewareFn)</td>
    <td>
      Lets you set a middleware functions which can be used to manage client access control
      to various features of the AGServer. This is useful for monitoring
      real-time data flows and also to block access to restricted channels
      and resources. Note that only actions from clients pass through middleware.
      Server side calls on the <a href="/docs/api-ag-exchange">AGExchange</a> client such as <code>agServer.exchange.transmitPublish(...)</code> or <code>agServer.exchange.invokePublish(...)</code> do not. See <a href="/docs/middleware-and-authorization">Middleware and authorization</a> guide for a list of all available middleware types and actions.
    </td>
  </tr>
  <tr>
    <td>removeMiddleware(type, middlewareFn)</td>
    <td>
      <p>
        Lets you remove a middleware function which was previously added using the <code>setMiddleware(...)</code> method.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      listener(eventName)
    </td>
    <td>
      <p>
        This method returns an event listener stream for the specified <code>eventName</code>. This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> which can be consumed with a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for-await-of loop</a>.
      </p>
      <p>
        See <a href="/docs/basic-usage">basic usage guide</a> for examples of how to consume listener streams. For more advanced usage, see <a href="https://github.com/SocketCluster/stream-demux#usage">StreamDemux</a> (this is the library which SocketCluster uses to implement listener streams).
      </p>
    </td>
  </tr>
  <tr>
    <td>
      closeListener(eventName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>eventName</code> listener) to <code>break</code> after they have finished iterating over their current backlogs of events.
      This method is the recommended way to gracefully stop consuming events; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. In SocketCluster, the consumer always gets the last say. The consumer could choose to immediately resume consumption of the stream like this (note that no event will be missed):

```js
while (exitConditionIsNotMet) {
  for await (
    let {socket} of server.listener('connection')
  ) {
    // Consume event...
  }
}
```

</td>
  </tr>
  <tr>
    <td>
      closeAllListeners()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all listeners to <code>break</code> after they have finished consuming their respective backlogs of events.
    </td>
  </tr>
  <tr>
    <td>
      killListener(eventName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>eventName</code> listener to <code>break</code> immediately and will reset the backpressure for that listener to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllListeners()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all listeners to <code>break</code> immediately and will reset the aggregate backpressure for all listeners to 0.
    </td>
  </tr>
  <tr>
    <td style="word-break: break-all;">
      getAllListenersBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the server's event listener streams.
    </td>
  </tr>
  <tr>
    <td style="word-break: break-all;">
      getListenerBackpressure(eventName)
    </td>
    <td>
      Get the aggregate backpressure for the <code>eventName</code> listener stream on the server instance. The aggregate backpressure represents the highest backpressure of all consumers for that listener.
    </td>
  </tr>
</table>

## Stream management methods

These methods should only be used for advanced use cases when you need more control over stream management; for example, when you want to <code>break</code> out of a specific consumer loop without affecting any other consumer.
These methods can also be useful to check that consumers are being cleaned up properly and to selectively kill specific consumers which are causing backpressure to build up.
For most use cases, you should try to stick to the methods in the table above as it will lead to cleaner logic.

<table>
  <tr>
    <td>
      getListenerConsumerStatsList(eventName)
    </td>
    <td>
      Get the list of consumers which are consuming data from the specified event listener. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming data from any listener on the server. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killListenerConsumer(consumerId)
    </td>
    <td>
      This will cause the target listener consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
</table>
