var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/mode/rust");
require("brace/theme/monokai");
import { Sidebar } from "./sidebar";
import { ErrorBar } from "./error";
import { Models } from "./models";

var appState: Models.AppState = {
  selectedTab: "openapi",
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
    },
    // typescript: {
    //   server: "ws://localhost:7778",
    //   syntax: "typescript",
    //   code: ""
    // },
    rust: {
      server: "ws://localhost:7779",
      syntax: "rust",
      code: ""
    }
    // kotlin: {
    //   server: "ws://localhost:7780",
    //   syntax: "kotlin",
    //   code: ""
    // }
    // swift: {
    //   server: "ws://localhost:7781",
    //   syntax: "swift",
    //   code: ""
    // },
    // java: {
    //   server: "ws://localhost:7782",
    //   syntax: "java",
    //   code: ""
    // },
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
    console.log("response", response);
    // note: this may do well with a check for the 'models' and 'requests' keys...
    appState.project = response.project;
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
  console.log("ui: updating state", appState);
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

function getServiceFromServer(server: String): string {
  for (let service of Object.keys(appState.services)) {
    if (appState.services[service].server == server) {
      return service;
    }
  }

  return "unknown server: ";
}

// implement
function rpc_call(
  host: string,
  method: string,
  params: any,
  callback: (response: any) => void
) {
  console.info(`rpc_call: ${getServiceFromServer(host)} -> ${method}`, params);

  var client = JsonRpcWs.createClient();

  try {
    client.connect(host, () => {
      try {
        client.send(
          method,
          params,
          async (error: any, response: { [x: string]: any }) => {
            if (error != null) {
              console.error(`${method} error`, error);
              ErrorBar.pushError(`rpc error: ${error.message} (${host})`);
            } else {
              console.log(
                `rpc_response: ${getServiceFromServer(host)} -> ${method}`,
                response
              );
              callback(response);
            }
          }
        );
      } catch (Error) {
        ErrorBar.pushError(`error: ${Error.message}`);
        // console.error(Error);
      }
    });
  } catch (Error) {
    ErrorBar.pushError(`error: ${Error.message}`);
  }
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

  // ace editor init
  var editor = ace.edit("javascript-editor");
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/monokai");
  appState.editor = editor;
  setDefaultEditorState();
  // end editor init

  updateState();

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
      if (event.ctrlKey && (keyName == "s" || keyName == "S")) {
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
