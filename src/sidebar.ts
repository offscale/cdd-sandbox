import { DOM } from "./dom";
import { Models } from "./models";

let modelsSelector = ".sidebar--items.models";
let requestsSelector = ".sidebar--items.requests";

export module Sidebar {
  export function update(state: Models.AppState) {
    addModels(state.project.models);
    addRequests(state.project.requests);
  }

  function addModels(models: Models.Model[]) {
    let modelsContainer = document.querySelector(modelsSelector);
    modelsContainer.textContent = "";

    if (models.length == 0) {
      return;
    }

    for (let model of models) {
      var el = DOM.createElement(
        "div",
        ["selectable-item", "model"],
        // document.createTextNode(model["name"])
        document.createTextNode(model.name)
      );
      addVariables(model.vars, el);
      modelsContainer.appendChild(el);
    }
  }

  function addRequests(requests) {
    let requestsContainer = document.querySelector(requestsSelector);
    requestsContainer.textContent = "";

    if (requests.length == 0) {
      return;
    }

    for (let request of requests) {
      var el = DOM.createElement(
        "div",
        ["selectable-item", "request"],
        document.createTextNode(`${request.method} ${request.path}`)
      );
      addVariables(request.params, el);
      requestsContainer.appendChild(el);
    }
  }

  function addVariables(variables, element) {
    for (let variable of variables || []) {
      element.appendChild(
        DOM.createElement(
          "div",
          ["member"],
          document.createTextNode(`${variable.name}: ${variable.type}`)
        )
      );
    }
  }
}
