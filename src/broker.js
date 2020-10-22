// Broker MQTT

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)

// import ws from 'websocket-stream'

const port = 1883

server.listen(port, function () {
  console.log('server listening on port', port)
})

// aedes.on('clientError', function (client, err) {
//   console.log('client error', client.id, err.message, err.stack)
// })

// aedes.on('connectionError', function (client, err) {
//   console.log('client error', client, err.message, err.stack)
// })

// aedes.on('publish', function (packet, client) {
//   if (client) {
//     console.log('message from client', client.id)
//   }
// })

// aedes.on('subscribe', function (subscriptions, client) {
//   if (client) {
//     console.log('subscribe from client', subscriptions, client.id)
//   }
// })

// aedes.on('client', function (client) {
//   console.log('new client', client.id)
// })

// console.log(`Environment: ${process.env.NODE_ENV}`);