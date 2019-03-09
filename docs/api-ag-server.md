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
      (See API section on the <a href="api-ag-exchange">AGExchange</a> object for details).
    </td>
  </tr>
  <tr>
    <td>clients</td>
    <td>
      An object which holds all fully connected clients on the current server (only those which have completed the handshake).
      Keys are socket IDs and the values are <a href="api-ag-server-socket">AGServerSocket</a> instances.
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
    <td>The public port on which clients connect to Asyngular (e.g. 80 for
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
    <td>This gets triggered when fatal error occurs on this server.</td>
  </tr>
  <tr>
    <td>'warning'</td>
    <td>A warning is a non-fatal error which does not require restarting the server. <code>AGServerSocket</code> errors are emitted as warnings on the <code>AGServer</code> instance.</td>
  </tr>
  <tr>
    <td>'handshake'</td>
    <td>
      Emitted as soon as a new <code>AGServerSocket</code> object is created on the server - This occurs at
      the beginning of the client handshake, before the 'connection' event.
      The object produced by the listener will contain the <code>socket</code> object which is performing the handshake.
      You should not try to send events to the socket while it is in this state.
    </td>
  </tr>
  <tr>
    <td>'connectionAbort'</td>
    <td>
      Emitted whenever a socket becomes disconnected during the handshake phase. The listener to this event
      receives a socket (<code>AGServerSocket</code>) object.
    </td>
  </tr>
  <tr>
    <td>'connection'</td>
    <td>
      Emitted whenever a new socket connection is established with the server (and the handshake has completed).
      The object produced by the listener will contain a <code>socket</code> (<code>AGServerSocket</code>) object which can be used
      to interact with the client.
    </td>
  </tr>
  <tr>
    <td>'disconnection'</td>
    <td>
      Emitted whenever a connected socket becomes disconnected (after the handshake phase). The listener to this event
      receives a socket (<code>AGServerSocket</code>) object. Note that if the socket connection was not fully established (e.g. during the Asyngular handshake phase), then the <code>'connectionAbort'</code> event will be triggered instead.
    </td>
  </tr>
  <tr>
    <td>'closure'</td>
    <td>
      Emitted whenever a connected socket becomes disconnected (at any stage of the handshake/connection cycle). The listener to this event
      receives a socket (<code>AGServerSocket</code>) object. Note that this event is a catch-all for both <code>'disconnection'</code> and <code>'connectionAbort'</code> events.
    </td>
  </tr>
  <tr>
    <td>'subscription'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes subscribed to a channel. The listener to this event
      will produce an object which contains a <code>socket</code> (<code>AGServerSocket</code>), a <code>channel</code> and a <code>channelOptions</code> property.
    </td>
  </tr>
  <tr>
    <td>'unsubscription'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes unsubscribed from a channel. The object produced listeners to this event
      will contain a <code>socket</code> (<code>AGServerSocket</code>) and a <code>channel</code> property.
    </td>
  </tr>
  <tr>
    <td>'authentication'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes authenticated. The listener to this event
      receives a socket (<code>AGServerSocket</code>) object as the first argument. The second argument is the <code>authToken</code> object.
    </td>
  </tr>
  <tr>
    <td>'deauthentication'</td>
    <td>
      Emitted whenever a socket connection which is attached to the server becomes deauthenticated. The listener to this event
      receives a socket (<code>AGServerSocket</code>) object as the first argument. The second argument is the old <code>authToken</code> object
      (before the deauthentication took place).
    </td>
  </tr>
  <tr>
    <td>'authenticationStateChange'</td>
    <td>
      Triggers whenever the <code>authState</code> of a socket which is attached to the server changes (e.g. transitions between authenticated and unauthenticated states).
    </td>
  </tr>
  <tr>
    <td>'badSocketAuthToken'</td>
    <td>
      Emitted when a client which is attached to the server tries to authenticate itself with an invalid (or expired) token.
      The first argument passed to the handler is the socket object which failed authentication. The second argument is
      an object with the properties <code>authError</code> and <code>signedAuthToken</code>.
      The authError is an error object and the <code>signedAuthToken</code> is the auth token which failed the verification step.
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
      Server side calls to <code>agServer.exchange.transmitPublish(...)</code> or <code>agServer.exchange.invokePublish(...)</code> do not. See <a href="middleware-and-authorization">Middleware and authorization</a> guide for a list of all available middleware types and actions.
    </td>
  </tr>
  <tr>
    <td>removeMiddleware(type, middlewareFn)</td>
    <td>
      <p>
        Lets you remove middleware functions previously added with the setMiddleware() method.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      listener(eventName)
    </td>
    <td>
      This method returns an event listener stream for the specified <code>eventName</code>. This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> which can be consumed with a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for-await-of loop</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeListener(eventName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>eventName</code> listener) to <code>break</code> after they have finished iterating over their current backlogs of events.
      This method is the recommended way to gracefully stop consuming events; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. In Asyngular, the consumer always gets the last say. The consumer could choose to immediately resume consumption of the stream like this (note that no event will be missed):

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
</table>
