---
id: api-ag-exchange
title: AGExchange
sidebar_label: AGExchange
---

## Inherits from

[AsyncStreamEmitter](https://github.com/SocketCluster/async-stream-emitter#async-stream-emitter)

## Events

<table>
  <tr>
    <td>'subscribe'</td>
    <td>When the subscription succeeds. The object produced by the listener will have a <code>channel</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'subscribeFail'</td>
    <td>Happens when the subscription fails. The object produced by the listener will have an <code>error</code>, <code>channel</code> and <code>subscriptionOptions</code> property.</td>
  </tr>
  <tr>
    <td>'unsubscribe'</td>
    <td>When the exchange becomes unsubscribed from a channel. The object produced by the listener will have a <code>channel</code> property.</td>
  </tr>
</table>

## Methods

<table>
  <tr>
    <td>transmitPublish(channel, data)</td>
    <td>
      Publish data to the specified <code>channelName</code>. Do not expect a response from the back end broker.
      The <code>channelName</code> argument must be a string.
      The <code>data</code> argument can be any JSON-compatible object/array or primitive.
    </td>
  </tr>
  <tr>
    <td>invokePublish(channel, data)</td>
    <td>
      Publish data to the specified <code>channelName</code>. Expect a response from the broker.
      The <code>channelName</code> argument must be a string.
      The <code>data</code> argument can be any JSON-compatible object/array or primitive.
      This method returns a <code>Promise</code> which will be rejected if the operation fails.
      The promise will resolve once the server has processed the publish action.
    </td>
  </tr>
  <tr>
    <td>subscribe(channelName)</td>
    <td>
      Subscribe to a channel.
      This function returns an <a href="api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> and lets you consume data that is published to the channel.

To consume a channel, it is recommended to use a `for-await-of` loop like this:

```js
for await (
let data of agServer.exchange.channel('myChannel')
) {
// Consume channel data...
}
```

Because the `socket.subscribe(...)` method returns an `AGChannel` instance, you can also consume it directly like this:

```js
for await (
let data of agServer.exchange.subscribe('myChannel')
) {
// Consume channel data...
}
```

Note that `agServer.exchange.subscribe(...)` can be called multiple times for the same channel; if already subscribed, the method will only return the channel.
    </td>
  </tr>
  <tr>
    <td>unsubscribe(channelName)</td>
    <td>
      Unsubscribe from the specified channel. This makes any associated <a href="api-ag-channel">AGChannel</a> object inactive.
      You can reactivate the <a href="api-ag-channel">AGChannel</a> object by calling <code>subscribe(channelName)</code> again at a later time.
    </td>
  </tr>
  <tr>
    <td>channel(channelName)</td>
    <td>
      Returns an <a href="api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a>.
      This method is different from <code>socket.subscribe(...)</code> in that it will not try to subscribe to that channel.
      The returned channel will be inactive initially.
      You can call <code>channel.subscribe()</code> later to activate that channel when required.
    </td>
  </tr>
  <tr>
    <td>
      subscriptions(includePending)
    </td>
    <td>
      Returns an array of active channel subscriptions which this exchange client is bound to.
      If <code>includePending</code> is true, pending subscriptions will also be included in the list.
    </td>
  </tr>
  <tr>
    <td>
      isSubscribed(channelName, [includePending])
    </td>
    <td>
      Check if exchange client is subscribed to channelName.
      If <code>includePending</code> is true, pending subscriptions will also be included in the list.
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
      Get the list of all consumers which are consuming data from any listener on the exchange instance. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
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
      channelGetOutputConsumerStatsList(channelName)
    </td>
    <td>
      Get the list of consumers which are consuming output data from the specified channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      channelGetAllListenersConsumerStatsList(channelName)
    </td>
    <td>
      Get the list of all consumers which are consuming events from any listener on the specified channel. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelOutputsConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming output data from all channels which are bound to the exchange instance. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelListenersConsumerStatsList()
    </td>
    <td>
      Get the list of all consumers which are consuming events from any listener on all channels associated with the exchange instance. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
    </td>
  </tr>
  <tr>
    <td>
      killChannelOutputConsumer(consumerId)
    </td>
    <td>
      This will cause the target channel output consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
  <tr>
    <td>
      killChannelListenerConsumer(consumerId)
    </td>
    <td>
      This will cause the target channel listener consumer's <code>for-await-of</code> loop to <code>break</code> immediately.
    </td>
  </tr>
</table>
