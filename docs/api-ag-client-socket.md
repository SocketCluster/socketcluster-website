---
id: api-ag-client-socket
title: AGClientSocket
sidebar_label: AGClientSocket
---

### Inherits from

[AsyncStreamEmitter](https://github.com/SocketCluster/async-stream-emitter#async-stream-emitter)

### Properties

<table>
  <tr>
    <td>id</td>
    <td>The id of the socket connection. This is <code>null</code> initially and will change each time a new underlying connection is made.</td>
  </tr>
  <tr>
    <td>clientId</td>
    <td>The id of the client socket. This does not change between connections.</td>
  </tr>
  <tr>
    <td>state</td>
    <td>
      The current state of the socket as a string - Can be socket.CONNECTING, socket.OPEN or socket.CLOSED.
    </td>
  </tr>
  <tr>
    <td>pendingReconnect</td>
    <td>
      A boolean which indicates if the socket is about to be automatically reconnected.
    </td>
  </tr>
  <tr>
    <td>pendingReconnectTimeout</td>
    <td>
      The number of milliseconds until the next reconnection attempt is executed.
    </td>
  </tr>
  <tr>
    <td>connectAttempts</td>
    <td>
      The number of automatic connect/reconnect attempts which the socket has executed (including the current latest attempt).
    </td>
  </tr>
  <tr>
    <td>
      authState
    </td>
    <td>
      The last known authentication state of the socket as a string. Can be either 'authenticated' (socket.AUTHENTICATED) or 'unauthenticated' (socket.UNAUTHENTICATED).
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
     <td>
       signedAuthToken
     </td>
     <td>
       The signed auth token currently associated with the socket (encoded and signed in the JWT format). This property will be null if no token is associated with this socket.
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

### Events

<table>
  <tr>
    <td>'error'</td>
    <td>This gets triggered when an error occurs on this socket. Argument is the error object.</td>
  </tr>
  <tr>
    <td>'connect'</td>
    <td>
      <p>
        Emitted whenever the socket connects to the server (includes reconnections).
        The handler receives two arguments; the first is a status object in the form:
      </p>

```js
{
  // The socket's id
  id: 'RM11Szl-tPn7p1BhAAAA',

  // Whether or not the current socket is authenticated
  // with the server (has a valid auth token)
  isAuthenticated: true,

  // If the client has a token, but it was invalid, authError
  // will be a JavaScript object.
  authError: {name: 'errorName', message: 'errorMessage'}
}
```

The second argument is a callback function (<code>processSubscriptions</code>) which, when called, will send all pending channel subscriptions to the server (to start activating pending channels).
      Note that this <code>processSubscriptions</code> callback will only work if the client <code>socket.options.autoSubscribeOnConnect</code> option is set to <code>false</code>. See [Asyngular client API](api-asyngular-client.md).
    </td>
  </tr>
  <tr>
    <td>'disconnect'</td>
    <td>Happens when this socket becomes disconnected from the server.</td>
  </tr>
  <tr>
    <td>'connectAbort'</td>
    <td>Triggers when a new connection is aborted for whatever reason - This could be caused by a failure during the connection phase or it may be triggered intentionally by calling socket.disconnect() while the socket is connecting.</td>
  </tr>
  <tr>
    <td>'close'</td>
    <td>Triggers when a socket is disconnected or the connection is aborted - This is a catch-all event for both <code>'disconnect'</code> and <code>'connectAbort'</code>.</td>
  </tr>
  <tr>
    <td>'connecting'</td>
    <td>
      Triggers whenever the socket initiates a connection to the server - This includes reconnects.
      In order capture the very first 'connecting' event, you will need to set the initial <code>autoConnect</code> option
      to <code>false</code> when you create the socket with <code>asyngularClient.create(...)</code> - You will need to register the handler
      before you call <code>socket.connect()</code>.
    </td>
  </tr>
  <tr>
    <td>'raw'</td>
    <td>This gets triggered whenever the server socket on the other side calls socket.send(...).</td>
  </tr>
  <tr>
    <td>'kickOut'</td>
    <td>Occurs when this socket is kicked out of a particular channel by the backend. Arguments are (message, channelName).</td>
  </tr>
  <tr>
    <td>'subscribe'</td>
    <td>When the subscription succeeds.</td>
  </tr>
  <tr>
    <td>'subscribeFail'</td>
    <td>Happens when the subscription fails. The first argument passed to the handler will be the error which caused the subscription to fail.</td>
  </tr>
  <tr>
    <td>'unsubscribe'</td>
    <td>When the socket becomes unsubscribed from a channel.</td>
  </tr>
  <tr>
    <td>'authStateChange'</td>
    <td>
      Triggers whenever the client's authState changes between socket.AUTHENTICATED and socket.UNAUTHENTICATED states.
      The handler will receive as an argument an object which has at least two properties: <code>oldAuthState</code> and <code>newAuthState</code>.
      If <code>newAuthState</code> is 'authenticated', the argument to the handler will also have an additional <code>signedAuthToken</code> property which
      will be the base64 signed JWT auth token as a string and an <code>authToken</code> property which will represent the token as a plain Object.
    </td>
  </tr>
  <tr>
    <td>'subscribeStateChange'</td>
    <td>
      Triggers whenever a pub/sub channel's state transitions between 'pending', 'subscribed' and 'unsubscribed' states.
      The handler will receive as an argument an object which has three properties: channel, oldChannelState and newChannelState.
    </td>
  </tr>
  <tr>
    <td>'subscribeRequest'</td>
    <td>Emits the channel name when a `subscribe` action is invoked by the client.</td>
  </tr>
  <tr>
    <td>'authenticate'</td>
    <td>
      Triggers whenever the client is successfully authenticated by the server - The data argument passed along
      with this event is the base64 signed JWT auth token as a string.
    </td>
  </tr>
  <tr>
    <td>'deauthenticate'</td>
    <td>
      Triggers whenever the client becomes unauthenticated.
    </td>
  </tr>
  <tr>
    <td>'message'</td>
    <td>
      All data that arrives on this socket is emitted through this event as a string.
    </td>
  </tr>
</table>

### Errors

<p>
  For the list of all Asyngular errors (and their properties) <a href="https://github.com/SocketCluster/sc-errors/blob/master/index.js">see sc-errors</a>.
  To check the type of an error in Asyngular, you should use the <code>name</code> property of the error (do not use the instanceof statement).
  Errors which are sent to the client from the server will be dehydrated on the server and rehydrated on the client - As a result they will be cast
  to plain <code>Error</code> objects.
</p>

### Methods

<table>
  <tr>
    <td>
      connect()
    </td>
    <td>
      Connects/reconnects the client socket to its origin server.
    </td>
  </tr>
  <tr>
    <td>
      getState()
    </td>
    <td>
      Returns the state of the socket as a string constant.
      <ul>
        <li><b>'connecting'</b> - socket.CONNECTING</li>
        <li><b>'open'</b> - socket.OPEN</li>
        <li><b>'closed'</b> - socket.CLOSED</li>
      </ul>
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
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>eventName</code> listener) to <code>break</code> after they have finished iterating over the current backlog of events.
      This method is the recommended way to gracefully stop consuming events; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. In Asyngular, the consumer always gets the last say. The consumer could choose to immediately resume consumption of the stream like this (note that no event will be missed):

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
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>receiverName</code> receiver) to <code>break</code> after they have finished iterating over the current backlog of data.
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
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>procedureName</code> procedure) to <code>break</code> after they have finished iterating over the current backlog of data.
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
      disconnect([code, data])
    </td>
    <td>
      Disconnect this socket from the server.
      This function accepts two optional arguments:
      A custom error code (a Number - Ideally between 4100 to 4500) and data (which can be either reason message String or an Object).
    </td>
  </tr>
  <tr>
    <td>
      transmit(receiverName, data)
    </td>
    <td>
      Transmit the specified event to the corresponding server-side socket <code>receiver</code>. You can pass any JSON-compatible object as data.
      This method doesn't return anything and doesn't throw or reject.
    </td>
  </tr>
  <tr>
    <td>
      invoke(procedureName, data)
    </td>
    <td>
      Invoke the specified <code>procedure</code> (RPC) on the corresponding server-side socket. You can pass any JSON-compatible object as data. This method returns a <code>Promise</code>. Note that there is a default timeout of 10 seconds to receive a response from the server. You can change this limit by setting <code>ackTimeout</code> when instantiating the client. If the client does not receive a response in time, the returned <code>Promise</code> will reject with a <code>TimeoutError</code>.
    </td>
  </tr>
  <tr>
    <td>
      send(data, [options])
    </td>
    <td>
      Send some raw data to the server. This will trigger a 'raw' event on the server side which will carry the provided data.
    </td>
  </tr>
  <tr>
    <td>
      authenticate(encryptedTokenString)
    </td>
    <td>
      Perform client-initiated authentication - This is useful if you already have a valid encrypted auth token string and would like to use
      it to authenticate directly with the server (without having to ask the user for login details).
      Typically, you should perform server-initiated authentication using the socket.setAuthToken() method from the server side.
      This method is useful if, for example, you received the token from a different browser tab via localStorage and you want to immediately
      authenticate the current socket without having to reconnect the socket. It may also be useful if you're getting the token from a third-party
      JWT-based system and you're using the same authKey (see the <code>authKey</code> option passed to the <a href="api-ag-server">AGServer</a> constructor).
      This method returns a <code>Promise</code> which resolves on success and rejects with an <code>Error</code> on failure (e.g. if the token was invalid).
    </td>
  </tr>
  <tr>
    <td>
      deauthenticate()
    </td>
    <td>
      Perform client-initiated deauthentication - Deauthenticate (logout) the current socket.
    </td>
  </tr>
  <tr>
    <td>
      getBackpressure()
    </td>
    <td>
      Get the aggregate backpressure for all streams on the current socket. The aggregate backpressure represents the highest backpressure of all consumers.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>listener</code> streams on the current socket.
    </td>
  </tr>
  <tr>
    <td>
      getAllReceiversBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>receiver</code> streams on the current socket.
    </td>
  </tr>
  <tr>
    <td>
      getAllProceduresBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>procedure</code> streams on the current socket.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelsBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>channel</code> streams on the current socket.
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 20px; padding-bottom: 20px;">
      <i style="color: #999;">
        All of the following methods are related to pub/sub features of Asyngular.<br />
        Asyngular lets you interact with channels either directly through the socket or through
        <a href="api-ag-channel">AGChannel</a> objects.
      </i>
    </td>
  </tr>
  <tr>
    <td>
      transmitPublish(channelName, data)
    </td>
    <td>
      Publish data to the specified channelName. Do not expect a response from the server.
      The channelName argument must be a string.
      The data argument can be any JSON-compatible object/array or primitive.
    </td>
  </tr>
  <tr>
    <td>
      invokePublish(channelName, data)
    </td>
    <td>
      Publish data to the specified channelName. Expect a response from the server.
      The channelName argument must be a string.
      The data argument can be any JSON-compatible object/array or primitive.
      This method returns a <code>Promise</code> which will be rejected if the operation fails.
      For example, it can be rejected if the <code>MIDDLEWARE_INBOUND</code> middleware blocks the action on the server side.
      The promise will resolve once the server has processed the publish action.
    </td>
  </tr>
  <tr>
    <td>
      subscribe(channelName, [options])
    </td>
    <td>
      Subscribe to a particular channel.
      This function returns an <a href="api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> and lets you consume data that is published to the channel.
      You can provide an optional options object in the form <code>{waitForAuth: true, data: someCustomData}</code> (all properties are optional) - If <code>waitForAuth</code> is true, the channel will wait for the socket to become authenticated before trying to subscribe to the server - These kinds of channels are called "private channels" - Note that in this case, "authenticated" means that the client socket has received a valid JWT authToken - Read about the server-side <code>socket.setAuthToken(tokenData)</code> function <a href="authentication#websocket-flow">here</a> for more details. The <code>data</code> property can be used to pass data along with the subscription.

To consume a channel, it is recommended to use a `for-await-of` loop like this:

```js
for await (
  let data of socket.channel('myChannel')
) {
  // Consume channel data...
}
```
</td>
  </tr>
  <tr>
    <td>
      unsubscribe(channelName)
    </td>
    <td>
      Unsubscribe from the specified channel. This makes any associated <a href="api-ag-channel">AGChannel</a> object inactive.
      You can reactivate the <a href="api-ag-channel">AGChannel</a> object by calling subscribe(channelName) again at a later time.
    </td>
  </tr>
  <tr>
    <td>
      channel(channelName)
    </td>
    <td>
      Returns an <a href="api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a>.
      This method is different from subscribe() in that it will not try to subscribe to that channel.
      The returned channel will be inactive initially.
      You can call <code>channel.subscribe()</code> later to activate that channel when required.
    </td>
  </tr>
  <tr>
    <td>
      closeChannel(channelName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>channelName</code> channel and all of its listeners) to <code>break</code> after they have finished iterating over the current backlog of events.
      This method is the recommended way to gracefully stop consuming channel data; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. The consumer could choose to immediately resume consumption of the channel stream like this (note that no data will be missed):

```js
while (exitConditionIsNotMet) {
  for await (
    let data of socket.channel('myChannel')
  ) {
    // Consume channel data...
  }
}
```
</td>
  </tr>
  <tr>
    <td>
      channelCloseOutput(channelName)
    </td>
    <td>
      This method is like <code>closeChannel(channelName)</code> except that it only closes the main channel (output) stream. Listener consumers on the channel will not be affected.
    </td>
  </tr>
  <tr>
    <td>
      channelCloseAllListeners(channelName)
    </td>
    <td>
      This method is like <code>closeChannel(channelName)</code> except that it only closes listener streams on the channel. The main channel output stream will not be affected.
      To close specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="api-ag-channel">AGChannel API</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeAllChannels()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all channels (and all of their listeners) to <code>break</code> after they have finished consuming their respective backlogs of events.
    </td>
  </tr>
  <tr>
    <td>
      killChannel(channelName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>channelName</code> channel (and all of its listeners) to <code>break</code> immediately. This will reset the backpressure for that channel (and all of its event listeners) to 0.
    </td>
  </tr>
  <tr>
    <td>
      channelKillOutput(channelName)
    </td>
    <td>
      This method is like <code>killChannel(channelName)</code> except that it only kills the main channel (output) stream. Listener consumers on the channel will not be affected.
    </td>
  </tr>
  <tr>
    <td>
      channelKillAllListeners(channelName)
    </td>
    <td>
      This method is like <code>killChannel(channelName)</code> except that it only kills listener streams on the channel. The main channel output stream will not be affected.
      To kill specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="api-ag-channel">AGChannel API</a>.
    </td>
  </tr>
  <tr>
    <td>
      killAllChannels()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all channels (and all of of their listeners) to <code>break</code> immediately. This will reset the aggregate backpressure for all channels (and all of their event listeners) to 0.
    </td>
  </tr>
  <tr>
    <td>
      subscriptions(includePending)
    </td>
    <td>
      Returns an array of active channel subscriptions which this socket is bound to.
      If includePending is true, pending subscriptions will also be included in the list.
    </td>
  </tr>
  <tr>
    <td>
      isSubscribed(channelName, [includePending])
    </td>
    <td>
      Check if socket is subscribed to channelName.
      If includePending is true, pending subscriptions will also be included in the list.
    </td>
  </tr>
</table>
