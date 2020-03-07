import { RPC } from "./rpc";
import { Models } from "./models";
import { State } from "./state";
import { ErrorBar } from "./error";

export module Methods {

  // remove
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

      // sync across other languages
      for (let serviceName of Object.keys(appState.services)) {
        if (appState.selectedTab != serviceName) {
          Methods.update(appState.services[serviceName], appState);
        }
      }
    });
  }

  export async function serialise(server: string, code: string) {
    return await RPC.ccall(server, "serialise", { code: code });
  }

  export async function deserialise(server: string, ast: any) {
    return await RPC.ccall(server, "deserialise", { ast: ast });
  }

  // remove
  export function update(service: Models.Service, appState: State.AppState) {
    let params = { project: appState.project, code: service.code };

    RPC.call("service", service.server, "update", params, response => {
      service.code = response["code"];
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
