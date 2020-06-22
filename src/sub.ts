// MQTT subscriber

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://35.198.44.138:1883');

var topic = 'Casa/XBeeCoord/IOSamples';

client.on('message', (topic:any, message:any)=>{
    message = message.toString();
    console.log(message);
});

client.on('connect', ()=>{
    client.subscribe(topic);
})