const admin = require("firebase-admin");

function initFirebase() {
    const serviceAccount = require("../key/testnotificationpushflutter-firebase-adminsdk-614sv-b391a4e5b1.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://testnotificationpushflutter.firebaseio.com"
    });
};

initFirebase();

var db = admin.firestore();

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
    sendMessage(message);
}

function sendMessage(message) {
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            // console.log('Successfully sent message :', response);
            console.log(`Amenaza ${message["data"]["sensor"]} notificada satisfactoriamente: ${response}`);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        })
}

function leerTokenDevicefromFirestoreDB() {
    // return "dcS-sFSue18:APA91bFVq64WRhbmIjTerQdZ0w--cjaYyLJov7U9Eprx-IcbxTWqNHRz6Lb43NIER7UtbUVo0GPMVsrMbJvYaiWLKPzYicD8L9La_MWe6H25A2_exgsJAlAlm4QHkjIWgL5BOpNTV2eW";
    return "dOLhex-gfLY:APA91bHDksOk8SmZKCJ1Nrfo5p5txUPyTkO_yb88tARjv7bsoUEl-whyNiofd3zAYKqNn3A7A4Cl6m4Yl2S5z8vjGizgjjuhIcQYUyl5joa_Rp0_KSALaxGI8yIiqBgIkt1bU7gB8ln_";
}

function guardarAmenaza(amenaza) {
    db.collection('alertas.de.amenaza').add({
        time: amenaza["time"],
        sensor: amenaza["sensor"],
    })
        .then(function (docRef) {
            console.log(`Amenaza ${amenaza["sensor"]} registrada en DB con id: ${docRef.id}`);
        })
        .catch(function (error) {
            console.error("Error editando el documento", error);
        });
}

module.exports = { sendPushToOneUser, sendPushToTopic, sendAlert, guardarAmenaza }