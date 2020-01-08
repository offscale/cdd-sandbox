

window.onload = () => {
    console.log("window loaded");

    // ace editor init
    var ace = require('brace');
    require('brace/mode/javascript');
    require('brace/theme/monokai');
    
    var editor = ace.edit('javascript-editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');
    // end editor init


    var JsonRpcWs   = require('json-rpc-ws/browser');
    // var jstree      = require('./treeview');
    // import * as jsTree from 'treeview';
    // jstree.TreeView.jsTree.init().Jstree({id: 'sidebar'});

    var host    = 'ws://localhost:8080';
    var client  = JsonRpcWs.createClient();

    client.connect(host, function connected () {
        console.log("connected to ", host);
        client.send('list-models', { limit: 0 }, function mirrorReply (error: any, reply: { [x: string]: any; }) {
            console.log('reply -> ', reply);
            // document.body.textContent = reply["models"]; 

            for (let model of reply["models"]) {
                appendSidebarButton("sidebar", model["name"]);
            }

            // let model_names = reply["models"].map(function(model) { return "<li>"+model["name"]+"</li>" });
            // let codebox = document.getElementById("sidebar");
            // codebox.textContent = model_names;
        });
    });
};

function appendSidebarButton(parentId: string, name: any) {
    let parent = document.getElementById(parentId);
    parent.appendChild(createElement("div", ["selectable-item", "model"], document.createTextNode(name)));
}

function createElement(type: string, classes: string[], content: Node) {
    var element = document.createElement(type);
    element.appendChild(content);
    for (const klass of classes) {
        element.classList.add(klass);
    }
    return element;
}