import * as monaco from "monaco-editor";
import { State } from "./state";
import { DOM } from "./dom";

let editorId = "editor";
let astId = "ast";
let astEditor;

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === "json") {
      return "./json.worker.bundle.js";
    }
    if (label === "css") {
      return "./css.worker.bundle.js";
    }
    if (label === "html") {
      return "./html.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  }
};

export module Editor {
  export function init() {
    astEditor = monaco.editor.create(document.getElementById(astId), {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
      theme: "vs-dark",
      fontSize: 10,
      lineNumbers: "off",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      minimap: {
        enabled: false
      },
      language: "json"
    });

    return monaco.editor.create(document.getElementById(editorId), {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
      theme: "vs-dark",
      language: "typescript"
    });
  }

  export function update(appState: State.AppState) {
    if (appState.selectedTab) {
      let currentProject = appState.currentProject();

      appState.editor.setValue(currentProject.code);

      var model = appState.editor.getModel(); // we'll create a model for you if the editor created from string value.
      monaco.editor.setModelLanguage(model, currentProject.syntax);

      astEditor.setValue(JSON.stringify(currentProject.ast));
      // astEditor.getAction('editor.action.format').run();
      astEditor.getAction('editor.action.formatDocument').run()

      // DOM.setTextOf(astId, JSON.stringify(currentProject.ast));
    }
  }
}
