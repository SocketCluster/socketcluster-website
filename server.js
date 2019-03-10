var SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
  workers: 1,
  brokers: 1,
  port: 8000,
  appName: 'sc-website',
  wsEngine: 'ws',
  workerController: __dirname + '/worker.js',
  balancerController: __dirname + '/balancer.js',
  brokerController: __dirname + '/broker.js',
  addressSocketLimit: 0,
  socketEventLimit: 100,
  pingTimeout: 10000,
  pingInterval: 4000,
  rebootWorkerOnCrash: true
});

//todo add meta tags to the pages for SEO optimization, available at http://tools.seobook.com/meta-medic/
//todo add team member cards under services, available at https://themes.getbootstrap.com/
