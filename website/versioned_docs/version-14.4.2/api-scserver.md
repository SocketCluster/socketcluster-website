---
id: version-14.4.2-api-scserver
title: API - SCServer
sidebar_label: SCServer (server, worker)
original_id: api-scserver
---

This instance is returned from the call to worker.getSCServer(). It represents your
real-time (WebSocket) server object which you can use to listen for incoming
real-time socket connections. This object inherits from engine.io's Server
object so you have access to all the properties and methods of an engine.io
server but with some additions.

### Inherits from:

[EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)

### Properties:

<table>
    <tr>
        <td>exchange</td>
        <td>
            A top-level scBroker client which lets you publish and manipulate data within your brokers.
            (See API section on Exchange object for details).
        </td>
    </tr>
    <tr>
        <td>clients</td>
        <td>
            An object which holds all fully connected clients in the current worker (only those who have completed the handshake).
            Keys are socket IDs and the values are SCSocket instances.
        </td>
    </tr>
    <tr>
        <td>clientsCount</td>
        <td>
            The number of clients currently connected to this server.
        </td>
    </tr>
    <tr>
        <td>pendingClients [since v9.1.0]</td>
        <td>
            An object which holds all pending clients in the current worker.
            Keys are socket IDs and the values are SCSocket instances.
            Pending clients are those whose <code>socket.state</code> is 'connecting'; this means
            all sockets which are in the middle of the handshake phase.
            Once a socket completes its handshake, it will be removed from the <code>pendingClients</code> object
            and it will be added to the <code>clients</code> object.
        </td>
    </tr>
    <tr>
        <td>pendingClientsCount [since v9.1.0]</td>
        <td>
            The number of pending clients currently connected to this server.
        </td>
    </tr>
    <tr>
        <td>sourcePort</td>
        <td>The public port on which clients connect to SocketCluster (e.g. 80 for HTTP).</td>
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
            which require acknowledgement. For example, when you provide a callback
            to socket.emit() on the client (it will expect a response from the server).
        </td>
    </tr>
</table>

### Events:
        
<table>
    <tr>
        <td>'error'</td>
        <td>This gets triggered when fatal error occurs on this worker.</td>
    </tr>
    <tr>
        <td>'notice'</td>
        <td>A notice carries potentially useful information but isn't quite an error.</td>
    </tr>
    <tr>
        <td>'handshake'</td>
        <td>
            Emitted as soon as a new SCSocket object is created on the server - This occurs at
            the beginning of the client handshake, before the 'connection' event.
            The argument passed to the listener is the socket object which is performing the handshake.
            You should not try to send events to the socket while it is in this state.
        </td>
    </tr>
    <tr>
        <td>'connectionAbort' [since v9.1.0]</td>
        <td>
            Emitted whenever a socket becomes disconnected during the handshake phase. The listener to this event
            receives a socket (SCSocket) object as argument.
        </td>
    </tr>
    <tr>
        <td>'connection'</td>
        <td>
            Emitted whenever a new socket connection is established with the server (and the handshake has completed).
            The listener to this event receives a socket (SCSocket) object as argument which can be used
            to interact with that client. The second argument to the handler is the socket connection status object.
        </td>
    </tr>
    <tr>
        <td>'disconnection'</td>
        <td>
            Emitted whenever a connected socket becomes disconnected (after the handshake phase). The listener to this event
            receives a socket (SCSocket) object as argument. Note that if the socket connection was not fully established (e.g. during the SC handshake phase), then the
            <code>'connectionAbort'</code> event will be triggered instead.
        </td>
    </tr>
    <tr>
        <td>'closure' [since v9.1.1]</td>
        <td>
            Emitted whenever a connected socket becomes disconnected (at any stage of the handshake/connection cycle). The listener to this event
            receives a socket (SCSocket) object as argument. Note that this event is a catch-all for both <code>'disconnection'</code> and <code>'connectionAbort'</code> events.
        </td>
    </tr>
    <tr>
        <td>'subscription'</td>
        <td>
            Emitted whenever a socket connection which is attached to the server becomes subscribed to a channel. The listener to this event
            receives a socket (SCSocket) object as the first argument. The second argument is the channelName.
            The third argument is the channelOptions object.
        </td>
    </tr>
    <tr>
        <td>'unsubscription'</td>
        <td>
            Emitted whenever a socket connection which is attached to the server becomes unsubscribed from a channel. The listener to this event
            receives a socket (SCSocket) object as the first argument. The second argument is the channelName.
        </td>
    </tr>
    <tr>
        <td>'authentication'</td>
        <td>
            Emitted whenever a socket connection which is attached to the server becomes authenticated. The listener to this event
            receives a socket (SCSocket) object as the first argument. The second argument is the authToken object.
        </td>
    </tr>
    <tr>
        <td>'deauthentication'</td>
        <td>
            Emitted whenever a socket connection which is attached to the server becomes deauthenticated. The listener to this event
            receives a socket (SCSocket) object as the first argument. The second argument is the old authToken object
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
            The authError is an error object and the signedAuthToken is the auth token which failed the verification step.
        </td>
    </tr>
    <tr>
        <td>'ready'</td>
        <td>
            Emitted when the server is ready to accept connections.
        </td>
    </tr>
</table>

### Methods:
    
<table>
    <tr>
        <td>setCodecEngine(codecEngine)</td>
        <td>
            <p>
                Lets you set a custom codec engine. This allows you to specify how data gets encoded before being sent over the wire and how it gets decoded once it reaches the other side.
                The codecEngine must be an object which exposes an <code>encode(object)</code> and a <code>decode(encodedData)</code> function. The encode function can return any data type - Comonly a string or a Buffer/ArrayBuffer.
                The decode function needs to return a JavaScript object which adheres to the <a href="https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md">SC protocol</a>.
                The idea of using a custom codec is that it allows you to compress SC packets in any format you like (optimized for any use case) - By decoding these packets back into their original protocol form, SC will be able process them appropriately.
                Note that if you provide a codec engine on the server, you need to provide the same codecEngine as an option when you create the client socket (see 'codecEngine' option <a href="/docs/14.4.2/api-socketcluster-client">here</a>).
                The default codec engine used by SC is <a href="https://github.com/SocketCluster/sc-formatter/blob/master/index.js">here</a>.
                If you make an interesting codec engine/module which you feel might be useful for other developers, please feel free to share it with the rest of the SC community.
            </p>
        </td>
    </tr>
    <tr>
        <td>close()</td>
        <td>
            <p>
                Close the server and terminate all clients.
            </p>
        </td>
    </tr>
    <tr>
        <td>addMiddleware(type, middlewareFn)</td>
        <td>
            <p>
                Lets you add middleware functions which can be used to manage client access control
                to various features of the SCServer. This is useful for monitoring
                real-time data flows and also to block access to restricted channels
                and resources. Note that only actions from clients pass through middleware.
                Server-side calls to scServer.exchange.publish() do not.
            </p>
            <ul>
                <li>
                    <h5>type</h5>
                    <p>
                        A string representing the type of middleware to use, can be:
                    </p>
                    <br />
                    <table>
                        <tr>
                        <td>
                            scServer.MIDDLEWARE_HANDSHAKE_WS - 'handshakeWS' - This middleware function is run before
                            a connection is established during WebSocket handshake stage (as part of the HTTP upgrade).
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_HANDSHAKE_SC - 'handshakeSC' - This middleware function is run as part of
                            the SocketCluster protocol handshake. It is similar to the MIDDLEWARE_HANDSHAKE_WS handshake except
                            that when the connection is killed, you can pass back custom status codes and errors to the client's
                            'connectAbort' event handler.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_AUTHENTICATE - 'authenticate' - This middleware function runs once a JWT
                            has been verified on a socket but before the authentication has completed - This middleware can be used as a final
                            check before the 'connection' event triggers on the server. It's a good place to attach
                            custom authentication-related data to the server-side socket object.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_SUBSCRIBE - 'subscribe' - For all client subscribe() actions.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_PUBLISH_IN - 'publishIn' - For all inbound client publish() actions.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_PUBLISH_OUT - 'publishOut' - For all outbound client publish()
                            actions. This gets run once for each subscribed client.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            scServer.MIDDLEWARE_EMIT - 'emit' - For all client emit() actions.
                        </td>
                    </tr>
                </table>
                </li>
                <li>
                    <h5>middlewareFn</h5>
                    <p>
                        A middleware function which can be used to monitor real-time interactions and/or to
                        block unauthorized client actions before they reach the server.
                        Middleware functions are all in the form <code>middlewareFn(req, next)</code> but the req object will have different properties
                        depending on the specified middleware type:
                    </p>
                    <table>
                        <tr>
                            <td>MIDDLEWARE_HANDSHAKE_WS</td>
                            <td>
                                The req object is a Node.js HTTP request object. Note that unlike with other middleware lines, errors passed to the <code>next(error)</code>
                                callback of this middleware cannot be handled from the client side due to WebSocket RFC restrictions. See the section on <code>MIDDLEWARE_HANDSHAKE_WS</code>
                                <a href="/docs/14.4.2/middleware-and-authorization">here</a> for more details.
                            </td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_HANDSHAKE_SC</td>
                            <td>
                                The req object has a <code>socket</code> property which is the socket that is currently performing the handshake.
                                The callback is in the form: <code>next(error, statusCode)</code> (both arguments are optional) - If provided, the first
                                argument should be an Error object or string. The second argument should be a close status code to send back to the client socket.
                                See <a href="/docs/14.4.2/middleware-and-authorization">here</a> for more details.
                            </td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_AUTHENTICATE</td>
                            <td>The req object has the following properties: <code>socket</code>, <code>authToken</code> and <code>signedAuthToken</code>.</td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_SUBSCRIBE</td>
                            <td>
                                The req object has the following properties: <code>socket</code> and <code>channel</code>. If the socket had an auth token which has expired, the req object will also have an <code>authTokenExpiredError</code> property which you can optionally pass to the next() method (to block the subscription).
                                The req object may also have a boolean <code>waitForAuth</code> property set to true if the channel is a private channel which requires authentication.
                                Also, if the client passed custom data as part of the subscribe call, then the middleware req object will have a <code>data</code> poperty which holds that custom data.
                            </td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_PUBLISH_IN</td>
                            <td>
                                The req object has the following properties: <code>socket</code>, <code>channel</code> and <code>data</code>. If the socket had an auth token which has expired, the req object will also have an <code>authTokenExpiredError</code> property which you can optionally pass to the next() method.
                                Note that you can send data back to the client from inside the middleware function by assigning an object/value to the <code>ackData</code> property of the req object - That way, if a callback is provided on the client in   <code>socket.publish(channelName, data, callback)</code>, the <code>ackData</code> will be passed
                                as the second argument to that callback (the first argument will be an error object; if an error has occurred). See the example for MIDDLEWARE_PUBLISH_IN <a href="/docs/14.4.2/middleware-and-authorization">here</a>.
                            </td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_PUBLISH_OUT</td>
                            <td>The req object has the following properties: <code>socket</code>, <code>channel</code> and <code>data</code>. If the socket had an auth token which has expired, the req object will also have an <code>authTokenExpiredError</code> property which you can optionally pass to the next() method.</td>
                        </tr>
                        <tr>
                            <td>MIDDLEWARE_EMIT</td>
                            <td>The req object has the following properties: <code>socket</code>, <code>event</code> and <code>data</code>. If the socket had an auth token which has expired, the req object will also have an <code>authTokenExpiredError</code> property which you can optionally pass to the next() method.</td>
                        </tr>
                    </table>
                </li>
            </ul>
                <h5>Example:</h5>
                <p>
                    <a href="/docs/14.4.2/middleware-and-authorization">Middleware and authorization</a>
                </p>
            </td>
        </tr>
        <tr>
            <td>removeMiddleware(type, middlewareFn)</td>
            <td>
                <p>
                    Lets you remove middleware functions previously added with the addMiddleware() method.
                </p>
            </td>
        </tr>
    </table>