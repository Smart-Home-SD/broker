const mosca = require('mosca');
const WebSocket = require('ws');

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const moscaServer = new mosca.Server();
const wss = new WebSocket.Server({ port: 8080 });

wss.setMaxListeners(Infinity);

wss.on('connection', (ws) => {
    console.log("A new client connected to the websocket server!");
});

// MongoDB
var mongo = require('mongodb');
var mongc = mongo.MongoClient;
var url = 'mongodb://leo:leo123@localhost:27017/mqttSD';

moscaServer.on('ready', () => {
    console.log("Broker up and running in port 1883!");
    console.log("Using port 8080 from Websockets.");
});

moscaServer.on('clientConnected', function(client) {
    console.log('New client connected! ID: ', client.id);
});

moscaServer.on('published', (packet) => {
    try {
        message = packet.payload.toString();
        console.log('New message published: ', message);
        
        if(IsJsonString(message)) {
            json = JSON.parse(message);
            mongc.connect(url, (error, client) => {
                var myCol = client.db('mqttSD').collection('mqttSD')
                myCol.insertOne(json,
                    () => {
                        console.log('Data is saved to MongoDB')
                        client.close()
                    })
            })

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }

    } catch (e) {
        console.log(e);
    }
});

moscaServer.on('subscribed', function(topic, client) {
    console.log('Client ' + client.id + ' subscribed to topic: ', topic);
});

moscaServer.on('unsubscribed', function(topic, client) {
    console.log('Client ' + client.id + ' unsubscribed to topic: ', topic);
});

moscaServer.on('clientDisconnecting', function(client) {
    console.log('Client ' + client.id + ' is disconnecting');
});

moscaServer.on('clientDisconnected', function(client) {
    console.log('Client ' + client.id + ' has disconnected');
});