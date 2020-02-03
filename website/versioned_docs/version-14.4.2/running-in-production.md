---
id: version-14.4.2-running-in-production
title: Running in production (with SSL)
sidebar_label: Running in production
original_id: running-in-production
---

When building a system on SocketCluster, it's important to avoid placing runtime logic inside your master process (server.js file) - Such logic is better placed inside workers (worker.js).
Unlike the master process, workers automatically respawn whenever they crash (in case of uncaught error) and with minimal service disruption (a worker typically takes less than 1 second to respawn so it should be transparent to your users).
The master process is generally a good place to put bootstrap logic and spawn long-running daemon processes but once your system is live, you shouldn't use it to execute error-prone logic.

If you follow these rules, then running your SocketCluster server directly using the node command should be fine for production (example with arguments):

```bash
nohup node server.js -w 2 -s 2 &
```

For extra peace of mind, if you want to auto-respawn master, you can run SocketCluster using forever:

```bash
npm install -g forever
```

Then run with:

```bash
forever start --killSignal=SIGTERM server.js -w 2 -s 2
```

In any case, if you want to do a near-zero downtime deploy (for example, to force an update of your server-side code), you can send a SIGUSR2 signal to your master process.
Refer to [this issue](https://github.com/SocketCluster/socketcluster/issues/42) for more details.

### SSL

Another important thing to consider when running SC in production is that some old corporate proxies may block WebSocket traffic.
To avoid this issue, you should deliver your app over HTTPS/WSS by providing a key/cert SSL pair to your SC instance(s)... Or you can
simply put your SC instance behind an SSL/TLS terminating reverse proxy which supports WebSockets such as HAProxy or nginx.

To configure SC to use SSL/TLS (without terminating proxy), you need to set some [boot options](http://socketcluster.io/#!/docs/api-socketcluster) - Set the
'protocol' to 'https' and provide an object containing your certificate and key to 'protocolOptions'.
The protocolOptions object is exactly the same as the options object which is passed to Node.js's https
server: [See here](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener).

Note that if you want to deploy SocketCluster to a Kubernetes environment, you don't need to specify the TLS/SSL credentials inside server.js - TLS/SSL will be handled
by the ingress load balancer provided by K8s. See [SCC](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md).