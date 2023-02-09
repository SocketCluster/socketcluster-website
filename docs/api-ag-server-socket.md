---
id: api-ag-server-socket
title: AGServerSocket
sidebar_label: AGServerSocket
---

## Inherits from

[AsyncStreamEmitter](https://github.com/SocketCluster/async-stream-emitter#async-stream-emitter)

## Properties

<table>
  <tr>
    <td>id</td>
    <td>The socket id.</td>
  </tr>
  <tr>
    <td>request</td>
    <td>The Node.js HTTP request which initiated the AGServerSocket handshake - This object is useful for accessing HTTP headers (including cookies) which relate to the current socket.</td>
  </tr>
  <tr>
    <td>remoteAddress</td>
    <td>
      This socket's client IP address.
    </td>
  </tr>
  <tr>
    <td>state</td>
    <td>
      The current state of the socket as a string - Can be <code>socket.CONNECTING</code>, <code>socket.OPEN</code> or <code>socket.CLOSED</code>.
    </td>
  </tr>
  <tr>
    <td>
      authState
    </td>
    <td>
      The authentication state of the socket as a string. Can be either <code>socket.AUTHENTICATED</code> or <code>socket.UNAUTHENTICATED</code>.
    </td>
  </tr>
  <tr>
    <td>
      authToken
    </td>
    <td>
      The auth token (as a plain Object) currently associated with the socket. This property will be null if no token is associated with this socket.
    </td>
  </tr>
  <tr>
    <td>CONNECTING</td>
    <td><b>'connecting'</b> - A string constant which represents this socket's connecting state. See state property.</td>
  </tr>
  <tr>
    <td>OPEN</td>
    <td><b>'open'</b> - A string constant which represents this socket's open/connected state. See state property.</td>
  </tr>
  <tr>
    <td>CLOSED</td>
    <td><b>'closed'</b> - A string constant which represents this socket's closed state. See state property.</td>
  </tr>
  <tr>
    <td>AUTHENTICATED</td>
    <td><b>'authenticated'</b> - A string constant which represents this socket's authenticated authState.</td>
  </tr>
  <tr>
    <td>UNAUTHENTICATED</td>
    <td><b>'unauthenticated'</b> - A string constant which represents this socket's unauthenticated authState.</td>
  </tr>
</table>

## Events

<table>
  <tr>
    <td>'error'</td>
    <td>
      This gets triggered when an error occurs on this socket. The object produced by the listener will have an <code>error</code> property
    </td>
  </tr>
  <tr>
    <td>'raw'</td>
    <td>
      This gets triggered whenever the client socket on the other side calls <code>socket.send(...)</code>. The object produced by the listener will have a <code>message</code> property.
    </td>
  </tr>
  <tr>
    <td>'connect'</td>
    <td>
      Triggers when the socket completes the SocketCluster handshake phase and is fully connected.
      Note that if you capture a socket using the <code>agServer.listener('connection')</code> listener, then the socket-level 'connect' event will already have occurred by that point so you won't be able to capture it on the socket. The 'connect' event can only be handled from a socket which was captured from an <code>agServer.listener('handshake')</code> listener instead.
      The object produced by the listener will have an <code>id</code>, <code>pingTimeout</code> and <code>isAuthenticated</code> property. If an authentication error occured during the socket handshake phase, the event object will also have an <code>authError</code> property.
    </td>
  </tr>
  <tr>
    <td>'disconnect'</td>
    <td>
      Happens when the client becomes disconnected from the server. Note that if the socket becomes disconnected during the SocketCluster handshake stage,
      then the <code>'connectAbort'</code> event will be triggered instead. The object produced by the listener will have a <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'connectAbort'</td>
    <td>
      Happens when the client disconnects from the server before the SocketCluster handshake has completed (I.e. while <code>socket.state</code> was 'connecting').
      Note that the <code>'connectAbort'</code> event can only be triggered during the socket's handshake phase before the server's <code>'connection'</code> event is triggered.
      The object produced by the listener will have a <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'close'</td>
    <td>
      Happens when the client disconnects from the server at any stage of the handshake/connection cycle.
      Note that this event is a catch-all for both <code>'disconnect'</code> and <code>'connectAbort'</code> events.
      The object produced by the listener will have a <code>code</code> and <code>reason</code> property.
    </td>
  </tr>
  <tr>
    <td>'subscribe'</td>
    <td>Emitted when the matching client socket successfully subscribes to a channel. The object produced by the listener will have a <code>channel</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'unsubscribe'</td>
    <td>Occurs whenever the matching client socket unsubscribes from a channel - This includes automatic unsubscriptions triggered by disconnects. The object produced by the listener will have a <code>channel</code> property.</td>
  </tr>
  <tr>
    <td>'badAuthToken'</td>
    <td>
      Emitted when the client tries to authenticate itself with an invalid (or expired) token.
      Note that this event will typically be triggered as part of the socket handshake (before the socket is connected); therefore, it's generally
      better to listen for the <code>'badSocketAuthToken'</code> event directly on the server instance instead.
      The object produced by the listener will have an <code>authError</code> and <code>signedAuthToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'authenticate'</td>
    <td>
      Triggers whenever the client becomes authenticated. The object produced by the listener will have an <code>authToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'deauthenticate'</td>
    <td>
      Triggers whenever the client becomes unauthenticated. The object produced by the listener will have an <code>oldAuthToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'authStateChange'</td>
    <td>
      Triggers whenever the socket's <code>authState</code> changes (e.g. transitions between authenticated and unauthenticated states).
      The object produced by the listener will have an <code>oldAuthState</code> and <code>newAuthState</code> property.
    </td>
  </tr>
  <tr>
    <td>'message'</td>
    <td>
      All data that arrives on this socket is emitted through this event as a string. The object produced by the listener will have a <code>message</code> property.
    </td>
  </tr>
</table>

## Methods

<table>
  <tr>
    <td>disconnect([code, data])</td>
    <td>
      Disconnect this socket client.
      This function accepts two optional arguments:
      A custom error code (a Number - Ideally between 4100 to 4500) and data (which can be either reason message String or an Object).
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
    let event of socket.listener('message')
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
    <td>
      receiver(receiverName)
    </td>
    <td>
      This method returns a receiver stream for the specified <code>receiverName</code>. This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> which can be consumed with a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for-await-of loop</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeReceiver(receiverName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>receiverName</code> receiver) to <code>break</code> after they have finished iterating over their current backlogs of data.
      This method is the recommended way to gracefully stop consuming data from a receiver; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. The consumer could choose to immediately resume consumption of the stream like this (note that no data will be missed):

```js
while (exitConditionIsNotMet) {
  for await (
    let data of socket.receiver('foo')
  ) {
    // Consume data...
  }
}
```
</td>
  </tr>
  <tr>
    <td>
      closeAllReceivers()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all receivers to <code>break</code> after they have finished consuming their respective backlogs of data.
    </td>
  </tr>
  <tr>
    <td>
      killReceiver(receiverName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>receiverName</code> receiver to <code>break</code> immediately and will reset the backpressure for that receiver to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllReceivers()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all receivers to <code>break</code> immediately and will reset the aggregate backpressure for all receivers to 0.
    </td>
  </tr>
  <tr>
    <td>
      procedure(procedureName)
    </td>
    <td>
      This method returns a procedure stream for the specified <code>procedureName</code>. This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> which can be consumed with a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for-await-of loop</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeProcedure(procedureName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>procedureName</code> procedure) to <code>break</code> after they have finished iterating over their current backlogs of data.
      This method is the recommended way to gracefully stop consuming data from a procedure; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. The consumer could choose to immediately resume consumption of the stream like this (note that no data will be missed):

```js
while (exitConditionIsNotMet) {
  for await (
    let request of socket.procedure('myProc')
  ) {
    // Handle RPC request...
    if (request.data.foo) {
      let error = new Error('Foo error');
      error.name = 'FooError';
      // Send back an error.
      request.error(error);
    } else {
      // Success. Custom data can be passed
      // as an argument.
      request.end();
    }
  }
}
```
</td>
  </tr>
  <tr>
    <td>
      closeAllProcedures()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all procedures to <code>break</code> after they have finished consuming their respective backlogs of data.
    </td>
  </tr>
  <tr>
    <td>
      killProcedure(procedureName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>procedureName</code> procedure to <code>break</code> immediately and will reset the backpressure for that procedure to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllProcedures()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all procedures to <code>break</code> immediately and will reset the aggregate backpressure for all procedures to 0.
    </td>
  </tr>
  <tr>
    <td>
      transmit(receiverName, data)
    </td>
    <td>
      Transmit the specified event to the corresponding client side socket <code>receiver</code>. You can pass any JSON-compatible object as data.
      This method doesn't return anything and doesn't throw or reject.
    </td>
  </tr>
  <tr>
    <td>
      invoke(procedureName, data)
    </td>
    <td>
      Invoke the specified <code>procedure</code> (RPC) on the corresponding client side socket. You can pass any JSON-compatible object as data. This method returns a <code>Promise</code>. Note that there is a default timeout of 10 seconds to receive a response from the server. You can change this limit by setting <code>ackTimeout</code> when instantiating the client. If the client does not receive a response in time, the returned <code>Promise</code> will reject with a <code>TimeoutError</code>.
    </td>
  </tr>
  <tr>
    <td>
      send(data, [options]);
    </td>
    <td>
      Send some raw data to the client. This will trigger a 'raw' event on the client which will carry the provided data.
    </td>
  </tr>
  <tr>
    <td>setAuthToken(data, [options])</td>
    <td>
      <p>
        Authenticate the current socket's client by providing it some token data which you can use to validate their identity and/or access rights.
        Generally, you should call this method in response to a successful login attempt by the client (I.e. The client has provided
        a username and password combination which exists in your database).
      </p>
      <p>
        When you call this method, a JWT (token) containing the specified data will be created and attached to both the current server socket and the client socket on the other side of the connection.
        This method can be called multiple times to update the token with new data - Avoid modifying the socket.authToken property directly because otherwise, the change will not propagate to the client.
      </p>
      <p>
        In the simplest case, the data argument to this method would be an object in the form <code>{username: 'bob123'}</code>.
        For a more complex use case, you could also store a list of authorized channel names inside the token (that way, you will be able to check access privileges directly from the socket's token instead of having to read the database every time).
      <p>
        The optional <b>options</b> argument is an Object which can be used to modify the token's behavior - Valid properties include any
        option accepted by the node-jsonwebtoken library's sign method.
        <a href="https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback">See the list of options here</a>.
        Note that if you use a different algorithm than the default 'HS256', you may need to provide an authPrivateKey and authPublicKey instead of the default authKey.
        See <code>authKey</code>, <code>authPrivateKey</code> and <code>authPublicKey</code> options in <code>AGServer</code> constructor <a href="/docs/api-ag-server#methods">here</a>.
      </p>
      <p>
        Using auth tokens has the following advantages:
        <ul>
          <li>The user doesn't need to login again if their socket loses its connection - Works well with SocketCluster's auto-reconnect feature.</li>
          <li>
            An auth token is shared between sockets across multiple tabs in a browser (under the same domain name).
            If a user logs in on one tab, they will automatically be authenticated on any other tab that they have open.
            Tokens therefore allow you to attach a user's identity to multiple sockets.
          </li>
        </ul>
      </p>
    </td>
  </tr>
  <tr>
    <td>deauthenticate()</td>
    <td>
      Disassociate the current socket from its auth token.
      This method will also tell the client socket to remove the token from the browser's cookies.
      This is useful for logging out the user.
    </td>
  </tr>
  <tr>
    <td>kickOut([channel, message])</td>
    <td>
      Forcibly unsubscribe this socket from the specified channel. It's also possible to provide an array of channel names.
      All arguments are optional - If no channel name is provided, it will unsubscribe this socket from all channels.
      In addition, the client side of this socket will emit a 'kickOut' event to signify that it was kicked out of the channel. Note that this doesn't prevent the client from resubscribing to that channel later. You will need to update your middleware
      if you want to achieve this.
    </td>
  </tr>
  <tr>
    <td>
      subscriptions()
    </td>
    <td>
      Returns an array of active channel subscriptions which this socket's client is bound to.
    </td>
  </tr>
  <tr>
    <td>
      isSubscribed(channelName)
    </td>
    <td>
      Check if socket is subscribed to channelName.
    </td>
  </tr>
  <tr>
    <td>
      getBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for all streams associated with the socket.
    </td>
  </tr>
  <tr>
    <td>
      getInboundBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the socket's inbound stream.
    </td>
  </tr>
  <tr>
    <td>
      getOutboundBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the socket's outbound stream.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the socket's event listener streams.
    </td>
  </tr>
  <tr>
    <td>
      getListenerBackpressure(eventName)
    </td>
    <td>
      Get the aggregate backpressure for the <code>eventName</code> listener stream on the current socket. The aggregate backpressure represents the highest backpressure of all consumers for that listener.
    </td>
  </tr>
  <tr>
    <td>
      getAllReceiversBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the socket's receiver streams.
    </td>
  </tr>
  <tr>
    <td>
      getAllProceduresBackpressure()
    </td>
    <td>
      Returns the aggregate backpressure for the socket's procedure streams.
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
      Get the list of all consumers which are consuming data from any listener on the socket. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
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
  <tr>
    <td>
      getReceiverConsumerStatsList(receiverName)
    </td>
    <td>
      Get the list of consumers which are consuming data from the specified receiver. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllReceiversConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming data from all receivers on the socket. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killReceiverConsumer(consumerId)
    </td>
    <td>
      This will cause the target receiver consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
  <tr>
    <td>
      getProcedureConsumerStatsList(procedureName)
    </td>
    <td>
      Get the list of consumers which are consuming data from the specified procedure. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllProceduresConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming data from all procedures on the socket. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killProcedureConsumer(consumerId)
    </td>
    <td>
      This will cause the target procedure consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
</table>
