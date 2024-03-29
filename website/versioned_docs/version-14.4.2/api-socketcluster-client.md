---
id: version-14.4.2-api-socketcluster-client
title: API - socketCluster (Client)
sidebar_label: socketCluster (client)
original_id: api-socketcluster-client
---

This is the root standalone object for the SocketCluster client library - You can
use it to create socket connections which you can use to interact with
the server in real-time.

### Properties
<table>
  <tr>
    <td>version</td>
    <td>The SC client version number.</td>
  </tr>
  <tr>
    <td>clients</td>
    <td>An object which holds all current SC clients/sockets.</td>
  </tr>
</table>

### Methods
<table>
  <tr>
    <td>
      create([options])
    </td>
    <td>
      <p>
        This method was called <code>connect</code> before socketcluster-client v10.0.0.
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
  wsOptions: { rejectUnauthorized: false } // Only necessary during debug if using a self-signed certificate
}
```
<p>Here are some properties that you can provide to the options object:</p>
      <ul>
          <li><b>hostname:</b> String - Defaults to the current host (ready from the URL).</li>
          <li><b>secure:</b> Boolean - Defaults to false</li>
          <li><b>port</b>: Number - Defaults to 80 if !secure otherwise defaults to 443.</li>
          <li><b>path</b>: String - The URL which SC uses to make the initial handshake for the WebSocket. Defaults to '/socketcluster/'.</li>
          <li><b>query</b>: Object - A map of key-value pairs which will be used as query parameters for the initial HTTP handshake which will initiate the WebSocket connection.</li>
          <li><b>ackTimeout</b>: Number (milliseconds) - This is the timeout for getting a response to a SCSocket emit event (when a callback is provided).</li>
          <li><b>autoConnect</b>: Boolean - Whether or not to automatically connect the socket as soon as it is created. Default is true.</li>
          <li><b>autoReconnect</b>: Boolean - Whether or not to automatically reconnect the socket when it loses the connection.</li>
          <li><b>autoReconnectOptions</b>: Object - Valid properties are: initialDelay (milliseconds), randomness (milliseconds), multiplier (decimal; default is 1.5) and maxDelay (milliseconds).</li>
          <li><b>disconnectOnUnload</b>: Boolean - Whether or not a client automatically disconnects on page unload. If enabled, the client will disconnect when a user navigates away from the page. This can happen when a user closes the tab/window, clicks a link to leave the page, or types a new URL into the address bar. Defaults to true.</li>
          <li><b>perMessageDeflate</b>: Boolean - Turn on/off per-message deflate compression. If this is true, you need to make sure that this property is also set to true on the server-side. Note that this option is only relevant when running the client from Node.js. Most modern browsers will automatically use perMessageDeflate so you only need to turn it on from the server-side.</li>
          <li><b>multiplex</b>: Boolean - Defaults to true; multiplexing allows you to reuse a socket instead of creating a second socket to the same address.</li>
          <li><b>pubSubBatchDuration</b>: Number - Defaults to null (0 milliseconds); this property affects channel subscription batching; it determines the period in milliseconds for batching multiple subscription requests together. It only affects channels that have the <code>batch</code> option set to true. A value of null or 0 means that all subscribe or unsubscribe requests which were made within the same call stack will be batched together. This property was introduced on the client-side in SC version 8 (both the client and server versions need to be >= 8.0.0). Note that there is also a separate property with the same name which can be configured on the server.</li>
          <li><b>timestampRequests</b>: Boolean - Whether or not to add a timestamp to the WebSocket handshake request.</li>
          <li><b>timestampParam</b>: String - The query parameter name to use to hold the timestamp.</li>
          <li><b>authEngine</b>: Object - A custom engine to use for storing and loading JWT auth tokens on the client side.</li>
          <li><b>authTokenName</b>: String - The name of the JWT auth token (provided to the authEngine - By default this is the localStorage variable name); defaults to 'socketCluster.authToken'.</li>
          <li><b>binaryType</b>: String - The type to use to represent binary on the client. Defaults to 'arraybuffer'.</li>
          <li><b>wsOptions</b>: Object - Can be used to specify custom options to pass to the underlying WebSocket client. Set this to <code>{ rejectUnauthorized: false }</code> during debugging - Otherwise client connections will fail when using self-signed certificates.</li>
          <li><b>cloneData</b>: Boolean - If you set this to true, any data/objects/arrays that you pass to the client socket will be cloned before being sent/queued up. If the socket is disconnected and you emit an event, it will be added to a queue which will be processed upon reconnection. The cloneData option is false by default; this means that if you emit/publish an object and that object changes somewhere else in your code before the queue is processed, then the changed version of that object will be sent out to the server.</li>
          <li><b>autoSubscribeOnConnect</b>: Boolean - This is true by default. If you set this to false, then the socket will not automatically try to subscribe to pending subscriptions on connect - Instead, you will have to manually invoke the <code>processSubscriptions</code> callback from inside the <code>'connect'</code> event handler on the client side. See <a href="/docs/14.4.2/api-scsocket-client">SCSocket Client API</a>. This gives you more fine-grained control with regards to when pending subscriptions are processed after the socket connection is established (or re-established).</li>
          <li><b>codecEngine</b>: Object - Lets you set a custom codec engine. This allows you to specify how data gets encoded before being sent over the wire and how it gets decoded once it reaches the other side. The codecEngine must be an object which exposes an <code>encode(object)</code> and a <code>decode(encodedData)</code> function. The encode function can return any data type - Commonly a string or a Buffer/ArrayBuffer. The decode function needs to return a JavaScript object which adheres to the <a href="https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md">SC protocol</a>. The idea of using a custom codec is that it allows you to compress SC packets in any format you like (optimized for any use case) - By decoding these packets back into their original protocol form, SC will be able process them appropriately. Note that if you provide a codecEngine when creating a client socket see 'codecEngine', you will need to make sure that the server uses the same codec by passing the same engine to `worker.scServer.setCodecEngine(codecEngine)` when your SC worker initializes on the server side (see 'setCodecEngine' method <a href="/docs/14.4.2/api-scserver">here</a>). The default codec engine used by SC is <a href="https://github.com/SocketCluster/sc-formatter/blob/master/index.js">here</a>.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      destroy(socket)
    </td>
    <td>
      Completely destroys a socket. You just need to pass the socket object which you want to destroy. This is the same as calling <code>socket.destroy()</code>. Note that this method has changed since <code>socketcluster-client</code> v10.0.0.
    </td>
  </tr>
</table>
