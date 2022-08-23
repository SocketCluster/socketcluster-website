---
id: version-17.0.0-api-socket-cluster-server
title: socketClusterServer
sidebar_label: socketClusterServer
original_id: api-socket-cluster-server
---

## Properties
<table>
  <tr>
    <td>AGServer</td>
    <td>A reference to the SocketCluster server class.</td>
  </tr>
  <tr>
    <td>AGServerSocket</td>
    <td>A reference to the SocketCluster server socket class.</td>
  </tr>
</table>

## Methods
<table>
  <tr>
    <td>
      attach(httpServer, options)
    </td>
    <td>
      Create a new SocketCluster server and attach it to the specified <a href="https://nodejs.org/api/http.html#http_class_http_server" target="_blank">Node.js HTTP server</a> instance. This method returns an AGServer instance.
      The list of possible options which will be passed to the SocketCluster server instance can be found <a href="/docs/api-ag-server#methods">here</a>.
    </td>
  </tr>
  <tr>
    <td>
      listen(port, options, fn)
    </td>
    <td>
      Create a SocketCluster server instance which is already attached to an HTTP server instance and ready to use. This method returns an AGServer instance.
    </td>
  </tr>
</table>
