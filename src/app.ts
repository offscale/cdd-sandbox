var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/theme/monokai");

// implement
function rpc_call(
  host: String,
  method: String,
  params: any,
  callback: (response: any) => void
) {
  console.log("rpc_call: " + host + method);
  var client = JsonRpcWs.createClient();
  client.connect(host, function connected() {
    client.send(method, params, function mirrorReply(
      error: any,
      reply: { [x: string]: any }
    ) {
      if (error != null) {
        console.log(error);
      } else {
        callback(reply);
      }
    });
  });
}

window.onload = () => {
  console.log("window loaded");

  // ace editor init
  var editor = ace.edit("javascript-editor");
  editor.getSession().setMode("ace/mode/yaml");
  editor.setTheme("ace/theme/monokai");
  // end editor init

  // openapi default
  rpc_call("ws://localhost:7777", "default", {}, response => {
    let code = response["code"];
    if (code != undefined) {
      editor.setValue(code);
      editor.clearSelection();

      rpc_call("ws://localhost:7777", "parse", { code }, response => {
        refreshSidebar(response["models"]);
        // for (let model of response["models"]) {
        //   appendSidebarButton("sidebar", model["name"]);
        // }
      });
    } else {
      console.log(response);
    }
  });

  // listen for keyboard shortcuts
  document.addEventListener(
    "keydown",
    event => {
      const keyName = event.key;

      // do not alert when only Control key is pressed.
      if (keyName === "Control") {
        return;
      }

      if (event.ctrlKey && keyName == "s") {
        // Even though event.key is not 'Control' (e.g., 'a' is pressed),
        // event.ctrlKey may be true if Ctrl key is pressed at the same time.
        alert(`Combination of ctrlKey + ${keyName}`);
        event.preventDefault();
      } else {
        // alert(`Key pressed ${keyName}`);
      }
    },
    false
  );

  // function get_service(host: String, method: String) {
  //   console.log("get_service called with: " + method);
  //   var client = JsonRpcWs.createClient();
  //   client.connect(host, function connected() {
  //     client.send(method, {}, function mirrorReply(
  //       error: any,
  //       reply: { [x: string]: any }
  //     ) {
  //       console.log("reply ->");
  //       console.log(reply);
  //       console.log("error ->");
  //       console.log(error);
  //       if (reply != undefined) {
  //         let code = reply
  //           .map(function(model) {
  //             return model["code"];
  //           })
  //           .join("\n\n");
  //         console.log(code);
  //         editor.setValue(code);
  //         editor.clearSelection();

  //         // editor.on('change', function () {});

  //         // refactor this definitely
  //         rpc_call("ws://localhost:7777", "parse", { code }, response => {
  //           console.log(response);
  //         });
  //       }
  //     });
  //   });
  // }

  // get_service("ws://localhost:8080", "list-models");
  // get_service("ws://localhost:7777", "default");

  // var jstree      = require('./treeview');
  // import * as jsTree from 'treeview';
  // jstree.TreeView.jsTree.init().Jstree({id: 'sidebar'});

  // var host = "ws://localhost:8080";
  // var client = JsonRpcWs.createClient();

  // try {
  //   client.connect(host, function connected() {
  //     console.log("connected to ", host);
  //     client.send("list-models", { limit: 0 }, function mirrorReply(
  //       error: any,
  //       reply: { [x: string]: any }
  //     ) {
  //       console.log("reply -> ", reply);
  //       console.log("error -> ", error);
  //       // document.body.textContent = reply["models"];

  //       // for (let model of reply["models"]) {
  //       //   appendSidebarButton("sidebar", model["name"]);
  //       // }

  //       // let model_names = reply["models"].map(function(model) { return "<li>"+model["name"]+"</li>" });
  //       // let codebox = document.getElementById("sidebar");
  //       // codebox.textContent = model_names;
  //     });
  //   });
  // } catch {
  //   console.log("ERROR");
  // }
};

function refreshSidebar(models: any) {
  let sidebar = document.getElementById("sidebar");
  let itemContainer = sidebar.querySelector(".sidebar--items.models");
  itemContainer.textContent = "";
  for (let model of models) {
    itemContainer.appendChild(
      createElement(
        "div",
        ["selectable-item", "model"],
        // document.createTextNode(model["name"])
        document.createTextNode(model)
      )
    );
    console.log(model);
  }
}

function createElement(type: string, classes: string[], content: Node) {
  var element = document.createElement(type);
  element.appendChild(content);
  for (const klass of classes) {
    element.classList.add(klass);
  }
  return element;
}
