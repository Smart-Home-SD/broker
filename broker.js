// MQTT broker
var mosca = require('mosca');

var settings = { port: 1883 };
var broker = new mosca.Server(settings);

// MongoDB
var mongo = require('mongodb');
var mongc = mongo.MongoClient;
var url = 'mongodb://leo:leo123@localhost:27017/mqttSD';

broker.on('ready', () => {
    console.log('Broker is ready!');
});

broker.on('published', (packet) => {
    try {
        message = packet.payload.toString();
        console.log(message);

        json = JSON.parse(message);
        mongc.connect(url, (error, client) => {
            var myCol = client.db('mqttSD').collection('mqttSD')
            myCol.insertOne(json, 
                () => {
                console.log('Data is saved to MongoDB')
                client.close()
            })
        })
    } catch (e) {
        console.log(e);
    }
});