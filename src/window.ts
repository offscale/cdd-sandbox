import { State } from "./state";
import { Editor } from "./editor";
import { Methods } from "./methods";
import { Tabs } from "./tabs";
import { Processors } from "./processors/processors";
import { UI } from "./ui";

export module Window {
  export function onLoad(ev: Event) {
    console.log("window loaded");
    let appState = new State.AppState(Editor.init());
    Tabs.init(appState); // draw tabs based on config
    // appState.save();
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
          // let selectedService = appState.services[appState.selectedTab];
          let currentProject = appState.currentProject();
          appState.save();

          UI.update(appState);

          // let ast = Methods.serialise(currentProject.processor.server, currentProject.code);
          // currentProject.ast = ast;
          // State.save();
          // Methods.parse(selectedService, appState);
          // Methods.serialise();
          event.preventDefault();
        }
      },
      false
    );
  }
}
