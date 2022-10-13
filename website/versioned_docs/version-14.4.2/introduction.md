---
id: version-14.4.2-introduction
title: Introduction
sidebar_label: Introduction
original_id: introduction
---

SocketCluster is a fast, highly scalable HTTP + WebSockets server environment which lets you build multi-process real-time systems (e.g. for pub/sub and RPCs) that make use of all CPU cores on a machine/instance. It removes the limitations of having to run your Node server as a single process and makes your backend resilient by automatically recovering from worker crashes.

SocketCluster is optimized to run on Kubernetes inside Docker containers, see [SCC](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md) for details.

SocketCluster works like a pub/sub system (which extends all the way to the browser/IoT device) - It only delivers particular events to clients who actually need them. SC is designed to scale both vertically (as a cluster of processes) and horizontally (multiple machines/instances).

SC was designed to be modular so that you can run it with other frameworks such as express.
SC's real-time API is similar to that of Socket.io.

Follow the project on [Twitter](https://twitter.com/SocketCluster). Subscribe for updates on [http://socketcluster.launchrock.com/](http://socketcluster.launchrock.com/)

This site is open source, contributions on [Github](https://github.com/SocketCluster/socketcluster-website) are welcome.

### For Chat Applications

SC is ideal for building highly flexible, resilient and scalable chat systems. See [SocketCluster Design Patterns for Chat](https://jonathangrosdubois.medium.com/socketcluster-design-patterns-for-chat-69e76a4b1966) and [SCC Guide](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md#scc-guide) for more details.

### For Games

SC is ideal for building multi-player online games. See the [Phaser demo](https://github.com/jondubois/iogrid). Note that to reduce bandwidth consumption, you may want to use SC with [sc-codec-min-bin](https://github.com/SocketCluster/sc-codec-min-bin) - This codec will compress SC messages and turn them into binary packets as they get sent over the wire. Alternatively, you may want to write your own codec optimized for your specific game/application.

### Memory Leak Profile

SC has been tested for memory leaks. The last full memory profiling was done on v0.9.17 (Node.js v0.10.28) and included checks on worker and broker processes. No memory leaks were detected.

### Main Contributors

* [Jonathan Gros-Dubois](https://github.com/jondubois)
* [Matt Krick](https://github.com/mattkrick)
* [Alex Hultman](https://github.com/alexhultman)
* [Anatoliy Popov](https://github.com/abpopov)
* [Sachin Shinde](https://github.com/sacOO7)
* [Nick Kotenberg](https://github.com/happilymarrieddad)
* [Rob Borden](https://github.com/robborden)
* [Nelson Zheng](https://github.com/nelsonzheng)
* [Lihan Li](https://github.com/lihan)
* [MegaGM](https://github.com/MegaGM)
* [Wactbprot](https://github.com/wactbprot)
