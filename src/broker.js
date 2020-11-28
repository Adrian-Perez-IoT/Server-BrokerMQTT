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
          console.log('Amenaza publicada:', mensajeMqtt);
          let horario_exacto = obtenerHorario(mensajeMqtt["time"]);
          let sensor_name = (mensajeMqtt["sensor"] == "PIR") ? "de movimiento" : (mensajeMqtt["sensor"] == "MAGNETIC") ? "magnetico" : "de gas toxico";
          mensajeMqtt["titulo"] = (mensajeMqtt["sensor"] == "PIR") ? "Alerta de Movimiento" : (mensajeMqtt["sensor"] == "MAGNETIC") ? "Alerta Apertura del Porton" : "Peligro Monoxido de Carbono";
          mensajeMqtt["mensaje"] = `El sensor ${sensor_name} detecto a las ${horario_exacto} una posible amenaza.`;
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
          if ((paso1minutoUltimoMovimiento) || (paso1minutoUltimoAperturaPorton) || (paso1minutoUltimoDetecGas)) {
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

function obtenerHorario(timestamp) {
  /* LUEGO REFACTORIZAR ESTA FUNCION UTILIZANDO LA LIBRERIA MOMENT.JS CON TIMESTAMP */
  var data0 = new Date();
  var stringA = new Date(timestamp * 1000).toLocaleDateString();
  var stringB = new Date(timestamp * 1000).toLocaleTimeString();
  // console.log(stringA);
  // console.log(stringB);
  // let stringC = stringA + " " + stringB + " UTC+1800";
  // let stringC = stringA + " " + stringB + " GMT+1800"; // +1800 para servidor local (argentina)
  let stringC = stringA + " " + stringB + " GMT+0000"; // +1800 para servidor cloud (brazilia?EEUU)
  // console.log(stringC);
  console.log(data0.getTimezoneOffset());
  var dateLocal = new Date(stringC);
  // console.log(dateLocal.toUTCString());
  return dateLocal.toLocaleTimeString();
  // var date = new Date(timestamp * 1000).toLocaleTimeString();
  // console.log(date.toUTCString());
  // console.log(date.toLocaleDateString());


  // Hours part from the timestamp
  // var hours = date.getHours();
  // Minutes part from the timestamp
  // var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  // var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  // return "xxx";

  // return formattedTime.toString();
  
}

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
setInterval(pasoXtiempo, 50000)

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