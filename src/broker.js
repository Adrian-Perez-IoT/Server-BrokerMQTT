// Broker MQTT
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const Notification = require ("./notifications.js");

const port = 1883

server.listen(port, function () {
  console.log('Servidor escuchando en puerto', port)
})

aedes.on('clientError', function (client, err) {
  // console.log('Un error en el cliente', client.id, err.message, err.stack)
  console.log('client error', client.id)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id)
    console.log('El topic es: ', packet.topic,' El mensaje es: ', packet.payload.toString());

  }
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})

