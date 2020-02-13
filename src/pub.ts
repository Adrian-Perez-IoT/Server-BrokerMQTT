// MQTT publisher

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1883');
var topic = 'LINTANGtest123';

var message = 'Hello world';

client.on('connect', ()=>{
    setInterval(()=>{
        client.publish(topic,message);
        console.log('Mensaje enviado:', message);
    },5000)
})