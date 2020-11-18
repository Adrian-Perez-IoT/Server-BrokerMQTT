const admin = require("firebase-admin");

function initFirebase() {
    const serviceAccount = require("../key/testnotificationpushflutter-firebase-adminsdk-614sv-b391a4e5b1.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://testnotificationpushflutter.firebaseio.com"
    });
};

initFirebase();

function sendPushToOneUser(notification) {
    const message = {
        token: notification.tokenId,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendPushToTopic(notification) {
    const message = {
        topic: notification.topic,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendAlert(amenaza) {
    const message = {
        notification: {
            title: amenaza.titulo,
            body: amenaza.mensaje,            
        },
        android: {
            notification: {
                sound: 'default'
            },
        },
        token: leerTokenDevicefromFirestoreDB(),
        data: {
            sensor: amenaza.sensor,
            time: amenaza.time.toString(),
            value: amenaza.value.toString()
        },
        
    }
    sendMessage(message); // antes de enviar mensage, poner previamente la logica para controlar que no se envien notificaciones tan rapido como se reciban los mensages mqtt (1 notificacion por minuto serà suficeinte?)
}

module.exports = { sendPushToOneUser, sendPushToTopic, sendAlert }

function sendMessage(message) {
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        })
}


function leerTokenDevicefromFirestoreDB() {
    return "dcS-sFSue18:APA91bFVq64WRhbmIjTerQdZ0w--cjaYyLJov7U9Eprx-IcbxTWqNHRz6Lb43NIER7UtbUVo0GPMVsrMbJvYaiWLKPzYicD8L9La_MWe6H25A2_exgsJAlAlm4QHkjIWgL5BOpNTV2eW";
  }