import { DOM } from "./dom";

let errorContainer = "errors";

export module ErrorBar {
  export function pushError(msg: string) {
    var container = document.getElementById(errorContainer);
    var el = DOM.createElement("div", ["error"], document.createTextNode(msg));

    el.addEventListener("click", event => {
      document.getElementById(errorContainer).innerHTML = "";
    });

    container.appendChild(el);
  }
}
