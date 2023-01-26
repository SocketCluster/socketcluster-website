---
id: version-14.4.2-getting-started
title: Getting started
sidebar_label: Getting started
original_id: getting-started
---

To get started with SocketCluster, you need to have [Node.js](https://nodejs.org/en/) installed.
You can follow [these instructions](https://nodejs.org/en/download/package-manager/) to install NodeJS.

Once you have Node installed, you can install SocketCluster.
There are two ways to install SocketCluster - You can install it as a framework (this is the simplest way) or you can install the client and server separately (this may be better if you have more specific requirements).

### Install the CLI tool

To install SocketCluster as a standalone server and client; follow the instructions [here](https://github.com/SocketCluster/socketcluster-server) (server) and [here](https://github.com/SocketCluster/socketcluster-client) (client).

To install it as a framework (recommended):

```bash
npm install -g socketcluster
```

Once installed, the <code>socketcluster create</code> command will create a fresh SocketCluster installation. For example, <code>socketcluster create myApp</code> will create a directory inside your current working directory called <code>myApp</code>

```bash
socketcluster create myApp
```

### Serving SocketCluster

When this is done, you can navigate to <code>myApp</code> and run your server immediately using <code>node server.js</code>

```bash
node server.js
```

You can connect to your server by navigating to http://localhost:8000/ in your browser.

To test SocketCluster's real-time features, you can open your browser's developer console and enter this:

```js
// Client side
// Use socketCluster.connect() if socketcluster-client < v10.0.0
var socket = socketCluster.create();
socket.emit('sampleClientEvent', {message: 'This is an object with a message property'});
```

You should get a 'Sample channel message: 1' message back - The server receives your sampleClientEvent event and then publishes a sample event to all clients which are listening to it.

The first argument is the event name - You can use any event name you like except for [reserved events](https://github.com/SocketCluster/socketcluster-client/blob/70403a7853897b1948368b13ec652b09b7fede0a/lib/scsocket.js#L59-L74).
You can pass almost anything as the second argument to the emit and publish commands so long as it's compatible with JSON.

Note that you can provide an optional `options` object to the `socketCluster.create()` method on the client side.
Look at [SocketCluster Client API](/docs/14.4.2/api-socketcluster-client) for details.
For more details about the main SocketCluster JavaScript client, [click here](https://github.com/SocketCluster/socketcluster-client).

On the server side, you can configure SocketCluster by editing code inside <code>server.js</code>. SocketCluster has over 30 options which you can change to suit your specific needs (most options are optional).

Here is a sample (basic) <code>server.js</code> file:

```js
var SocketCluster = require('socketcluster');
var socketCluster = new SocketCluster({
  workers: 1, // Number of worker processes
  brokers: 1, // Number of broker processes
  port: 8000, // The port number on which your server should listen
  appName: 'myapp', // A unique name for your app

  // Switch wsEngine to 'sc-uws' for a performance boost (beta)
  wsEngine: 'ws',

  /* A JS file which you can use to configure each of your
   * workers/servers - This is where most of your backend code should go
   */
  workerController: __dirname + '/worker.js',

  /* JS file which you can use to configure each of your
   * brokers - Useful for scaling horizontally across multiple machines (optional)
   */
  brokerController: __dirname + '/broker.js',

  // Whether or not to reboot the worker in case it crashes (defaults to true)
  rebootWorkerOnCrash: true
});
```

SocketCluster runs as a cluster of different kinds of processes; each kind of process has its own 'controller' file which lets you configure each process' behaviour - There is a controller for load balancers, one for workers and one for broker processes. The most important one (where most of your application logic should go) is the <code>workerController</code>.


### And beyond

 Have a look at the existing code in your <code>workerController</code> (worker.js) and play around with it.

 Remember to reboot SocketCluster when you make changes to your code - If you're running on a UNIX-like environment, you can also send a SIGUSR2 signal to the master PID order to reboot the only workers (with the fresh source code).

 If you need guidance about how to make the most of SocketCluster, you may want to read [SocketCluster Design Patterns for Chat](https://jonathangrosdubois.medium.com/socketcluster-design-patterns-for-chat-69e76a4b1966).

### Video by Nick Kotenberg

[Introduction to Socketcluster and Nodejs (setting up)](https://www.youtube.com/watch?v=a38BBbKYH1M&list=PLTxFJWe_410zNJJD0o8njNLv7HidG1CHq&index=1)
