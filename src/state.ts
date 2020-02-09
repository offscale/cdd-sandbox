var JsonRpcWs = require("json-rpc-ws/browser");
import { Models } from "./models";
import { Sidebar } from "./sidebar";

export module State {
  export function reset(): Models.AppState {
    return {
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
        typescript: {
          server: "ws://localhost:7778",
          syntax: "typescript",
          code: ""
        },
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
        // }
        // java: {
        //   server: "ws://localhost:7782",
        //   syntax: "java",
        //   code: ""
        // },
      }
    };
  }

  export function update(appState: Models.AppState) {
    console.log("ui: updating state", appState);
    updateTabs(appState);
    updateEditor(appState);
    Sidebar.update(appState);
  }

  export function save(appState: Models.AppState) {
    if (appState.selectedTab) {
      appState.services[appState.selectedTab].code = appState.editor.getValue();
    }
  }
}

function updateTabs(appState: Models.AppState) {
  document.querySelectorAll(`.tab-bar--tab.active`).forEach(value => {
    value.classList.remove("active");
  });
  if (appState.selectedTab) {
    document
      .querySelector(`.tab-bar--tab.${appState.selectedTab}`)
      .classList.add("active");
  }
}

function updateEditor(appState: Models.AppState) {
  if (appState.selectedTab) {
    let service = appState.services[appState.selectedTab];
    appState.editor.getSession().setMode(`ace/mode/${service.syntax}`);
    appState.editor.setValue(service.code);
    appState.editor.clearSelection();
  }
}
