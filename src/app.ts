var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/theme/monokai");

var appState = {
  selectedTab: null,
  editor: null,
  project: {
    models: [],
    requests: []
  },
  services: {
    openapi: {
      server: "ws://localhost:7777",
      syntax: "yaml",
      code: "nothing fetched."
    },
    typescript: {
      server: "ws://localhost:7778",
      syntax: "typescript",
      code: "nothing fetched."
    }
  }
};

function fetchCode(service: string) {
  let svc = appState.services[service];

  rpc_call(svc.server, "generateCode", {}, response => {
    svc.code = response["code"];
    updateState();
  });
}

function parseCode() {
  let svc = appState.services[appState.selectedTab];

  rpc_call(svc.server, "parse", { code: svc.code }, response => {
    appState.project.models = response["models"];
    updateState();
  });
}

function updateState() {
  console.log(["updating ui state", appState]);
  updateTabs();
  updateEditor();
  updateSidebar();
}

function saveState() {
  if (appState.selectedTab) {
    appState.services[appState.selectedTab].code = appState.editor.getValue();
  }
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

function updateSidebar() {
  let sidebar = document.getElementById("sidebar");
  let itemContainer = sidebar.querySelector(".sidebar--items.models");
  itemContainer.textContent = "";
  for (let model of appState.project.models) {
    itemContainer.appendChild(
      createElement(
        "div",
        ["selectable-item", "model"],
        // document.createTextNode(model["name"])
        document.createTextNode(model)
      )
    );
  }
}

// function updateSidebar(editor) {
//   let service = appState.services[appState.selectedTab];

//   let code = editor.getValue();
//   rpc_call(service.server, "parse", { code }, response => {
//     refreshSidebar(response["models"]);
//     // for (let model of response["models"]) {
//     //   appendSidebarButton("sidebar", model["name"]);
//     // }
//   });
// }

// implement
function rpc_call(
  host: String,
  method: String,
  params: any,
  callback: (response: any) => void
) {
  console.log([`rpc_call: ${host} -> ${method}`, params]);

  var client = JsonRpcWs.createClient();
  client.connect(host, function connected() {
    client.send(method, params, function mirrorReply(
      error: any,
      response: { [x: string]: any }
    ) {
      if (error != null) {
        console.log([`${method} error`, error]);
      } else {
        console.log([`${method} response`, response]);
        callback(response);
      }
    });
  });
}

function setDefaultEditorState() {
  rpc_call(appState.services.openapi.server, "default", {}, response => {
    appState.selectedTab = "openapi";
    appState.services.openapi.code = response["code"];
    parseCode();

    fetchCode("typescript");

    // updateState();
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
      saveState();
      appState.selectedTab = "openapi";
      updateState();
    });

  document
    .querySelector(".tab-bar--tab.typescript")
    .addEventListener("click", event => {
      saveState();
      appState.selectedTab = "typescript";
      updateState();
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
        saveState();
        parseCode();
        event.preventDefault();
      }
    },
    false
  );
};

function createElement(type: string, classes: string[], content: Node) {
  var element = document.createElement(type);
  element.appendChild(content);
  for (const klass of classes) {
    element.classList.add(klass);
  }
  return element;
}
