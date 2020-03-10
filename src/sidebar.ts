import { DOM } from "./dom";
import { Models } from "./models";
import { State } from "./state";
import { OpenAPIProcessor } from "./processors/openapi";

let modelsSelector = ".sidebar--items.models";
let requestsSelector = ".sidebar--items.requests";

export module Sidebar {

  export function update(spec: {}) {
    console.log('Sidebar.update()', spec);

    reset();

    OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
      addModel(componentName);
    });
    // addModels(state.project.models);
    // addRequests(state.project.requests);
  }

  function reset() {
    const modelsContainer = document.querySelector(modelsSelector);
    modelsContainer.textContent = "";
  }

  function addModel(modelName: string) {
    const modelsContainer = document.querySelector(modelsSelector);

    var el = DOM.createElement(
      "div",
      ["selectable-item", "model"],
      // document.createTextNode(model["name"])
      document.createTextNode(modelName)
    );
    // addVariables(model.vars, el);
    modelsContainer.appendChild(el);
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
        document.createTextNode(
          `${request.name}: ${request.method} ${request.path}`
        )
      );
      addVariables(request.params, el);
      // addVariables(request.response_type, el);
      if (request.response_type) {
        el.appendChild(
          DOM.createElement(
            "div",
            ["return"],
            document.createTextNode(`-> ${request.response_type.Complex}`)
          )
        );
      }

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
