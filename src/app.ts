var JsonRpcWs = require("json-rpc-ws/browser");
var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/yaml");
require("brace/mode/typescript");
require("brace/theme/monokai");

var appState = {
  selectedTab: "openapi",
  services: {
    openapi: { server: "ws://localhost:7777", code: null },
    typescript: {
      server: "ws://localhost:7778",
      code: null
    }
  }
};

function updateState() {
  console.log("updating ui state");
  updateTabs(appState.selectedTab);
}

function updateTabs(selected) {
  document.querySelectorAll(`.tab-bar--tab.active`).forEach(value => {
    value.classList.remove("active");
  });
  document.querySelector(`.tab-bar--tab.${selected}`).classList.add("active");
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

function setDefaultEditorState(editor) {
  // openapi default
  rpc_call("ws://localhost:7777", "default", {}, response => {
    updateEditor(editor, response);
    updateSidebar(editor);
  });
}

function updateEditor(editor, response) {
  let code = response["code"];
  if (code != undefined) {
    editor.setValue(code);
    editor.clearSelection();
  } else {
    console.log("response does not contain a code key");
    console.log(response);
  }
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
  editor.getSession().setMode("ace/mode/yaml");
  editor.setTheme("ace/theme/monokai");
  setDefaultEditorState(editor);
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
        updateEditor(editor, response);

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
