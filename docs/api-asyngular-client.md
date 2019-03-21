---
id: api-asyngular-client
title: asyngularClient
sidebar_label: asyngularClient
---

## Properties
<table>
  <tr>
    <td>version</td>
    <td>The Asyngular client version number.</td>
  </tr>
</table>

## Methods
<table>
  <tr>
    <td>
      create([options])
    </td>
    <td>
      <p>
        Creates and returns a new socket connection to the specified host (or origin if not
        specified). The options argument is optional - If omitted, the socket
        will try to connect to the origin server on the current port. For cross
        domain requests, a typical options object might look like this (example
        over HTTPS/WSS):
      </p>

```js
{
  hostname: 'securedomain.com',
  secure: true,
  port: 443,
  // Only necessary during debug if using a self-signed certificate
  rejectUnauthorized: false
}
```

<p>Here are some properties that you can provide to the options object:</p>
      <ul>
        <li><b>hostname:</b> String - Defaults to the current host (ready from
          the URL).</li>
        <li><b>secure:</b> Boolean - Defaults to false</li>
        <li><b>port</b>: Number - Defaults to 80 if !secure otherwise defaults
          to 443.</li>
        <li><b>path</b>: String - The URL which Asyngular uses to make the initial handshake
          for the WebSocket. Defaults to '/asyngular/'.</li>
        <li><b>query</b>: Object - A map of key-value pairs which will be used as query
          parameters for the initial HTTP handshake which will initiate the WebSocket connection.</li>
        <li><b>ackTimeout</b>: Number (milliseconds) - This is the timeout for
          getting a response to a AGClientSocket invoke action.</li>
        <li><b>autoConnect</b>: Boolean - Whether or not to automatically connect
          the socket as soon as it is created. Default is true.</li>
        <li><b>autoReconnect</b>: Boolean - Whether or not to automatically reconnect
          the socket when it loses the connection.</li>
        <li><b>autoReconnectOptions</b>: Object - Valid properties are: <code>initialDelay</code>
          (milliseconds), <code>randomness</code> (milliseconds), <code>multiplier</code> (decimal;
          default is 1.5) and <code>maxDelay</code> (milliseconds).</li>
        <li><b>disconnectOnUnload</b>: Boolean - Whether or not a client automatically disconnects on page unload.
          If enabled, the client will disconnect when a user navigates away from the page. This can happen when a user closes the tab/window,
          clicks a link to leave the page, or types a new URL into the address bar.
          Defaults to true.</li>
        <li><b>wsOptions</b>: Object - This object will be passed to the constructor of the <code>ws</code> <code>WebSocket</code> instance.
          The list of supported properties is <a href="https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options">here</a>.</li>
        <li><b>batchOnHandshake</b>: Boolean - Whether or not to start batching messages immediately after the connection handshake completes. This is useful for handling connection recovery when the client tries to resubscribe to a large number of channels in a very short amount of time. Defaults to false.</li>
        <li><b>batchOnHandshakeDuration</b>: Number - The amount of time in milliseconds after the handshake completes during which all socket messages will be batched. Defaults to 100.</li>
        <li><b>batchInterval</b>: Number - The amount of milliseconds to wait before flushing each batch of messages. Defaults to 50.</li>
        <li><b>timestampRequests</b>: Boolean - Whether or not to add a timestamp
          to the WebSocket handshake request.</li>
        <li><b>timestampParam</b>: String - The query parameter name to use to
          hold the timestamp.</li>
        <li><b>authEngine</b>: Object - A custom engine to use for storing and
          loading JWT auth tokens on the client side.</li>
        <li><b>authTokenName</b>: String - The name of the JWT auth token (provided
          to the authEngine - By default this is the localStorage variable
          name); defaults to 'asyngular.authToken'.</li>
        <li><b>binaryType</b>: String - The type to use to represent binary on
          the client. Defaults to 'arraybuffer'.</li>
        <li><b>cloneData</b>: Boolean - If you set this to true, any data/objects/arrays that you pass to the client socket
          will be cloned before being sent/queued up. If the socket is disconnected and you emit an event, it will be added to a queue
          which will be processed upon reconnection. The cloneData option is false by default; this means that if you emit/publish an object
          and that object changes somewhere else in your code before the queue is processed, then the changed version of that object
          will be sent out to the server.</li>
        <li><b>autoSubscribeOnConnect</b>: Boolean - This is true by default. If you set this to false, then the socket will not automatically
          try to subscribe to pending subscriptions on connect - Instead, you will have to manually invoke the <code>processSubscriptions</code> callback
          from inside the <code>'connect'</code> event handler on the client side. See <a href="api-ag-client-socket">AGClientSocket API</a>.
          This gives you more fine-grained control with regards to when pending subscriptions are processed after the socket connection is established (or re-established).</li>
        <li><b>codecEngine</b>: Object - Lets you set a custom codec engine. This allows you to specify how
          data gets encoded before being sent over the wire and how it gets decoded once it reaches the other side.
          The codecEngine must be an object which exposes an <code>encode(object)</code> and a <code>decode(encodedData)</code> function.
          The encode function can return any data type - Commonly a string or a Buffer/ArrayBuffer.
          The decode function needs to return a JavaScript object which adheres to the
          <a href="https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md">SC protocol</a>.
          The idea of using a custom codec is that it allows you to compress Asyngular packets in any format you like (optimized for any use case) -
          By decoding these packets back into their original protocol form, Asyngular will be able process them appropriately.
          Note that if you provide a codecEngine when creating a client socket, you will need to make sure that the server uses the same codec
          by passing the same engine to the <code>AGServer</code> constructor (using the <code>codecEngine</code> option).
          The default codec engine used by Asyngular is <a href="https://github.com/SocketCluster/sc-formatter/blob/master/index.js">here</a>.</li>
      </ul>
    </td>
  </tr>
</table>
