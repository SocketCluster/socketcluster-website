---
id: version-14.4.2-authentication
title: Authentication
sidebar_label: Authentication
original_id: authentication
---
 
## Overview

Before v1.3.0, authentication in SocketCluster revolved around sessions. Since v1.3.0, authentication is based on
[JSON Web Token (JWT)](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32). SC's auth token system was designed to solve the following problems:

* Allow the user to stay logged in after they recover from a lost connection without having to enter their credentials again.
* Allow a user to be authenticated across all open browser tabs by logging in using only one of them. (Sharing an auth token between multiple browser tabs).

An important design consideration for SC's authentication system was that it had to work with, but yet be fully independent
from specific database engines or underlying data (this includes user account information).
To achieve this, SC had to introduce the notion of a JWT auth token.

Simply put, an auth token is a custom Object/JSON which is signed with a secret authKey on the server and sent to a client as part of an
authentication (login) process (see authKey option in SocketCluster constructor [here](api-socketcluster)).
Because the data in the token is signed when provided to the client, they cannot modify it without invalidating the token.
This means that if your socket on the server has a valid auth token attached to it
(see [socket.authToken](api-scsocket-server)), then you know that the client's token was signed by the server
and the data that is inside it is therefore valid.

Some important things to note about an auth token is that you should only give it to a client AFTER they have been successfully
authenticated and also it should be kept secret between that user and the server (not shared with any other user).
Auth tokens in SC can be used to store any kind of access-control information related to a specific user.
Generally, it will suffice to create a simple token containing only the username data:

```js
{
  username: 'bob123'
}
```

## Authentication flow

There is no single correct way to implement authentication in SC. You can perform auth over HTTP (before establishing the WebSocket connection) or you can do it after.

### HTTP-based flow

For details about HTTP-based authentication, [see this discussion](https://github.com/SocketCluster/socketcluster/issues/233#issuecomment-254871963). Make sure that you read the follow-up comments too (they go into more detail).

### WebSocket-based flow

A sample WebSocket-based authentication flow might look like this:

```js
// Client code
// Use socketCluster.connect() if
// socketcluster-client < v10.0.0
socket = socketCluster.create();

// The 'connect' event carries a status object which has a
// boolean 'isAuthenticated' property - It will be true if the socket carried
// a valid token at the time the connection was established.
// The status object may also have an 'authError' property (which contains an
// Error object) if JWT authentication failed during the handshake.
socket.on('connect', function (status) {
  if (status.isAuthenticated) {
    // goToMainScreen();
  } else {
    // goToLoginScreen();
  }
}
```

Assume that the user is not authenticated and so they are sent to the login screen.
We log them in by emitting a 'login' event from the client:

```js
// Client code

var credentials = {
  username: 'alice123',
  password: 'thisisapassword654'
};

socket.emit('login', credentials, function (err) {
  // This callback handles the response from the server.
  // If we wanted, we could have listened to a separate 'loginResponse'
  // event, but this pattern of passing a callback like this
  // is slightly more efficient.

  if (err) {
    // showLoginError(err);
  } else {
    // goToMainScreen();
  }
});
```

Then we would have some code on the server to process the login:

```js
// Server code

// This is a slightly simplified version of what it might look
// like if you were using MySQL as a database.

socket.on('login', function (credentials, respond) {
  var passwordHash = sha256(credentials.password);

  var userQuery = 'SELECT * FROM Users WHERE username = ?';
  mySQLClient.query(userQuery, [credentials.username], function (err, rows) {
    var userRow = rows[0];
    var isValidLogin = userRow && userRow.password === passwordHash;

    if (isValidLogin) {
      respond();

      // This will give the client a token so that they won't
      // have to login again if they lose their connection
      // or revisit the app at a later time.
      socket.setAuthToken({username: credentials.username, channels: userRow.channels});
    } else {
      // Passing string as first argument indicates error
      respond('Login failed');
    }
  });
});
```

### Checking and using the token

You can verify/read the JWT token in the same way regardless of whether you used the HTTP or WebSocket auth flow.
Once the token has been set/captured by SC, the best place to make use of it is in your middleware functions (example using publish middleware):

```js
// Server code

wsServer.addMiddleware(wsServer.MIDDLEWARE_PUBLISH_IN, function (req, next) {
  var authToken = req.socket.authToken;

  if (authToken && authToken.channels.indexOf(req.channel) > -1) {
    next();
  } else {
    next('You are not authorized to publish to ' + req.channel);
  }
});
```

Note that in this case, the token contains all the information that we need to authorize this publish action, but we didn't
really need to store the channel list inside the token itself - We could just check the database provided that we have a
username or a user id. See section on [middleware and authorization](middleware-and-authorization)
for more info about middleware in SC.

If you want to do authentication over HTTP (before establishing a WebSocket connection), you will need to handle the token yourself.
See [this comment](https://github.com/SocketCluster/socketcluster/issues/233#issuecomment-254871963). Note that SC
now provides a default 'AuthEngine' for signing (creating) and verifying tokens on the server side - You can access it in your
workerController (worker.js) from the 'worker.auth' property - See the implementation here: [Default server auth engine](https://github.com/SocketCluster/sc-auth/blob/master/index.js)</a>.
More info about Node.js JSON web token library can be found here: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

### Videos by Nick Kotenberg

* [013 Client side logins authentication with SocketCluster with the client](https://www.youtube.com/watch?v=5xbEynJzwzk)