const admin = require("firebase-admin");

function initFirebase () {
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

module.exports = { sendPushToOneUser, sendPushToTopic }

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
 
