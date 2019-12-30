var JsonRpcWs = require('json-rpc-ws/browser');
var host = 'ws://localhost:8080';

window.onload = () => {
    console.log("window loaded");
    var client = JsonRpcWs.createClient();

    client.connect(host, function connected () {
        console.log("connected to ", host);
        client.send('list-models', { limit: 0 }, function mirrorReply (error, reply) {
            console.log('reply -> ', reply);
            document.body.textContent = reply;
        });
    });
};
