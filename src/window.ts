import { State } from "./state";
import { Editor } from "./editor";
import { Tabs } from "./tabs";
import { UI } from "./ui";

export module Window {
  export function onLoad(ev: Event) {
    console.log("Window.onLoad()");
    let appState = new State.AppState(Editor.init());
    Tabs.init(appState); // draw tabs based on config
    UI.update(appState);
    appState.save();
    
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
          let currentProject = appState.currentProject();
          appState.save();
          UI.update(appState);
          event.preventDefault();
        }
      },
      false
    );
  }
}
