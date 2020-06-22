"use strict";
// Broker MQTT
var mosca = require('mosca');
var settings = {
    port: 1883
};
var broker = new mosca.Server(settings);
broker.on('error', function (err) {
    console.log(err);
});
// Fired when a message is received
broker.on('published', function (packet, client) {
    console.log('Published', packet.topic, packet.payload);
});
broker.on('subscribed', function (topic, client) {
    console.log("Subscribed :=", client.packet);
});
broker.on('clientConnected', function (client) {
    console.log('Client connected', client.id);
});
broker.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting := ', client.id);
});
// Fired when a client disconnects
broker.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id);
});
broker.on('ready', () => {
    console.log('Server Backend (Broker) is up and running!');
});
console.log(`Environment: ${process.env.NODE_ENV}`);
//# sourceMappingURL=broker.js.map