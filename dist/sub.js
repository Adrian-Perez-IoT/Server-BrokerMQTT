"use strict";
// MQTT subscriber
var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://35.198.44.138:1883');
var client = mqtt.connect('mqtt://localhost:1883');
// var topic = 'Casa/XBeeCoord/IOSamples';
var topic = 'LINTANGtest123';
client.on('message', (topic, message) => {
    message = message.toString();
    console.log(message);
});
client.on('connect', () => {
    client.subscribe(topic);
});
//# sourceMappingURL=sub.js.map