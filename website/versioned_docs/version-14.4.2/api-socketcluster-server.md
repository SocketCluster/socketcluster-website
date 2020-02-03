---
id: version-14.4.2-api-socketcluster-server
title: API - socketCluster (Client)
sidebar_label: socketClusterServer
original_id: api-socketcluster-server
---

This is the root standalone object for the SocketCluster client library - You can
use it to create socket connections which you can use to interact with
the server in real-time.

### Properties:
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

### Methods:
<table>
  <tr>
    <td>
      create([options])
    </td>
    <td>
      This method was called <code>connect</code> before socketcluster-client v10.0.0.
      Creates and returns a new socket connection to the specified host (or origin if not
      specified). The options argument is optional - If omitted, the socket
      will try to connect to the origin server on the current port. For cross
      domain requests, a typical options object might look like this (example over HTTPS/WSS):
      ```js
      {
        hostname: 'securedomain.com',
        secure: true,
        port: 443,
        rejectUnauthorized: false // Only necessary during debug if using a self-signed certificate
      }
      ```
    </td>
  </tr>
  <tr>
    <td>
      listen(port, options, fn)
    </td>
    <td>
      Create a SocketCluster server instance which is already attached to an HTTP server instance and ready to use.
    </td>
  </tr>
</table>
