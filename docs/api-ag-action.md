---
id: api-ag-action
title: AGAction
sidebar_label: AGAction
---

## Properties

<table>
  <tr>
    <td>type</td>
    <td>
      This field exists on all <code>AGAction</code> instances. It represents the type of the action as a string. It can be used by a middleware function to decide whether to allow or block an action.
    </td>
  </tr>
  <tr>
    <td>request</td>
    <td>
      This field only exists on actions of type <code>HANDSHAKE_WS</code> and <code>HANDSHAKE_AG</code>. It holds a Node.js <a href="https://nodejs.org/api/http.html#http_class_http_incomingmessage">http.IncomingMessage</a> object.
    </td>
  </tr>
  <tr>
    <td>socket</td>
    <td>
      This field exists on all action types except for the <code>HANDSHAKE_WS</code> action. It holds the <a href="/docs/api-ag-server-socket">AGServerSocket</a> whose corresponding client initiated the action.
    </td>
  </tr>
  <tr>
    <td>data</td>
    <td>
      This field exists on all action types except for <code>HANDSHAKE_WS</code>, <code>HANDSHAKE_AG</code> and <code>AUTHENTICATE</code> actions. It holds the payload associated with the action.
    </td>
  </tr>
  <tr>
    <td>receiver</td>
    <td>
      This field exists only on the <code>TRANSMIT</code> action. It represents the name of the receiver which this action would trigger if it is allowed through by the middleware.
    </td>
  </tr>
  <tr>
    <td>procedure</td>
    <td>
      This field exists only on the <code>INVOKE</code> action. It represents the name of the procedure which this action will invoke if it is allowed through by the middleware.
    </td>
  </tr>
  <tr>
    <td>channel</td>
    <td>
      This field exists only on the <code>SUBSCRIBE</code>, <code>PUBLISH_IN</code> and <code>PUBLISH_OUT</code> actions. It represents the name of the channel which this action would affect if it is allowed through by the middleware.
    </td>
  </tr>
  <tr>
    <td>signedAuthToken</td>
    <td>
      This field exists only on the <code>AUTHENTICATE</code> action. It represents the signed auth token which was used by the client for authentication. This value can be  <code>null</code>.
    </td>
  </tr>
  <tr>
    <td>authToken</td>
    <td>
      This field exists only on the <code>AUTHENTICATE</code> action. It represents the raw auth token data which was used by the client for authentication. This value can be  <code>null</code>.
    </td>
  </tr>
  <tr>
    <td>outcome</td>
    <td>The outcome of the action. Can be <code>null</code>, <code>'allowed'</code> or <code>'blocked'</code> depending on which method was called on the action.</td>
  </tr>
  <tr>
    <td>promise</td>
    <td>A <code>Promise</code> which will resolve or reject depending on whether the action was allowed or blocked. This property is mostly meant for internal use by SocketCluster middleware.</td>
  </tr>
  <tr>
    <td>HANDSHAKE_WS</td>
    <td>A string constant which is used to indicate that an action is a low level WebSocket handshake action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>HANDSHAKE_AG</td>
    <td>A string constant which is used to indicate that an action is an SocketCluster handshake action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>MESSAGE</td>
    <td>A string constant which is used to indicate that an action is a message action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>TRANSMIT</td>
    <td>A string constant which is used to indicate that an action is a transmit action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>INVOKE</td>
    <td>A string constant which is used to indicate that an action is an invoke action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>SUBSCRIBE</td>
    <td>A string constant which is used to indicate that an action is a subscribe action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>PUBLISH_IN</td>
    <td>A string constant which is used to indicate that an action is an inbound publish action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>PUBLISH_OUT</td>
    <td>A string constant which is used to indicate that an action is an outbout publish action. See the <code>type</code> property above.</td>
  </tr>
  <tr>
    <td>AUTHENTICATE</td>
    <td>A string constant which is used to indicate that an action is an authenticate action. See the <code>type</code> property above.</td>
  </tr>
</table>

## Methods

<table>
  <tr>
    <td>allow([packet])</td>
    <td>
      Allow an action to be processed by the back end server/socket logic. This method accepts an optional <code>packet</code> argument; if provided, the packet will be used as the action payload instead of <code>action.data</code>. This allows middleware to transform data from clients before it is handled by the back end logic.
    </td>
  </tr>
  <tr>
    <td>block(error)</td>
    <td>
      Prevent an action from reaching the back end server/socket logic. This method accepts an <code>Error</code> as argument. This error will be sent to the client which initiated the action.
    </td>
  </tr>
</table>
