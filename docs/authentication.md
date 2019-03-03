---
id: authentication
title: Authentication
sidebar_label: Authentication
---

## Design overview

The default authentication mechanism in Asyngular is JWT; it is essentially the same as it was in SocketCluster; the main difference is that any function which used to accept a callback will now return a `Promise` instead. Like in SocketCluster, you can use either the HTTP-based flow or the WebSocket-based flow for doing authentication. See the [SocketCluster guide](https://socketcluster.io/#!/docs/authentication) for more details.

The custom `authKey` string which you pass as an option to the `AGServer` constructor will be used to sign and verify JWT tokens from client sockets.
The initial authentication phase occurs automatically as part of the socket handshake. Authentication can also be done at runtime on a connected socket using the client's `socket.authenticate(...)` method.

## API overview

### HTTP flow

The best (and also simplest) way to do authentication in Asyngular over HTTP is by creating and signing a new JWT token from express and then sending it to the client side (as a string in the HTTP response). Once you have the token on the client side, you need to add it to localStorage under the key `'asyngular.authToken'` (this is the default JWT localStorage key for Asyngular). The Asyngular client socket will automatically pick up the JWT from local storage when a new connection is created.

When you create and sign the JWT token inside your HTTP express route, you need to use the same key which was specified as `authKey` when you instantiated the Asyngular `AGServer`.

You can create the JWT token however you like (so long as it meets JWT specifications). In Node.js, you can use the `jsonwebtoken` module directly: https://www.npmjs.com/package/jsonwebtoken

or for convenience you can also use Asyngular's `agServer.auth.signToken(...)` function like this:

```js
// Sample token data, don't store any sensitive/secret data here
// it will be signed but not encrypted.
var myTokenData = {
  username: 'bob',
  language: 'English',
  company: 'Google',
  groups: ['engineering', 'science', 'mathematics']
};

// agServer.signatureKey below is the key which Asyngular uses to sign the token.
// By default, agServer.signatureKey is equal to agServer.options.authKey
// (and also equal to agServer.verificationKey); but these may differ if you
// switch to a different JWT algorithm in the future.

let signedTokenString;
try {
  signedTokenString = await agServer.auth.signToken(myTokenData, agServer.signatureKey);
} catch (error) {
  // ... Handle failure to sign token.
  return;
}

// The signedTokenString variable is the signed JWT token; you can send it
// to your frontend however you like (e.g. in HTTP response). Once it reaches
// the frontend, you should add it to localStorage under the key
// 'asyngular.authToken'- By doing this, the Asyngular client will automatically
// pick up the JWT token when doing its handshake/connection.
```

### WebSocket flow

A sample WebSocket-based authentication flow might look like this:

```js
// Client code
socket = asyngularClient.create();

// The 'connect' event carries a status object which has a
// boolean 'isAuthenticated' property - It will be true if the client socket carried
// a valid token at the time the connection was established.
// The status object may also have an 'authError' property (which contains an
// Error object) if the JWT authentication failed during the handshake.

let status = await socket.listener('connect').once();

if (status.isAuthenticated) {
  // goToMainScreen();
} else {
  // goToLoginScreen();
}
```

Assume that the user is not authenticated and so they are sent to the login screen. We log them in by emitting a 'login' event from the client:

```js
// Client code

var credentials = {
  username: 'alice123',
  password: 'thisisapassword654'
};

try {
  await Promise.race([
    socket.emit('login', credentials),
    socket.listener('authenticate').once()
  ]);
} catch (error) {
  // showLoginError(err);
  return;
}

// goToMainScreen();
```
