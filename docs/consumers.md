---
id: consumers
title: Consumers
sidebar_label: Consumers
---

## Overview

In SocketCluster, streams returned by functions such as `socket.listener(...)`, `socket.receiver(...)`, `socket.procedure(...)` and `socket.channel(...)` are all [async iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#Iterating_over_async_iterables).

This means that you can iterate over any stream directly like this:

```js
for await (let data of socket.receiver('foo')) {
  // ...
}
```

Whenever you start iterating over a stream, a new async iterator will be created implicitly with a new (empty) message/event buffer.
This feature allows you to iterate over a single stream using multiple loops in parallel; each loop can `await` and process messages/events at its own pace.

While the pattern described above is succinct and conveninent, sometimes, you need more flexibility. For example:

- You may want to break out of specific `for-await-of` loops individually (without killing the entire stream along with all other loops that are running in parallel).
- You may want to start buffering data for some time before you start asynchronously iterating over it to consume it.

The sections below provide an overview of how to achieve these two things.
For additional information about how to consume streams in SocketCluster, see the [WritableConsumableStream repo](https://github.com/SocketCluster/writable-consumable-stream#writable-consumable-stream).

### Breaking out of a specific loop

Sometimes you want your `for-await-of` loops to behave more like `EventEmitter` instances; for example, `eventEmitter.removeAllListeners(eventName)` is not suitable for a lot of cases, instead you may want something similar to `eventEmitter.removeListener(eventName, listener)`. This can be easily achieved using a `Consumer` instance like this:

```js
// Back end.

let connectionConsumerA = agServer.listener('connection').createConsumer();
let connectionConsumerB = agServer.listener('connection').createConsumer();

(async () => {
  for await (let {socket} of connectionConsumerA) {
    console.log(`Consumer ${connectionConsumerA.id} handled connection: ${socket.id}`);
  }
})();

(async () => {
  for await (let {socket} of connectionConsumerB) {
    console.log(`Consumer ${connectionConsumerB.id} handled connection: ${socket.id}`);
  }
})();

setTimeout(() => {
  // Kill only connectionConsumerA.
  connectionConsumerA.kill();
}, 1000);
```

Note that instances in SC also expose various stream management methods for monitoring and killing multiple consumers from a central place but the approach above is recommended as it makes it easier to follow the logic.

### Buffering before consuming

For example, you may want to `await` for a back end operation to complete before processing events from a `receiver`.

Consider this naive approach:

```js
// Back end.

(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      await doSomethingWhichTakesAFewSeconds();

      for await (let data of socket.receiver('foo')) {
        // ...
      }
    })();

  }
})();
```

Assume that your client has this logic:

```js
// Front end.

let socket = socketClusterClient.create();

for await (let event of socket.listener('connect')) {
  socket.transmit('foo', 123);
}
```

In this case, the `socket.receiver('foo')` stream on the back end will not receive our client's `123` message; this is because we added an `await doSomethingWhichTakesAFewSeconds()` statement before the `for await (let data of socket.receiver('foo')) {...}` loop.
Any message which arrives on the socket before the loop begins iterating will be ignored/missed (and not buffered).

Note that simply instantiating the stream sooner and putting it inside a variable will **not** fix the issue:

```js
// Back end.

(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will not work because the iterator is not yet created at this point.
      let fooStream = socket.receiver('foo');

      // If any messages arrive during this time, they will be ignored!
      await doSomethingWhichTakesAFewSeconds();

      // The iterator gets created (and starts buffering) here!
      for await (let data of fooStream) {
        // ...
      }
    })();

  }
})();
```

To fix this issue, you need to explicitly tell the SocketCluster stream when to create the consumer. This can be done using the `stream.createConsumer()` method like this:

```js
// Back end.

(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will create a consumable which will start buffering messages immediately.
      let fooStreamConsumable = socket.receiver('foo').createConsumer();

      await doSomethingWhichTakesAFewSeconds();

      // This loop will start from the beginning of the buffer.
      for await (let data of fooStreamConsumable) {
        // ...
      }
    })();

  }
})();
```

Note that a consumer is an `asyncIterable`; therefore, it should only be consumed by a single loop. If multiple loops try to iterate over the same consumer, they will end up competing for each message (which can lead to unexpected behavior).

## Changes from v15 to v16

### Consumable was removed

In `v15`, the role of `Consumable` and `Consumer` were distinct. This added unnecessary complexity and confusion, so `Consumable` was removed in `v16` and `Consumer` was made into an `asyncIterable` so that it could fullfill both roles.

This change means that the `createConsumable()` method was also removed; you can now simply use `createConsumer()` in its place.

### Consumer now has a limited lifespan

Since `v16`, a consumer has a limited lifespan and cannot be reused after it is killed.
When a stream is killed, closed or the consumer breaks out of its `for-await-of` loop, the consumer will no longer be usable. In order to start a new `for-await-of` loop, you will need to create a new consumer again using the `createConsumer()` method.
A new `isAlive` property was added on the consumer instance which can be used to check if the consumer is usable. By default, the consumer is alive and it can be killed if either its parent stream is killed or if it is killed individually based on `id` using `close` or `kill` methods such as (for example) `socket.killListenerConsumer(myConsumer.id)`. Note that if you have a reference to the `Consumer` instance, you can simply call `consumer.kill()`.
