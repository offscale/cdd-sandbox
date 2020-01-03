var JsonRpcWs = require('json-rpc-ws/browser');
var host = 'ws://localhost:8080';

window.onload = () => {
    console.log("window loaded");
    var client = JsonRpcWs.createClient();

    // let btn = document.getElementById("coolbutton");
    // btn.addEventListener("click", (e:Event) => this.getTrainingName(4));

    client.connect(host, function connected () {
        console.log("connected to ", host);
        client.send('list-models', { limit: 0 }, function mirrorReply (error, reply) {
            console.log('reply -> ', reply);
            // document.body.textContent = reply["models"]; 

            for (let model of reply["models"]) {
                console.log(model);
            }

            let model_names = reply["models"].map(function(model) { return model["name"]; });
            let codebox = document.getElementById("code");
            codebox.textContent = model_names;
        });
    });
};

