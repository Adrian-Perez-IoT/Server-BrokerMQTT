// Broker MQTT

var mosca = require('mosca');
var settings = {
  port:1883
};
var broker = new mosca.Server(settings);

broker.on('error', function(err:any){
  console.log(err);
});

// Fired when a message is received
broker.on('published', function(packet:any, client:any) {
    console.log('Published', packet.topic, packet.payload);
});

broker.on('subscribed', function (topic:any, client:any) {
  console.log("Subscribed :=", client.packet);
});

broker.on('clientConnected', function(client:any) {
    console.log('Client connected', client.id);
});

broker.on('clientDisconnecting', function (client:any) {
  console.log('clientDisconnecting := ', client.id);
});

// Fired when a client disconnects
broker.on('clientDisconnected', function(client:any) {
  console.log('Client Disconnected:', client.id);
});

broker.on('ready', ()=>{
    console.log('Server Backend (Broker) is up and running!');
})

console.log(`Environment: ${process.env.NODE_ENV}`);
