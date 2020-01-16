var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/theme/monokai");

var appState = {
  selectedTab: null,
  editor: null,
  services: {
    openapi: { server: "ws://localhost:7777", syntax: "yaml", code: "openapi" },
    typescript: {
      server: "ws://localhost:7778",
      syntax: "typescript",
      code: "ts"
    }
  }
};

function fetchCode(service) {
  console.log("fetching rpc for " + service);
  let svc = appState.services[service];
  rpc_call(svc.server, "generateCode", {}, response => {
    svc.code = response["code"];
  });
}

function updateState() {
  console.log("updating ui state");
  updateTabs();
  updateEditor();
}

function updateTabs() {
  document.querySelectorAll(`.tab-bar--tab.active`).forEach(value => {
    value.classList.remove("active");
  });
  if (appState.selectedTab) {
    document
      .querySelector(`.tab-bar--tab.${appState.selectedTab}`)
      .classList.add("active");
  }
}

function updateEditor() {
  if (appState.selectedTab) {
    let service = appState.services[appState.selectedTab];
    appState.editor.getSession().setMode(`ace/mode/${service.syntax}`);
    appState.editor.setValue(service.code);
    appState.editor.clearSelection();
  }
}

// implement
function rpc_call(
  host: String,
  method: String,
  params: any,
  callback: (response: any) => void
) {
  console.log(`rpc_call: ${host} -> ${method}`);
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

function setDefaultEditorState() {
  rpc_call(appState.services.openapi.server, "default", {}, response => {
    appState.selectedTab = "openapi";
    appState.services.openapi.code = response["code"];

    fetchCode("typescript");

    updateState();
  });
}

function updateSidebar(editor) {
  let code = editor.getValue();
  rpc_call("ws://localhost:7777", "parse", { code }, response => {
    refreshSidebar(response["models"]);
    // for (let model of response["models"]) {
    //   appendSidebarButton("sidebar", model["name"]);
    // }
  });
}

window.onload = () => {
  console.log("window loaded");

  // ace editor init
  var editor = ace.edit("javascript-editor");
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/monokai");
  appState.editor = editor;
  setDefaultEditorState();
  // end editor init

  updateState();

  document
    .querySelector(".tab-bar--tab.openapi")
    .addEventListener("click", event => {
      appState.selectedTab = "openapi";
      updateState();
    });

  document
    .querySelector(".tab-bar--tab.typescript")
    .addEventListener("click", event => {
      rpc_call("ws://localhost:7778", "generateCode", {}, response => {
        editor.getSession().setMode("ace/mode/typescript");
        // updateEditor(editor, response);

        appState.selectedTab = "typescript";
        updateState();
      });
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

      // keypress of ctrl+s
      if (event.ctrlKey && keyName == "s") {
        updateSidebar(editor);
        event.preventDefault();
      }
    },
    false
  );
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
