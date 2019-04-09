---
id: consumables-and-consumers
title: Consumables and Consumers
sidebar_label: Consumables and Consumers
---

In Asyngular, streams returned by functions such as `socket.listener(...)`, `socket.receiver(...)`, `socket.producer(...)` and `socket.channel(...)` are all [async iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#Iterating_over_async_iterables).

This means that you can iterate over any stream directly like this:

```js
for await (let data of socket.receiver('foo')) {
  // ...
}
```

Whenever you start iterating over a stream, a new async iterator will be created implicitly with a new (empty) message/event buffer.
This feature allows you to iterate over a single stream using multiple loops in parallel; each loop can `await` and process messages/events at its own pace.

## Consumables

While the pattern described above is succinct and conveninent, sometimes, you need more flexibility.
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

let socket = asyngularClient.create();

for await (let event of socket.listener('connect')) {
  socket.transmit('foo', 123);
}
```

In this case, the `socket.receiver('foo')` stream on the back end will not receive our client's `123` message - This is because the `receiver` stream will only create a new `Consumer`/`async iterator` when the `for-await-of` loop starts iterating; and because we added an `await doSomethingWhichTakesAFewSeconds()` statement before the `for-await-of` loop, any event transmitted by the client during this time period will be ignored/missed.

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

To fix this issue, you need to explicitly tell the Asyngular stream when to create the consumer. This can be done using the `stream.createConsumable()` method like this:

```js
// Back end.

(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will create a consumable which will start buffering messages immediately.
      let fooStreamConsumable = socket.receiver('foo').createConsumable();

      await doSomethingWhichTakesAFewSeconds();

      // This loop will start from the beginning of the buffer.
      for await (let data of fooStreamConsumable) {
        // ...
      }
    })();

  }
})();
```

Note that a consumable is an async iterable; therefore, it should only be consumed by a single loop. If multiple loops try to iterate over the same consumable, they will end up competing for each message (which can lead to unexpected behavior).


## Consumer

A [Consumer](https://github.com/SocketCluster/writable-consumable-stream/blob/master/consumer.js) is an async iterator. Using a `Consumer` directly is the most flexible, but most verbose way of consuming messages in Asyngular.

Using `Consumer` instances allows you to iterate over streams using regular `for` and `while` loops and to handle messages in more advanced ways.

For example, the code above could be rewritten as:

```js
// Back end.

(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will create a consumer which will start buffering messages immediately.
      let fooStreamConsumer = socket.receiver('foo').createConsumer();

      await doSomethingWhichTakesAFewSeconds();

      // This loop will start from the beginning of the buffer.
      while (true) {
        let packet = await fooStreamConsumer.next();
        if (packet.done) break;
        console.log('Packet:', packet.value);
      }
    })();

  }
})();
```

Note that a `Consumer` is an async iterator; therefore, it should only be consumed by a single loop.
