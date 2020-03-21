import * as monaco from "monaco-editor";

import { State } from "./state";
import { Domain } from "domain";
import { DOM } from "./dom";

// var ace = require("brace");
// require("brace/mode/javascript");
// require("brace/mode/yaml");
// require("brace/mode/typescript");
// require("brace/mode/rust");
// require("brace/mode/swift");
// require("brace/theme/monokai");

let editorId = "editor";

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
// import * as monaco from "monaco-editor";
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// import * as _ from "lodash";
// const { JSONPath } = require('jsonpath-plus');
// const nodejq = require("jq-in-the-browser").default;
// import monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

// monaco.editor.create(document.body, {
//   value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
//   language: "typescript"
// });


export module Editor {
  export function init() {
    // var editor = ace.edit(editorId);
    // editor.$blockScrolling = Infinity;
    // editor.setTheme("ace/theme/monokai");

    // let editor = document.querySelector(editorId);
    
    // console.log("DOCUMENT", document.getElementById(editorId));

    // monaco.editor.create(document.body);
    monaco.editor.create(document.getElementById(editorId), {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
      language: "typescript"
    });

    // return {};
  }

  export function update(appState: State.AppState) {
    if (appState.selectedTab) {
      let currentProject = appState.currentProject();

      // appState.editor.getSession().setMode(`ace/mode/${currentProject.syntax}`);
      // appState.editor.setValue(currentProject.code);
      // appState.editor.clearSelection();
    }
  }
}
