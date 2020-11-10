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
    //aqui la logica para identificar si el mensaje publicado es una posible amenaza
    /* console.log('Message from client', client.id); */
    //agregar logia switch case --> topic motion, door, gas. 
    if (packet.topic.toString() == "Home/LivingRoom/Motion001") {
      // console.log('Se recibio una publicacion en el topic:', packet.topic, ' Con el mensaje: ', packet.payload.toString()); // Convertir en JSON el paload. evaluarlo (identif sensor). Y notificar (llamar a la funcion) a la app VigBee ().      
      let amenaza = JSON.parse(packet.payload.toString()); //amenaza debe ser un JSON. ¿Como lo creo?
      if (amenaza["value"] == "true") {
        // añadir la logica para que se notifique cada minuto (para no hacerlo cada 5 segundos que saturarà la app vigbee/Backend FCM/ Backend MQTT?
        console.log('Se notificará la amenaza de movimiento:', amenaza);
        amenaza["tokenId"] = "esXH_nLk5F0:APA91bGIPzBuU0yAHAe2wfLlGZYEhfuMO0o8sHDb3CAsr1ZzcnPmIcqrZwP4mSvX5aB2qoLYLgG7W2_A-iaE0gq4m0qSXyYY2gKAWPLxw9aK6wm058-jdYGXyuGrLnbt-PF8YhxjPx9l";
        amenaza["titulo"] = "Alerta de posible amenaza";
        amenaza["mensaje"] = "Movimiento detectado";
        Notification.sendAlert(amenaza);// ERROR AQUI . CORREGIR MAÑANA: --> DATA DEBE CONETENR UNICAMENTE CALORES STRING        
      }
    }

    // data = JSON.parse(packet.payload.toString()); // para experimentar si se puede o no.

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

