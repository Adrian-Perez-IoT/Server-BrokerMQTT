"use strict";
// MQTT subscriber
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://mqtt.diveriot.com:1883');
// var topic = 'LINTANGtest123';
var topic = 'Casa/LivingRoom/Door';
client.on('message', (topic, message) => {
    message = message.toString();
    //message = message; // imprime los 50 bytes contenidos dentro del buffer
    console.log(message);
});
client.on('connect', () => {
    client.subscribe(topic);
});
//# sourceMappingURL=sub.js.map