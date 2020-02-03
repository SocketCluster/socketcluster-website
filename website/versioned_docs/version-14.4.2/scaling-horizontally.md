---
id: version-14.4.2-scaling-horizontally
title: Scaling across multiple hosts
sidebar_label: Scaling Horizontally
original_id: scaling-horizontally
---

SocketCluster lets you scale both vertically (across multiple CPU cores on a machine/host) and horizontally (across multiple hosts).
To scale horizontally, you can either use SCC (recommended) or implement your own solution from scratch.

If you use SCC, then you don't need to learn about the implementation details of how SC synchronizes channel data across machines (unless you really want to).
If you use SCC, the work of scaling and sharding is handled for you **automatically**.
With SCC, you just have to tell it how many instances of each subservice you want (depending on usage).
If running SCC on Kubernetes, you can also configure it to autoscale services on demand.

SCC is a set of components for scaling SC across multiple hosts.
You can run SCC manually with Node.js by lauching each component individually or you can deploy SCC to a Kubernetes cluster.
It's possible to deploy an SCC application to any Kubernetes cluster using a single command; see [Baasil CLI](https://github.com/SocketCluster/baasil-cli).
The baasil CLI tool also lets you run/debug your app from inside a container on your local machine so that you can get a more consistent (containerized) development and production environment.

The complete guide to using SCC is here: [SCC guide](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md).

Video series showing Horizontal/Vertical Scaling locally and on AWS. [Click Me](https://www.youtube.com/playlist?list=PLTxFJWe_410yrEEHvtpsdNkyLvy9dCJT4)