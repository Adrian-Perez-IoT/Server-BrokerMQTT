// broker MQTT

var mosca = require('mosca');
var settings = {port:1883};
var broker = new mosca.Server(settings);

// fired when a message is received
broker.on('published', function(packet:any, client:any) {
    console.log('Published', packet.payload);
  });

broker.on('clientConnected', function(client:any) {
    console.log('client connected', client.id);
});

broker.on('error', function(err:any){
    console.log(err);
  });

broker.on('ready', ()=>{
    console.log('Broker is ready!');
})

console.log(`Environment: ${process.env.NODE_ENV}`);
