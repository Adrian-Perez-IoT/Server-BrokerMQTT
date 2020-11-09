// Broker MQTT
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const Notification = require("./notifications.js");

const port = 1883

console.log(`Environment: ${process.env.NODE_ENV}`);

server.listen(port, function () {
  console.log('Servidor escuchando en puerto', port)
})

aedes.on('clientError', function (client, err) {
  // console.log('Un error en el cliente', client.id, err.message, err.stack)
  // console.log('client error', client.id)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Message from client', client.id);
    console.log('El topic es: ', packet.topic, ' El mensaje es: ', packet.payload.toString()); // Convertir en JSON el paload. evaluarlo (identif sensor). Y notificar (llamar a la funcion) a la app VigBee ().
    //aqui la logica para identificar si el mensaje publicado es un posible amenaza
    let posibleAmenaza = packet.payload.toString(); //posibleAmenaza debe ser un JSON. ¿Como lo creo?
    
    amenaza[tokenId] = "esXH_nLk5F0:APA91bGIPzBuU0yAHAe2wfLlGZYEhfuMO0o8sHDb3CAsr1ZzcnPmIcqrZwP4mSvX5aB2qoLYLgG7W2_A-iaE0gq4m0qSXyYY2gKAWPLxw9aK6wm058-jdYGXyuGrLnbt-PF8YhxjPx9l";
    amenaza[titulo] = "Alerta de posible amenaza";
    amenaza[mensaje] = "Movimientos detectado recientemente en tu casa";
    // convertir en JSON. (Deserializar). Es requisito para enviar un json al VigBee    
    Notification.sendAlert(amenaza);
    data = JSON.parse(packet.payload.toString()); // para experimentar si se puede o no.
    console.log('El pyload convertido a JSON con el metodo parse es (prety): ', data);
    /* var payload = {
      notification: {
        title: "Alerta de posible amenaza",
        body: "Un movimiento en tu casa fue detectado recientemente."
      },
      data = JSON.parse(packet.payload.toString()),
      data['tokenId'] : "esXH_nLk5F0:APA91bGIPzBuU0yAHAe2wfLlGZYEhfuMO0o8sHDb3CAsr1ZzcnPmIcqrZwP4mSvX5aB2qoLYLgG7W2_A-iaE0gq4m0qSXyYY2gKAWPLxw9aK6wm058-jdYGXyuGrLnbt-PF8YhxjPx9l"
    }; */
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

