"use strict";
// MQTT publisher
var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://35.198.44.138:1883'); 
// var client = mqtt.connect('mqtt://34.95.237.31:1883');
var client = mqtt.connect('mqtt://localhost:1883');
var topic = 'LINTANGtest123';
var message = 'Hello world';
client.on('connect', () => {
    setInterval(() => {
        client.publish(topic, message);
        console.log('Mensaje test enviado:', message);
    }, 5000);
});
//# sourceMappingURL=pub.js.map