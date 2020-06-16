// MQTT publisher
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost:1883');
var topic = 'smarthome/test';
var message;

client.on('connect', () => {
    setInterval(() => {
        message = JSON.stringify({
            id: 1,
            temperature: 20+(Math.random()*5),
            timestamp: (new Date()).valueOf()
        });
        client.publish(topic, message);
        console.log('Message sent!', message);
    }, 5000);
});