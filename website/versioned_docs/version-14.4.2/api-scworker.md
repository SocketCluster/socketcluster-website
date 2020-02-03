---
id: version-14.4.2-api-scworker
title: API - SCWorker
sidebar_label: SCWorker (server, worker)
original_id: api-scworker
---

The SCWorker should be instantiated inside the worker controller file (worker.js).
The worker controller is the entry point for your application logic.

Example worker controller:

```js
var SCWorker = require('socketcluster/scworker');

class Worker extends SCWorker {
  // Override the run function.
  // It will be executed when the worker is ready.
  run() {
    this.scServer.on('connection', function (socket) {
      // Handle new connection.
    }
  }

  // You can optionally override the createHTTPServer method if
  // you want to provide an alternative HTTP server to SC.
  // This is for advanced use cases.
  createHTTPServer() {
    var httpServer;
    if (this.options.protocol == 'https') {
      httpServer = require('https').createServer(this.options.protocolOptions);
    } else {
      httpServer = require('http').createServer();
    }
    return httpServer;
  }
}

new Worker();
```

### Inherits from:

[EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)

### Properties:

<table>
    <tr>
        <td>id</td>
        <td>The id is an index - The first worker's id will always be 0.</td>
    </tr>
    <tr>
        <td>isLeader</td>
        <td>Boolean which indicates whether or not this worker is the leader (id == 0).</td>
    </tr>
    <tr>
        <td>options</td>
        <td>The options object passed to this worker from master.</td>
    </tr>
    <tr>
        <td>httpServer</td>
        <td>
            The Node.js HTTP server associated with this worker.
            Note that this server's 'request' event will not trigger for requests which are handled internally by SocketCluster.
            If you would like to handle all requests (including ones for URLs reserved by SC), you will need to listen for the 'rawRequest' event.
            This is not recommended though unless you know what you're doing.
        </td>
    </tr>
    <tr>
        <td>scServer</td>
        <td>The SCServer instance associated with this worker.</td>
    </tr>
    <tr>
        <td>exchange</td>
        <td>
            A top-level scBroker client which lets you publish and manipulate data within your brokers.
            (See API section on Exchange object for details).
        </td>
    </tr>
    <tr>
        <td>auth</td>
        <td>The current AuthEngine used by SC (this is what SC uses internally to create/sign and verify auth tokens).</td>
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
        <td>'exit'</td>
        <td>Happens when this worker exits (sometimes due to error).</td>
    </tr>
    <tr>
        <td>'ready'</td>
        <td>This signals that the worker is ready to accept requests from users.</td>
    </tr>
    <tr>
        <td>'masterMessage'</td>
        <td>
            Emitted when the master process sends a message to this worker.
            Since SocketCluster version 6.6.0, the handler function accepts two arguments; the first is the data which was sent
            by the master process, the second is a <code>respond</code> callback function which you can call to respond to the
            event using IPC. The <code>respond</code> function should be invoked as <code>respond(error, data)</code>; it is recommended
            that you pass an instance of the <code>Error</code> object as the first argument; if you don't want to send back an error,
            then the first argument should be <code>null</code>: <code>respond(null, data)</code>.
            See <code>sendToWorker(...)</code> method in <a href="/docs/14.4.2/api-socketcluster">SocketCluster (master) API</a> for details on how
            to send a message to a worker from the master process (and how to handle the response from the worker).
        </td>
    </tr>
</table>

### Methods:

<table>
    <tr>
        <td>constructor([options])</td>
        <td>
            Create the worker instance. You can pass an optional options object.
            Since SocketCluster v14.2.0, the options object can be used to override properties from the main options object which was passed to the SocketCluster master instance.
            You can also use the options object to pass a custom <code>authEngine</code> and <code>codecEngine</code> to the SCWorker instance.
        </td>
    </tr>
    <tr>
        <td>getSCServer()</td>
        <td>
            Returns the SCServer instance associated with this worker.
            Note that you no longer have to use this method; you can now simply access the worker.scServer property directly instead.
        </td>
    </tr>
    <tr>
        <td>getHTTPServer()</td>
        <td>
            Returns the Node.js HTTP server associated with this worker.
            Note that this server's 'request' event will not trigger for requests which are handled internally by SocketCluster.
            If you would like to handle all requests (including ones for URLs reserved by SC), you will need to listen for the 'rawRequest' event.
            This is not recommended though unless you know what you're doing.
            Note that you no longer have to use this method; you can now simply access the worker.httpServer property directly instead.
        </td>
    </tr>
    <tr>
        <td>setAuthEngine(authEngine) <b>[Deprecated]</b></td>
        <td>
            This feature is deprecated, the recommended approach is to pass the <code>authEngine</code> as a property of the options object when constructing the SCWorker instance.
            Set a custom auth engine for use throughout SC. This new engine will be used internally to create/sign and verify auth tokens.
            The provided auth engine will become accessible from the 'worker.auth' property inside your workerController (worker.js).
            The provided authEngine needs to provide a 'verifyToken' and a 'signToken' method - See the
            <a href="https://github.com/SocketCluster/sc-auth/blob/master/index.js">default engine</a> for details.
        </td>
    </tr>
    <tr>
        <td>sendToMaster(data, [callback])</td>
        <td>
            Send some data to the master process from this worker. You will be able to handle this data from inside the master process by listening for the
            'workerMessage' event. See <a href="/docs/14.4.2/api-socketcluster">here</a> for more details.
            Since SocketCluster v6.6.0, you can provide an optional callback as the second argument; it should be in the
            form <code>function (err, data) { /* ... */ }</code> - Note that the master will need to respond
            to the 'workerMessage' event by invoking a <code>respond</code> function; this is a convenient way to collect data back from the master process in response to this event.
            If the master does not invoke the <code>respond</code> function, then this callback will receive an instance of <code>TimeoutError</code> as the first argument.
            The timeout is defined by the <code>ipcAckTimeout</code> option - See the <a href="/docs/14.4.2/api-socketcluster">SocketCluster (server) API</a> for details.
        </td>
    </tr>
    <tr>
        <td>getSocketPath()</td>
        <td>Returns the URL path used by real-time socket connections. The method name getSocketURL() has been deprecated.</td>
    </tr>
    <tr>
        <td>getStatus()</td>
        <td>
            Returns an object containing statistics about the current worker including number
            of connected clients and also number of HTTP and real-time requests per minute.
        </td>
    </tr>
    <tr>
        <td>addMiddleware(type, middlewareFn)</td>
        <td>
            <p>
                Lets you add middleware functions which can be used to control the worker bootstrap process.
            </p>
            <ul>
                <li>
                    <h5>type</h5>
                    <p>
                        A string representing the type of middleware to use, must be:
                    </p>
                    <p>
                        worker.MIDDLEWARE_START - 'start' - This middleware function is run before
                        the worker's internal HTTP/WS server starts listening for connections.
                    </p>
                </li>
                <li>
                    <h5>middlewareFn</h5>
                    <p>
                        A middleware function which can be used to delay the launch of the server.
                        Middleware functions are all in the form <code>middlewareFn(options, next)</code>.
                    </p>
                    <table>
                        <tr>
                            <td>MIDDLEWARE_START</td>
                            <td>
                                This middleware will run before SocketCluster's underlying HTTP/WS server starts listening for connections - It
                                allows you to perform some async logic to prepare your worker before it starts handling connections.
                                The options object passed to this middleware function will be the SC instance's internal options object.
                            </td>
                        </tr>
                    </table>
                </li>
            </ul>
        </td>
    </tr>
</table>