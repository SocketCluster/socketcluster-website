---
id: version-16.0.1-api-ag-client-socket
title: AGClientSocket
sidebar_label: AGClientSocket
original_id: api-ag-client-socket
---

## Inherits from

[AsyncStreamEmitter](https://github.com/SocketCluster/async-stream-emitter#async-stream-emitter)

## Properties

<table>
  <tr>
    <td>id</td>
    <td>The id of the socket connection. This is <code>null</code> initially and will change each time a new underlying connection is made.</td>
  </tr>
  <tr>
    <td>clientId</td>
    <td>The id of the socket client. This does not change between connections.</td>
  </tr>
  <tr>
    <td>state</td>
    <td>
      The current state of the socket as a string - Can be <code>socket.CONNECTING</code>, <code>socket.OPEN</code> or <code>socket.CLOSED</code>.
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
      The number of automatic connect/reconnect attempts which the socket has executed (including the current latest attempt). This value resets upon a successful connection.
    </td>
  </tr>
  <tr>
    <td>
      authState
    </td>
    <td>
      The last known authentication state of the socket as a string. Can be either 'authenticated' (<code>socket.AUTHENTICATED</code>) or 'unauthenticated' (<code>socket.UNAUTHENTICATED</code>).
    </td>
  </tr>
  <tr>
    <td>
       authToken
     </td>
     <td>
       The auth token (as a plain Object) currently associated with the socket. This property will be <code>null</code> if no token is associated with this socket.
     </td>
   </tr>
   <tr>
     <td>
       signedAuthToken
     </td>
     <td>
       The signed auth token currently associated with the socket (encoded and signed in the JWT format). This property will be <code>null</code> if no token is associated with this socket.
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
    <td>This gets triggered when an error occurs on this socket. The object produced by the listener will have an <code>error</code> property which contains an error object.</td>
  </tr>
  <tr>
    <td>'connect'</td>
    <td>
      <p>
        Emitted whenever the socket connects to the server (includes reconnections).
        The object produced by the listener will have an <code>id</code>, <code>isAuthenticated</code>, <code>authToken</code>, <code>pingTimeout</code> and <code>processPendingSubscriptions</code> property. If an issue occurred as part of the handshake, there will also be an <code>authError</code> property which will hold an error object.
      </p>
      <p>
        The <code>processPendingSubscriptions</code> property represents a callback function which, when called, will send all pending channel subscriptions to the server (to activate pending channels).
        Note that this <code>processPendingSubscriptions</code> callback will only work if the client <code>socket.options.autoSubscribeOnConnect</code> option is set to <code>false</code>. See <a href="/docs/api-socket-cluster-client">SocketCluster client API</a>.
      </p>
    </td>
  </tr>
  <tr>
    <td>'disconnect'</td>
    <td>Happens when this socket becomes disconnected from the server. The object produced by the listener will have a <code>code</code> and <code>reason</code> property.</td>
  </tr>
  <tr>
    <td>'connectAbort'</td>
    <td>Triggers when a new connection is aborted for whatever reason - This could be caused by a failure during the connection phase or it may be triggered intentionally by calling <code>socket.disconnect()</code> while the socket is connecting. The object produced by the listener will have a <code>code</code> and <code>reason</code> property.</td>
  </tr>
  <tr>
    <td>'close'</td>
    <td>Triggers when a socket is disconnected or the connection is aborted - This is a catch-all event for both <code>'disconnect'</code> and <code>'connectAbort'</code>. The object produced by the listener will have a <code>code</code> and <code>reason</code> property.</td>
  </tr>
  <tr>
    <td>'connecting'</td>
    <td>
      Triggers whenever the socket initiates a connection to the server - This includes reconnects.
      In order capture the very first 'connecting' event, you will need to set the initial <code>autoConnect</code> option
      to <code>false</code> when you create the socket with <code>socketClusterClient.create(...)</code> - You will need to register the handler
      before you call <code>socket.connect()</code>.
    </td>
  </tr>
  <tr>
    <td>'raw'</td>
    <td>This gets triggered whenever the server socket on the other side calls <code>socket.send(...)</code>. The object produced by the listener will have a <code>message</code> property.</td>
  </tr>
  <tr>
    <td>'kickOut'</td>
    <td>Occurs when this socket is kicked out of a channel by the backend. The object produced by the listener will have a <code>channel</code> and <code>message</code> property.</td>
  </tr>
  <tr>
    <td>'subscribe'</td>
    <td>When the subscription succeeds. The object produced by the listener will have a <code>channel</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'subscribeFail'</td>
    <td>Happens when the subscription fails. The object produced by the listener will have an <code>error</code>, <code>channel</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'unsubscribe'</td>
    <td>When the socket becomes unsubscribed from a channel. The object produced by the listener will have a <code>channel</code> property.</td>
  </tr>
  <tr>
    <td>'authStateChange'</td>
    <td>
      Triggers whenever the client's authState changes between <code>socket.AUTHENTICATED</code> and <code>socket.UNAUTHENTICATED</code> states.
      The object produced by the listener will have at least two properties: <code>oldAuthState</code> and <code>newAuthState</code>.
      If <code>newAuthState</code> is 'authenticated', the object will also have an additional <code>signedAuthToken</code> property which
      will be the base64 signed JWT auth token as a string and an <code>authToken</code> property which will represent the token as a plain Object.
    </td>
  </tr>
  <tr>
    <td>'subscribeStateChange'</td>
    <td>
      Triggers whenever a pub/sub channel's state transitions between 'pending', 'subscribed' and 'unsubscribed' states.
      The object produced by the listener will have a <code>channel</code>, <code>oldChannelState</code>, <code>newChannelState</code> and <code>subscriptionOptions</code> property.
    </td>
  </tr>
  <tr>
    <td>'subscribeRequest'</td>
    <td>
      Emits the channel name when a subscribe action is invoked by the client. The object produced by the listener will have a <code>channel</code> and <code>subscriptionOptions</code> property.
    </td>
  </tr>
  <tr>
    <td>'authenticate'</td>
    <td>
      Triggers whenever the client is successfully authenticated by the server.
      The object produced by the listener will have a <code>signedAuthToken</code> and <code>authToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'deauthenticate'</td>
    <td>
      Triggers whenever the client becomes unauthenticated.
      The object produced by the listener will have a <code>oldSignedAuthToken</code> and <code>oldAuthToken</code> property.
    </td>
  </tr>
  <tr>
    <td>'message'</td>
    <td>
      All data that arrives on this socket is emitted through this event as a string.
      The object produced by the listener will have a <code>message</code> property.
    </td>
  </tr>
</table>

## Errors

<p>
  For the list of all SocketCluster errors (and their properties) <a href="https://github.com/SocketCluster/sc-errors/blob/master/index.js">see sc-errors</a>.
  To check the type of an error in SocketCluster, you should use the <code>name</code> property of the error (do not use the <code>instanceof</code> statement).
  Errors which are sent to the client from the server will be dehydrated on the server and rehydrated on the client - As a result, they will be cast
  to plain <code>Error</code> objects.
</p>

## Methods

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
      Transmit the specified event to the corresponding server side socket <code>receiver</code>. You can pass any JSON-compatible object as data.
      This method doesn't return anything and doesn't throw or reject.
    </td>
  </tr>
  <tr>
    <td>
      invoke(procedureName, data)
    </td>
    <td>
      Invoke the specified <code>procedure</code> (RPC) on the corresponding server side socket. You can pass any JSON-compatible object as data. This method returns a <code>Promise</code>. Note that there is a default timeout of 10 seconds to receive a response from the server. You can change this limit by setting <code>ackTimeout</code> when instantiating the client. If the client does not receive a response in time, the returned <code>Promise</code> will reject with a <code>TimeoutError</code>.
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
      JWT-based system and you're using the same authKey (see the <code>authKey</code> option passed to the <a href="/docs/api-ag-server">AGServer</a> constructor).
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
        All of the following methods are related to pub/sub features of SocketCluster.<br />
        SocketCluster lets you interact with channels either directly through the socket or through
        <a href="/docs/api-ag-channel">AGChannel</a> objects.
      </i>
    </td>
  </tr>
  <tr>
    <td>
      transmitPublish(channelName, data)
    </td>
    <td>
      Publish data to the specified <code>channelName</code>. Do not expect a response from the server.
      The <code>channelName</code> argument must be a string.
      The <code>data</code> argument can be any JSON-compatible object/array or primitive.
    </td>
  </tr>
  <tr>
    <td>
      invokePublish(channelName, data)
    </td>
    <td>
      Publish data to the specified <code>channelName</code>. Expect a response from the server.
      The <code>channelName</code> argument must be a string.
      The <code>data</code> argument can be any JSON-compatible object/array or primitive.
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
      Subscribe to a channel.
      This function returns an <a href="/docs/api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> and lets you consume data that is published to the channel.
      You can provide an optional <code>options</code> object in the form <code>{waitForAuth: true, data: someCustomData}</code> (all properties are optional) - If <code>waitForAuth</code> is true, the channel will wait for the socket to become authenticated before trying to subscribe to the server - These kinds of channels are called "private channels" - Note that in this case, "authenticated" means that the client socket has received a valid JWT authToken - Read about the server side <code>socket.setAuthToken(tokenData)</code> function <a href="/docs/authentication#websocket-flow">here</a> for more details. The <code>data</code> property can be used to pass data along with the subscription.

To consume a channel, it is recommended to use a `for-await-of` loop like this:

```js
for await (
  let data of socket.channel('myChannel')
) {
  // Consume channel data...
}
```

Because the `socket.subscribe(...)` method returns an `AGChannel` instance, you can also consume it directly like this:

```js
for await (
  let data of socket.subscribe('myChannel')
) {
  // Consume channel data...
}
```

Note that `socket.subscribe(...)` can be called multiple times for the same channel; if already subscribed, the method will only return the channel.
</td>
  </tr>
  <tr>
    <td>
      unsubscribe(channelName)
    </td>
    <td>
      Unsubscribe from the specified channel. This makes any associated <a href="/docs/api-ag-channel">AGChannel</a> object inactive.
      You can reactivate the <a href="/docs/api-ag-channel">AGChannel</a> object by calling <code>subscribe(channelName)</code> again at a later time.
    </td>
  </tr>
  <tr>
    <td>
      channel(channelName)
    </td>
    <td>
      Returns an <a href="/docs/api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a>.
      This method is different from <code>socket.subscribe(...)</code> in that it will not try to subscribe to that channel.
      The returned channel will be inactive initially.
      You can call <code>channel.subscribe()</code> later to activate that channel when required.
    </td>
  </tr>
  <tr>
    <td>
      closeChannel(channelName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>channelName</code> channel and all of its listeners) to <code>break</code> after they have finished iterating over their current backlogs of events.
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
      To close specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="/docs/api-ag-channel">AGChannel API</a>.
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
      To kill specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="/docs/api-ag-channel">AGChannel API</a>.
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
      killAllChannelOutputs()
    </td>
    <td>
      This method is similar to <code>killAllChannels()</code> except that it only kills channel output streams; channel event listeners will not be affected. This will reset the aggregate backpressure for all channel output streams to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllChannelListeners()
    </td>
    <td>
      This method is similar to <code>killAllChannels()</code> except that it only kills channel listener streams; channel output streams will not be affected. This will reset the aggregate backpressure for all channel listener streams to 0.
    </td>
  </tr>
  <tr>
    <td>
      subscriptions(includePending)
    </td>
    <td>
      Returns an array of active channel subscriptions which this socket is bound to.
      If <code>includePending</code> is true, pending subscriptions will also be included in the list.
    </td>
  </tr>
  <tr>
    <td>
      isSubscribed(channelName, [includePending])
    </td>
    <td>
      Check if socket is subscribed to channelName.
      If <code>includePending</code> is true, pending subscriptions will also be included in the list.
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
  <tr>
    <td>
      channelGetOutputConsumerStatsList(channelName)
    </td>
    <td>
      Get the list of consumers which are consuming output data from the specified channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      channelGetAllListenersConsumerStatsList(channelName)
    </td>
    <td>
      Get the list of all consumers which are consuming events from any listener on the specified channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelOutputsConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming output data from any channel which is bound to the socket. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelListenersConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming events from any listener on all channels associated with the socket. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killChannelOutputConsumer(consumerId)
    </td>
    <td>
      This will cause the target channel output consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
  <tr>
    <td>
      killChannelListenerConsumer(consumerId)
    </td>
    <td>
      This will cause the target channel listener consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
</table>
