import { State } from "./state";

var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/mode/rust");
require("brace/mode/swift");
require("brace/theme/monokai");

let editorId = "javascript-editor";

export module Editor {
  export function init() {
    var editor = ace.edit(editorId);
    editor.$blockScrolling = Infinity;
    editor.setTheme("ace/theme/monokai");

    return editor;
  }

  export function update(appState: State.AppState) {
    if (appState.selectedTab) {
      let currentProject = appState.currentProject();

      appState.editor.getSession().setMode(`ace/mode/${currentProject.syntax}`);
      appState.editor.setValue(currentProject.code);
      appState.editor.clearSelection();
    }
  }
}
