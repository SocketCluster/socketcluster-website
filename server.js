var SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
  workers: 1,
  stores: 1,
  port: 80,
  appName: 'app',
  workerController: __dirname + '/worker.js',
  balancerController: __dirname + '/balancer.js',
  storeController: __dirname + '/store.js',
  addressSocketLimit: 0,
  socketEventLimit: 100,
  rebootWorkerOnCrash: true,
  downgradeToUser: 'ec2-user'
});
