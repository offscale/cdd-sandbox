var JsonRpcWs = require('json-rpc-ws/browser');

window.onload = () => {
    document.body.textContent = "typescript loaded";

    var client = JsonRpcWs.createClient();

    client.connect('ws://localhost:8080', function connected () {
        client.send('list-models', { limit: 0 }, function mirrorReply (error, reply) {
            document.body.textContent = reply;
            // console.log('reply -> ', reply);
        });
    });
};
