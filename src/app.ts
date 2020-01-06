window.onload = () => {
    console.log("window loaded");
    var JsonRpcWs   = require('json-rpc-ws/browser');
    // var jstree      = require('./treeview');
    // import * as jsTree from 'treeview';
    // jstree.TreeView.jsTree.init().Jstree({id: 'sidebar'});

    var host    = 'ws://localhost:8080';
    var client  = JsonRpcWs.createClient();

    // let btn = document.getElementById("coolbutton");
    // btn.addEventListener("click", (e:Event) => this.getTrainingName(4));

    // jstree.init().Jstree({id: 'sidebar'});

    client.connect(host, function connected () {
        console.log("connected to ", host);
        client.send('list-models', { limit: 0 }, function mirrorReply (error, reply) {
            console.log('reply -> ', reply);
            // document.body.textContent = reply["models"]; 

            for (let model of reply["models"]) {
                console.log(model);
            }

            let model_names = reply["models"].map(function(model) { return "<li>"+model["name"]+"</li>" });
            let codebox = document.getElementById("sidebar");
            codebox.textContent = model_names;
        });
    });
};

