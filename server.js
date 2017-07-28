var SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
  workers: 1,
  brokers: 1,
  port: 80,
  appName: 'sc-website',
  workerController: __dirname + '/worker.js',
  balancerController: __dirname + '/balancer.js',
  brokerController: __dirname + '/broker.js',
  addressSocketLimit: 0,
  socketEventLimit: 100,
  pingTimeout: 10000,
  pingInterval: 4000,
  rebootWorkerOnCrash: true,
  downgradeToUser: 'ubuntu'
});
