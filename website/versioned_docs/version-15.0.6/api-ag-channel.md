---
id: version-15.0.6-api-ag-channel
title: AGChannel
sidebar_label: AGChannel
original_id: api-ag-channel
---

## Inherits from

[WritableConsumableStream](https://github.com/SocketCluster/writable-consumable-stream)

## Properties

<table>
  <tr>
    <td>name</td>
    <td>The channel's name. Must be a string.</td>
  </tr>
  <tr>
    <td>state</td>
    <td>Holds a string which indicates the state of this channel. Can be 'subscribed', 'unsubscribed' or 'pending'.</td>
  </tr>
  <tr>
    <td>options</td>
    <td>
      An object with the following keys:
      <ul>
        <li><code>waitForAuth</code>: A boolean value which indicates whether or not this channel will wait for socket authentication before subscribing to the server. It will remain in the 'pending' state until the socket becomes authenticated.</li>
        <li><code>priority</code>: In case of a resubscribe (e.g. after recovering from a lost connection), this value determines the order in which channel subscriptions will be processed. Higher priority channels will be processed first. This value may be undefined.</li>
        <li><code>data</code>: Data which was passed along with the the channel subscription (if specified). This value can be accessed by the <code>SUBSCRIBE</code> action on the <code>MIDDLEWARE_INBOUND</code> middleware on the server side as part of the channel subscription.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>SUBSCRIBED</td>
    <td>A string constant which is used to indicate that this channel is in a subscribed state. See the state property above.</td>
  </tr>
  <tr>
    <td>PENDING</td>
    <td>A string constant which is used to indicate that this channel is in a pending state. See the state property above.</td>
  </tr>
  <tr>
    <td>UNSUBSCRIBED</td>
    <td>A string constant which is used to indicate that this channel is in an unsubscribed state. See the state property above.</td>
  </tr>
</table>

## Events

<table>
  <tr>
    <td>'subscribe'</td>
    <td>When the subscription succeeds. The object produced by the listener will have a <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'subscribeFail'</td>
    <td>Happens when the subscription fails. The object produced by the listener will have an <code>error</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'unsubscribe'</td>
    <td>When the channel becomes deactivated (unsubscribed from the server).</td>
  </tr>
  <tr>
    <td>'subscribeStateChange'</td>
    <td>Whenever the channel's subscription state changes. The object produced by the listener will have an <code>oldChannelState</code>, <code>newChannelState</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
</table>

## Methods

<table>
  <tr>
    <td>subscribe([options])</td>
    <td>Activate this channel so that it will receive all data published to it from the backend. You can provide an optional options object in the
      form <code>{waitForAuth: true, data: someCustomData}</code> (all properties are optional) - If waitForAuth is true, the channel
      will wait for the underlying socket to become authenticated before trying to subscribe to the server - This channel will then
      behave as a "private channel" - Note that in this case, "authenticated" means that the client socket has received a valid JWT authToken - Read about the server-side <code>socket.setAuthToken(tokenData)</code> function <a href="/docs/authentication">here</a> for more details.
      The <code>data</code> property of the <code>options</code> object can be used to pass data along with the subscription.
  </tr>
  <tr>
    <td>unsubscribe()</td>
    <td>Deactivate this channel.</td>
  </tr>
  <tr>
    <td>isSubscribed([includePending])</td>
    <td>Check whether or not this channel is active (subscribed to the backend). The includePending argument is optional; if true, the function will return true if the channel is in a pending state</td>
  </tr>
  <tr>
    <td>
      transmitPublish(data)
    </td>
    <td>
      Publish data to this channel. Do not expect a response from the server.
      The data argument can be any JSON-compatible object/array or primitive.
    </td>
  </tr>
  <tr>
    <td>
      invokePublish(data)
    </td>
    <td>
      Publish data to this channel. Expect a response from the server.
      The data argument can be any JSON-compatible object/array or primitive.
      This method returns a <code>Promise</code> which will be rejected if the operation fails.
      For example, it can be rejected if the <code>MIDDLEWARE_INBOUND</code> middleware blocks the action on the server side.
      The promise will resolve once the server has processed the publish action.
    </td>
  </tr>
  <tr>
    <td>
      listener(eventName)
    </td>
    <td>
      This method returns an event listener stream for the specified <code>eventName</code>. This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> which can be consumed with a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for-await-of loop</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeListener(eventName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>eventName</code> listener) to <code>break</code> after they have finished iterating over their current backlogs of events.
    </td>
  </tr>
  <tr>
    <td>
      closeAllListeners()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all listeners to <code>break</code> after they have finished consuming their respective backlogs of events.
    </td>
  </tr>
  <tr>
    <td>
      killListener(eventName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>eventName</code> listener to <code>break</code> immediately and will reset the backpressure for that listener to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllListeners()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all listeners to <code>break</code> immediately and will reset the aggregate backpressure for all listeners to 0.
    </td>
  </tr>
  <tr>
    <td>
      closeOutput()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the channel's output stream to <code>break</code> after they have finished consuming their backlogs of data.
    </td>
  </tr>
  <tr>
    <td>
      killOutput()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the channel's output stream to <code>break</code> immediately and will reset the aggregate backpressure for the channel's output stream to 0.
    </td>
  </tr>
  <tr>
    <td>
      close()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all of the channel's streams (including all listener streams) to <code>break</code> after they have finished consuming their backlogs of data.
    </td>
  </tr>
  <tr>
    <td>
      kill()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all of the channel's streams (including all listener streams) to <code>break</code> immediately and will reset the aggregate backpressure for the channel to 0.
    </td>
  </tr>
  <tr>
    <td>
      getBackpressure()
    </td>
    <td>
      Get the aggregate backpressure for all streams on the current channel. The aggregate backpressure represents the highest backpressure of all consumers.
    </td>
  </tr>
  <tr>
    <td>
      getOutputBackpressure()
    </td>
    <td>
      Get the aggregate backpressure for the main output stream of the current channel. The aggregate backpressure represents the highest backpressure of all consumers.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersBackpressure()
    </td>
    <td>
      Get the aggregate backpressure for all listener streams on the current channel. The aggregate backpressure represents the highest backpressure of all consumers.
    </td>
  </tr>
  <tr>
    <td>
      getListenerBackpressure(eventName)
    </td>
    <td>
      Get the aggregate backpressure for the <code>eventName</code> listener stream on the current channel. The aggregate backpressure represents the highest backpressure of all consumers for that listener.
    </td>
  </tr>
</table>

## Stream management methods

These methods should only be used for advanced use cases when you need more control over stream management; for example, when you want to <code>break</code> out of a specific consumer loop without affecting any other consumer.
These methods can also be useful to check that consumers are being cleaned up properly and to selectively kill specific consumers which are causing backpressure to build up.
For most use cases, you should try to stick to the methods in the table above as it will lead to cleaner logic.

<table>
  <tr>
    <td>
      getListenerConsumerStatsList(eventName)
    </td>
    <td>
      Get the list of consumers which are consuming data from the specified event listener. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming events from any listener on the channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killListenerConsumer(consumerId)
    </td>
    <td>
      This will cause the target listener consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
  <tr>
    <td>
      getOutputConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming output data from the channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killOutputConsumer(consumerId)
    </td>
    <td>
      This will cause the target channel output consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
</table>
