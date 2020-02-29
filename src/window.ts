import { State } from "./state";
import { Editor } from "./editor";
import { Methods } from "./methods";

export module Window {
  export function onLoad(ev: Event) {
    console.log("window loaded");
    let appState = State.reset();

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
          State.update(appState);
          appState.selectedTab = service;
          State.update(appState);
        });
    }

    // init editor
    appState.editor = Editor.init();
    Methods.getTemplate("petstore", appState);

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
          State.save(appState);
          Methods.parse("openapi", appState);
          event.preventDefault();
        }
      },
      false
    );
  }
}
