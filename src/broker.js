// Broker MQTT
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const Notification = require("./notifications.js");

const port = 1883

console.log(`Environment: ${process.env.NODE_ENV}`);

server.listen(port, function () {
  console.log('Servidor MQTT escuchando en puerto: ', port);
})

aedes.on('clientError', function (client, err) {
  // console.log('Un error en el cliente', client.id, err.message, err.stack)
  // console.log('client error', client.id)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

let paso1minutoUltimoMovimiento = true; // para marcar cuando haya pasado 30 segundos y enviar notificacion push a la app movil Vigbee
let paso1minutoUltimoAperturaPorton = true;
let paso1minutoUltimoDetecGas = true;

//la funcion qye se ajecuta debera ser asinconica? /buscar tutoriales con mqtt aedes)
aedes.on('publish', function (packet, client) {
  if (client) {
    /* console.log('Message from client', client.id); */
    if ((packet.topic.toString() == "Casa/LivingRoom/Movimiento") || (packet.topic.toString() == "Casa/Garage/Porton") || (packet.topic.toString() == "Casa/Cocina/MonoxidoCarbono")) {
      // console.log('Se recibio una publicacion en el topic:', packet.topic, ' Con el mensaje: ', packet.payload.toString()); // Convertir en JSON el paload. evaluarlo (identif sensor). Y notificar (llamar a la funcion) a la app VigBee ().      

      if (isJSON(packet.payload.toString())) {
        // console.log("Es un json");
        let mensajeMqtt = JSON.parse(packet.payload.toString()); //mensajeMqtt debe ser un JSON. ¿Como lo creo?
        if (mensajeMqtt["value"] == true) {
          // Notifica cada 5 minuto (para no saturar la app vigbee/Backend Firebase / Backend MQTT?
          console.log('Amenaza publicada:', mensajeMqtt);
          // mensajeMqtt["tokenId"] = "esXH_nLk5F0:APA91bGIPzBuU0yAHAe2wfLlGZYEhfuMO0o8sHDb3CAsr1ZzcnPmIcqrZwP4mSvX5aB2qoLYLgG7W2_A-iaE0gq4m0qSXyYY2gKAWPLxw9aK6wm058-jdYGXyuGrLnbt-PF8YhxjPx9l";
          mensajeMqtt["titulo"] = "Alerta de amenaza";
          mensajeMqtt["mensaje"] = `El sensor ${mensajeMqtt["sensor"]} detecto a las ${mensajeMqtt["time"]} hs una posible amenaza en su vivienda`;
          //Si paso 1 minutos desde la ultima notificacion, entonces notifico nuevamente. (para no saturar)        
          if ((paso1minutoUltimoMovimiento == true) && (packet.topic.toString() == "Casa/LivingRoom/Movimiento")) {
            Notification.guardarAmenaza(mensajeMqtt);
            Notification.sendAlert(mensajeMqtt);         // Esta funcion debe ser asyn. Demora aprox 1 a 3 segundos en recibir una respuesta del Servidor Backend FCM        }                    
            // console.log("Movimiento notificado al smartphone");
            paso1minutoUltimoMovimiento = false;
            // guardo amenaza en la BD (despues cambiar de lugar esta funcion)            
          }
          if ((paso1minutoUltimoAperturaPorton == true) && (packet.topic.toString() == "Casa/Garage/Porton")) {
            // Notification.sendAlert(mensajeMqtt);// Esta funcion debe ser asyn. Demora aprox 1 a 3 segundos en recibir una respuesta del Servidor Backend FCM
            // console.log("Apertura del porton notificado al smartphone");
            Notification.guardarAmenaza(mensajeMqtt);
            Notification.sendAlert(mensajeMqtt);         // Esta funcion debe ser asyn. Demora aprox 1 a 3 segundos en recibir una respuesta del Servidor Backend FCM        }        
            paso1minutoUltimoAperturaPorton = false;
          }
          if ((paso1minutoUltimoDetecGas == true) && (packet.topic.toString() == "Casa/Cocina/MonoxidoCarbono")) {
            // Notification.sendAlert(mensajeMqtt);// Esta funcion debe ser asyn. Demora aprox 1 a 3 segundos en recibir una respuesta del Servidor Backend FCM
            // console.log("Monoxido Carbono notificado al smartphone");
            Notification.guardarAmenaza(mensajeMqtt);
            Notification.sendAlert(mensajeMqtt);         // Esta funcion debe ser asyn. Demora aprox 1 a 3 segundos en recibir una respuesta del Servidor Backend FCM        }        
            paso1minutoUltimoDetecGas = false;
            
          }
          if ( (paso1minutoUltimoMovimiento) || (paso1minutoUltimoAperturaPorton) || (paso1minutoUltimoDetecGas)){
            // Notification.guardarAmenaza(mensajeMqtt);
          }
        }
      }
      else {
        console.log("ERROR Message: DATO recibido no es JSON");
      }


    }
  }
})

//Para ejecutar la funcion sendNotification cada 180000 milisegundos
function pasoXtiempo() {
  if (paso1minutoUltimoMovimiento == false) {
    // console.log("Paso x tiempo")
    paso1minutoUltimoMovimiento = true;
  }
  if (paso1minutoUltimoAperturaPorton == false) {
    // console.log("Paso x tiempo")
    paso1minutoUltimoAperturaPorton = true;
  }
  if (paso1minutoUltimoDetecGas == false) {
    // console.log("Paso x tiempo")
    paso1minutoUltimoDetecGas = true;
  }
}
//300000 mseg son 5 minutos
setInterval(pasoXtiempo, 7000)

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
});


function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}

async function guardarAmenaza(amenaza){ // agregar typado al argumento de la funcion 

}