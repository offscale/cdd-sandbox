var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/theme/monokai");

window.onload = () => {
  console.log("window loaded");

  // ace editor init
  var editor = ace.edit("javascript-editor");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setTheme("ace/theme/monokai");
  // end editor init

  function get_service(host: String, fn: String) {
    console.log("get_service called");
    var client = JsonRpcWs.createClient();
    client.connect(host, function connected() {
      client.send(fn, {}, function mirrorReply(
        error: any,
        reply: { [x: string]: any }
      ) {
        console.log("reply -> " + reply);
        if (reply != undefined) {
          let code = reply
            .map(function(model) {
              return model["code"];
            })
            .join("\n\n");
          console.log(code);
          editor.setValue(code);
        }
      });
    });
  }

  get_service("ws://localhost:8080", "list-models");

  // var jstree      = require('./treeview');
  // import * as jsTree from 'treeview';
  // jstree.TreeView.jsTree.init().Jstree({id: 'sidebar'});

  var host = "ws://localhost:8080";
  var client = JsonRpcWs.createClient();

  try {
    client.connect(host, function connected() {
      console.log("connected to ", host);
      client.send("list-models", { limit: 0 }, function mirrorReply(
        error: any,
        reply: { [x: string]: any }
      ) {
        console.log("reply -> ", reply);
        console.log("error -> ", error);
        // document.body.textContent = reply["models"];

        // for (let model of reply["models"]) {
        //   appendSidebarButton("sidebar", model["name"]);
        // }

        // let model_names = reply["models"].map(function(model) { return "<li>"+model["name"]+"</li>" });
        // let codebox = document.getElementById("sidebar");
        // codebox.textContent = model_names;
      });
    });
  } catch {
    console.log("ERROR");
  }
};

function appendSidebarButton(parentId: string, name: any) {
  let parent = document.getElementById(parentId);
  parent.appendChild(
    createElement(
      "div",
      ["selectable-item", "model"],
      document.createTextNode(name)
    )
  );
}

function createElement(type: string, classes: string[], content: Node) {
  var element = document.createElement(type);
  element.appendChild(content);
  for (const klass of classes) {
    element.classList.add(klass);
  }
  return element;
}
