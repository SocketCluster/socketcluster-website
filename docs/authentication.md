---
id: authentication
title: Authentication
sidebar_label: Authentication
---

## Feature overview

The default authentication mechanism in Asyngular is JWT; it is essentially the same as it was in SocketCluster; the main difference is that any function which accepted a callback will now return a `Promise` instead. Like in SocketCluster, you can use either the HTTP-based flow or the WebSocket-based flow for doing authentication. See the [SocketCluster guide](https://socketcluster.io/#!/docs/authentication) for more details.

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
let myTokenData = {
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
// to your front end however you like (e.g. in HTTP response).
```

Once you have the JWT token on the front end, you should add it to localStorage under the key `'asyngular.authToken'` - By doing this, the Asyngular client will automatically pick up the JWT token when doing its handshake/connection.

In the browser, you can add the token to localStorage like this:

```js
localStorage.setItem('asyngular.authToken', token);
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

let credentials = {
  username: 'alice123',
  password: 'thisisapassword654'
};

try {
  // Invoke a custom 'login' procedure (RPC) on our server socket.
  await socket.invoke('login', credentials);
} catch (error) {
  // showLoginError(err);
  return;
}

// If this runs, it means that our custom login RPC was successful, so now we
// wait for the 'authenticate' to complete on the client socket.
// Note that using the default client side authEngine (which stores the token in
// localStorage), this action will always trigger and cannot fail at this point.
await socket.listener('authenticate').once();

// goToMainScreen();
```

On the server, we would need some code to process the login:

```js
// Server code

// This is a slightly simplified version of what it might look
// like if you were using MySQL as a database.

(async () => {
  for await (let request of socket.procedure('login')) {
    let passwordHash = sha256(credentials.password);

    let userQuery = 'SELECT * FROM Users WHERE username = ?';
    let userData;
    try {
      let rows = await mySQLClient.query(userQuery, [credentials.username]);
      userData = rows[0];
    } catch (error) {
      let loginError = new Error(`Could not find a ${credentials.username} user`);
      loginError.name = 'LoginError';
      request.error(loginError);

      return;
    }

    let isValidLogin = userData && userData.password === passwordHash;
    if (!isValidLogin) {
      let loginError = new Error('Invalid user credentials');
      loginError.name = 'LoginError';
      request.error(loginError);

      return;
    }

    // End the 'login' request successfully.
    request.end();

    // This will give the client a token so that they won't
    // have to login again if they lose their connection
    // or revisit the app at a later time.
    socket.setAuthToken({username: credentials.username, channels: userData.channels});
  }
})();
```

### Verify and use the JWT token

You can verify and read the JWT token in the same way regardless of whether you used the HTTP or WebSocket auth flow. Once the token has been set/captured by Asyngular,
you can access it from inside your middleware functions (example using a `PUBLISH_IN` action inside the `MIDDLEWARE_INBOUND` middleware):

```js
// Server code

agServer.addMiddleware(agServer.MIDDLEWARE_INBOUND, async (middlewareStream) => {
  for await (let action of middlewareStream) {

    if (action.type === action.PUBLISH_IN) {
      let authToken = action.socket.authToken;
      if (
        !authToken ||
        !Array.isArray(authToken.channels) ||
        authToken.channels.indexOf(action.channel) === -1
      ) {
        let publishError = new Error(
          `You are not authorized to publish to the ${action.channel} channel`
        );
        publishError.name = 'PublishError';
        action.block(publishError);

        continue; // Go to the start of the loop to process the next inbound action.
      }
    }

    // Any unhandled case will be allowed by default.
    action.allow();
  }
});
```

!! Note that in this case, the token contains all the information that we need to authorize this publish action, but we didn't really need to store the `channels` list inside the JWT - An alternative approach would have been to fetch the user account details from the database using the username from the JWT (but it would require an extra database lookup; bad for performance). See the section on [middleware and authorization](middleware-and-authorization.md) for more info about middleware in Asyngular.
