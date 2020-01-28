var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/theme/monokai");
import { Sidebar } from "./sidebar";

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
      code: ""
    }
    // typescript: {
    //   server: "ws://localhost:7778",
    //   syntax: "typescript",
    //   code: ""
    // }
  }
};

function fetchCode(service: string) {
  let svc = appState.services[service];
  let params = { project: appState.project, code: svc.code };

  // if the code is empty, we should call generate. otherwise, update it.

  rpc_call(svc.server, "update", params, response => {
    svc.code = response["code"];
    updateState();
  });
}

function parseCode() {
  let svc = appState.services[appState.selectedTab];
  let params = { code: svc.code };

  rpc_call(svc.server, "parse", params, response => {
    // note: this may do well with a check for the 'models' and 'requests' keys...
    appState.project = response;
    updateState();

    // sync across other languages
    for (let service of Object.keys(appState.services)) {
      if (appState.selectedTab != service) {
        fetchCode(service);
      }
    }
  });
}

function updateState() {
  console.log(["updating ui state", appState]);
  updateTabs();
  updateEditor();
  Sidebar.update(appState);
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
  rpc_call(
    appState.services.openapi.server,
    "template",
    { name: "petstore" },
    response => {
      appState.selectedTab = "openapi";
      appState.services.openapi.code = response["code"];
      parseCode();
    }
  );
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

  for (let service of Object.keys(appState.services)) {
    // add tabs
    document
      .querySelector(".tab-bar")
      .insertAdjacentHTML(
        "beforeend",
        `<div class='column tab-bar--tab ${service}'>${service}</div>`
      );

    // add click even to tabs
    document
      .querySelector(`.tab-bar--tab.${service}`)
      .addEventListener("click", event => {
        saveState();
        appState.selectedTab = service;
        updateState();
      });
  }

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
