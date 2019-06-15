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
      This function returns an <a href="/docs/api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a> and lets you consume data that is published to the channel.

To consume a channel, it is recommended to use a `for-await-of` loop like this:

```js
for await (
  let data of exchange.channel('myChannel')
) {
  // Consume channel data...
}
```

Because the `agServer.exchange.subscribe(...)` method returns an `AGChannel` instance, you can also consume it directly like this:

```js
for await (
  let data of exchange.subscribe('myChannel')
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
      Unsubscribe from the specified channel. This makes any associated <a href="/docs/api-ag-channel">AGChannel</a> object inactive.
      You can reactivate the <a href="/docs/api-ag-channel">AGChannel</a> object by calling <code>subscribe(channelName)</code> again at a later time.
    </td>
  </tr>
  <tr>
    <td>channel(channelName)</td>
    <td>
      Returns an <a href="/docs/api-ag-channel">AGChannel</a> instance - This object is an <a href="https://jakearchibald.com/2017/async-iterators-and-generators/">asyncIterable</a>.
      This method is different from <code>exchange.subscribe(...)</code> in that it will not try to subscribe to that channel.
      The returned channel will be inactive initially.
      You can call <code>channel.subscribe()</code> later to activate that channel when required.
    </td>
  </tr>
  <tr>
    <td>
      closeChannel(channelName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops (for the <code>channelName</code> channel and all of its listeners) to <code>break</code> after they have finished iterating over their current backlogs of events.
      This method is the recommended way to gracefully stop consuming channel data; you should not try to target a specific consumer/loop; instead, each consumer should be able to decide for themselves how to handle the break. The consumer could choose to immediately resume consumption of the channel stream like this (note that no data will be missed):

```js
while (exitConditionIsNotMet) {
  for await (
    let data of exchange.channel('myChannel')
  ) {
    // Consume channel data...
  }
}
```
</td>
  </tr>
  <tr>
    <td>
      channelCloseOutput(channelName)
    </td>
    <td>
      This method is like <code>closeChannel(channelName)</code> except that it only closes the main channel (output) stream. Listener consumers on the channel will not be affected.
    </td>
  </tr>
  <tr>
    <td>
      channelCloseAllListeners(channelName)
    </td>
    <td>
      This method is like <code>closeChannel(channelName)</code> except that it only closes listener streams on the channel. The main channel output stream will not be affected.
      To close specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="/docs/api-ag-channel">AGChannel API</a>.
    </td>
  </tr>
  <tr>
    <td>
      closeAllChannels()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all channels (and all of their listeners) to <code>break</code> after they have finished consuming their respective backlogs of events.
    </td>
  </tr>
  <tr>
    <td>
      killChannel(channelName)
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for the <code>channelName</code> channel (and all of its listeners) to <code>break</code> immediately. This will reset the backpressure for that channel (and all of its event listeners) to 0.
    </td>
  </tr>
  <tr>
    <td>
      channelKillOutput(channelName)
    </td>
    <td>
      This method is like <code>killChannel(channelName)</code> except that it only kills the main channel (output) stream. Listener consumers on the channel will not be affected.
    </td>
  </tr>
  <tr>
    <td>
      channelKillAllListeners(channelName)
    </td>
    <td>
      This method is like <code>killChannel(channelName)</code> except that it only kills listener streams on the channel. The main channel output stream will not be affected.
      To kill specific listeners (by <code>eventName</code>) on a specific channel, it's recommended that you use the <a href="/docs/api-ag-channel">AGChannel API</a>.
    </td>
  </tr>
  <tr>
    <td>
      killAllChannels()
    </td>
    <td>
      This method will signal to all consuming <code>for-await-of</code> loops for all channels (and all of of their listeners) to <code>break</code> immediately. This will reset the aggregate backpressure for all channels (and all of their event listeners) to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllChannelOutputs()
    </td>
    <td>
      This method is similar to <code>killAllChannels()</code> except that it only kills channel output streams; channel event listeners will not be affected. This will reset the aggregate backpressure for all channel output streams to 0.
    </td>
  </tr>
  <tr>
    <td>
      killAllChannelListeners()
    </td>
    <td>
      This method is similar to <code>killAllChannels()</code> except that it only kills channel listener streams; channel output streams will not be affected. This will reset the aggregate backpressure for all channel listener streams to 0.
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
  <tr>
    <td>
      getBackpressure()
    </td>
    <td>
      Get the aggregate backpressure for all streams on the exchange instance. The aggregate backpressure represents the highest backpressure of all consumers.
    </td>
  </tr>
  <tr>
    <td>
      getAllListenersBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>listener</code> streams on the exchange instance.
    </td>
  </tr>
  <tr>
    <td>
      getListenerBackpressure(eventName)
    </td>
    <td>
      Get the aggregate backpressure for the <code>eventName</code> listener stream on the exchange instance. The aggregate backpressure represents the highest backpressure of all consumers for that listener.
    </td>
  </tr>
  <tr>
    <td>
      getAllChannelsBackpressure()
    </td>
    <td>
      Get the aggregate backpressure of all <code>channel</code> streams on the exchange instance.
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
      Get the list of all consumers which are consuming output data from any channel which is bound to the exchange instance. This method returns a list of objects which have an <code>id</code> and <code>backpressure</code> property.
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
