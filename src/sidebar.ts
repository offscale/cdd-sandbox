import { DOM } from "./dom";
import { OpenAPIProcessor } from "./processors/openapi";

let modelsSelector = ".sidebar--items.models";
let requestsSelector = ".sidebar--items.requests";

export module Sidebar {

  export function update(spec: {}) {
    console.log('Sidebar.update()', spec);

    reset();

    // update models
    const modelsContainer = document.querySelector(modelsSelector);
    OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
      let model = createModel(componentName);
      OpenAPIProcessor.eachComponentProperty(component, (propertyName, propertyType, optional) => {
        model.appendChild(createVariable(propertyName, propertyType, optional));
      });
      modelsContainer.appendChild(model);
    });

    // update requests
    let requestsContainer = document.querySelector(requestsSelector);
    OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
      let requestEl = createRequest(requestName, requestMethod, requestPath);
      OpenAPIProcessor.eachRequestParam(request, (paramName, paramType, optional) => {
        requestEl.appendChild(createVariable(paramName, paramType, optional));
      })
      requestEl.appendChild(createReturn(OpenAPIProcessor.extractReturnType(request), false));
      requestsContainer.appendChild(requestEl);
    });
  }

  function reset() {
    document.querySelector(modelsSelector).textContent = "";
    document.querySelector(requestsSelector).textContent = "";
  }

  function createRequest(requestName: string, requestMethod: string, requestPath: string) {
    return DOM.createElement(
      "div",
      ["selectable-item", "request"],
      document.createTextNode(`${requestMethod.toUpperCase()} ${requestPath}`)
    );
  }

  function createModel(modelName: string) {
    return DOM.createElement(
      "div",
      ["selectable-item", "model"],
      document.createTextNode(modelName)
    );
  }

  function createVariable(varName: string, varType: string, optional: boolean) {
    const optionalAsterisk = optional ? "" : "*";

    return DOM.createElement(
      "div",
      ["member", "variable"],
      document.createTextNode(`${varName}: ${optionalAsterisk}${varType}`)
    );
  }

  function createReturn(varType: string, optional: boolean) {
    return DOM.createElement(
      "div",
      ["return"],
      document.createTextNode(`-> ${varType}`)
    )
  }

  // function addModel(modelName: string) {
  //   const modelsContainer = document.querySelector(modelsSelector);

  //   var el = DOM.createElement(
  //     "div",
  //     ["selectable-item", "model"],
  //     // document.createTextNode(model["name"])
  //     document.createTextNode(modelName)
  //   );
  //   // addVariables(model.vars, el);
  //   modelsContainer.appendChild(el);
  // }

  // function addModels(models: Models.Model[]) {
  //   let modelsContainer = document.querySelector(modelsSelector);
  //   modelsContainer.textContent = "";

  //   if (models.length == 0) {
  //     return;
  //   }

  //   for (let model of models) {
  //     var el = DOM.createElement(
  //       "div",
  //       ["selectable-item", "model"],
  //       // document.createTextNode(model["name"])
  //       document.createTextNode(model.name)
  //     );
  //     addVariables(model.vars, el);
  //     modelsContainer.appendChild(el);
  //   }
  // }

  // function addRequests(requests) {
  //   let requestsContainer = document.querySelector(requestsSelector);
  //   requestsContainer.textContent = "";

  //   if (requests.length == 0) {
  //     return;
  //   }

  //   for (let request of requests) {
  //     var el = DOM.createElement(
  //       "div",
  //       ["selectable-item", "request"],
  //       document.createTextNode(
  //         `${request.name}: ${request.method} ${request.path}`
  //       )
  //     );
  //     addVariables(request.params, el);
  //     // addVariables(request.response_type, el);
  //     if (request.response_type) {
  //       el.appendChild(
  //         DOM.createElement(
  //           "div",
  //           ["return"],
  //           document.createTextNode(`-> ${request.response_type.Complex}`)
  //         )
  //       );
  //     }

  //     requestsContainer.appendChild(el);
  //   }
  // }

  // function addVariables(variables, element) {
  //   for (let variable of variables || []) {
  //     element.appendChild(
  //       DOM.createElement(
  //         "div",
  //         ["member"],
  //         document.createTextNode(`${variable.name}: ${variable.type}`)
  //       )
  //     );
  //   }
  // }
}
