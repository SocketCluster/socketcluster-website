---
id: version-14.4.2-debugging
title: Debugging
sidebar_label: Debugging
original_id: debugging
---

You can debug any SC process in much the same way that you would debug a normal NodeJS process.
The only difference is that because SC has multiple kinds of processes which interact with each other in
various ways, you generally don't want to debug all of them at the same time.
For this reason, SC allows you to provide **--debug-workers** and **--debug-brokers **CLI arguments
to let you debug workers and brokers separately.
Note that if you're using Node.js versions 6.3.0 and above, you can use **--inspect-workers** and **--inspect-brokers** that way you
don't need to run an external debugger on the side.

First, make sure that you are using Node.js v0.11.0+ (preferably the latest stable version).

 Install node-inspector globally (skip this step if you're on Node.js v6.3.0 or above):

 ```bash
 npm install -g node-inspector
 ```

 Then run it in a console window using:

 ```bash
 node-inspector
 ```

 ^ You have to keep this one running in its own console (or in the background) throughout your whole debugging session (no need to restart it between individual debugs).

 To start debugging, you need to have a fresh console open. You just have to pass a **--debug-workers**,
**--debug-brokers**, **--inspect-workers** or **--inspect-brokers** argument when you run your server.js
file using node. Make sure you add the flags **after** the server file name or else it won't work.

```bash
node server --debug-workers
```

or

```bash
node server --debug-brokers
```

or (Node.js version >= 6.3.0)

```bash
node server --inspect-workers
```

or (Node.js version >= 6.3.0)

```bash
node server --inspect-brokers
```

The default debug port for the first worker is **5859**, the second worker is 5860, ... (it increments by one for each worker) - You should see a debug message get printed to the console telling you which debug ports are open.

To open the debug console for the first worker, you need to insert this address in your Chrome browser (debug port 5859):
[http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5859](http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5859)

For Node.js >= v6.3.0, just copy the second URL provided in the console to debug the first worker (the first URL provided is for the master workerCluster process).

You can also provide a custom starting port for the workers - The first port will be assigned to the workerCluster master - This is the process
which manages the SC workers - You generally don't need to debug that one. The first worker's debug port will be the specified port + 1
and subsequent workers will +1 increment:

```bash
// Our workerCluster process will be debuggable on port 5999.
// The first worker will be debuggable on port 6000.
node server --debug-workers=5999
```

This applies to brokers too:

```bash
// First broker will be debuggable on port 5999.
node server --debug-brokers=5999
```

If you're using Node.js v6.3.0 or above, you can substitute the 'debug' keyword above with 'inspect' and it will work in essentially the same way.
You should see the debugger URLs come up on the console; you can just copy them and paste them in your browser.

If you want to debug your master process (server.js), it's the normal

```bash
node --debug-brk server
```

or for Node.js >= v6.3.0:

```bash
node --inspect server
```

^ Note that the order matters in this case too (this time **--debug-brk** or **--inspect** needs to go **before** the server argument)!

When you're debugging a worker, you may occasionally want to make it break on a particular line or else it will go to the end (idle, waiting for connections).
To do this you need to add a **debugger;** statement in your worker.js code where you want it to stop.

Note that if you're in a worker, you will have access to a global **worker** object (in the debugger console) so you can interact with your server and do
things like **worker.exchange.publish('pong', 'This is a message for the pong channel')** to interact with the rest of your system from your worker.
(Note that you don't need to add **debugger** statements anywhere in your code to access this feature - The
worker variable is exposed globally so you can access it from any scope).

In the same way, when you're debugging a broker process, you will have access to a **broker** object and you can also
interact with the broker directly through the debugger just like the worker.

Slightly off-topic: If you're using multiple brokers, each broker will only manage a subset of all available channels (this is the secret sauce to SC's scalability),
so don't be surprised if you publish() to a broker and no one gets the message - You have to call publish() on the broker which is
responsible for that particular channel.