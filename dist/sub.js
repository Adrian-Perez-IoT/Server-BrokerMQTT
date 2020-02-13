"use strict";
// MQTT subscriber
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1883');
var topic = 'LINTANGtest123';
client.on('message', (topic, message) => {
    message = message.toString();
    console.log(message);
});
client.on('connect', () => {
    client.subscribe(topic);
});
//# sourceMappingURL=sub.js.map