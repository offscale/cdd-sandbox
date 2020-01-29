import { DOM } from "./dom";

let modelsSelector = ".sidebar--items.models";
let requestsSelector = ".sidebar--items.requests";

export module Sidebar {
  export function update(state) {
    addModels(state.project.models);
    addRequests(state.project.requests);
  }

  function addRequests(requests) {
    let requestsContainer = document.querySelector(requestsSelector);
    requestsContainer.textContent = "";

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

  function addModels(models) {
    let modelsContainer = document.querySelector(modelsSelector);
    modelsContainer.textContent = "";

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
