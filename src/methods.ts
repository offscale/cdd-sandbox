import { RPC } from "./rpc";
import { Models } from "./models";
import { State } from "./state";
import { ErrorBar } from "./error";

export module Methods {

  export function parse(service: Models.Service, appState: State.AppState) {
    let params = { code: service.code };

    RPC.call(service.server, service.server, "parse", params, response => {
      // console.log("response", response);
      // note: this may do well with a check for the 'models' and 'requests' keys...
      if (response.project as Models.Project) {
        appState.project = response.project;
      } else {
        ErrorBar.pushError(`null project from ${service}`);
      }

      // State.update();

      // sync across other languages
      for (let serviceName of Object.keys(appState.services)) {
        if (appState.selectedTab != serviceName) {
          Methods.update(appState.services[serviceName], appState);
        }
      }
    });
  }

  export function serialise(server: string, code: string): any {
    let params = { code: code };

    RPC.call("none", server, "serialise", params, response => {

      if(response.ast) {
        // extract a project from the ast
        return response.ast;
      } else {
        ErrorBar.pushError(`invalid response from ${server}`);
      }

      // State.update(appState);

      // sync across other languages
      // for (let service of Object.keys(appState.services)) {
      //   if (appState.selectedTab != service) {
      //     Methods.update(service, appState);
      //   }
      // }
    });
  }

  export function update(service: Models.Service, appState: State.AppState) {
    let params = { project: appState.project, code: service.code };

    RPC.call("service", service.server, "update", params, response => {
      service.code = response["code"];
      // State.update();
    });
  }

  export function getTemplate(templateName: string, appState: State.AppState) {
    RPC.call(
      "openapi",
      appState.services.openapi.server,
      "template",
      { name: templateName },
      response => {
        appState.selectedTab = "openapi";
        appState.services.openapi.code = response["code"];
        Methods.parse(appState.services.openapi, appState);
        // State.update();
      }
    );
  }
}
