import { RPC } from "./rpc";
import { Models } from "./models";
import { State } from "./state";
import { ErrorBar } from "./error";

export module Methods {
  export function parse(service: string, appState: Models.AppState) {
    let svc = appState.services[appState.selectedTab];
    let params = { code: svc.code };

    RPC.call(service, svc.server, "parse", params, response => {
      // console.log("response", response);
      // note: this may do well with a check for the 'models' and 'requests' keys...
      if (response.project as Models.Project) {
        appState.project = response.project;
      } else {
        ErrorBar.pushError(`null project from ${service}`);
      }

      State.update(appState);

      // sync across other languages
      for (let service of Object.keys(appState.services)) {
        if (appState.selectedTab != service) {
          Methods.update(service, appState);
        }
      }
    });
  }

  export function update(service: string, appState: Models.AppState) {
    let svc = appState.services[service];
    let params = { project: appState.project, code: svc.code };

    RPC.call(service, svc.server, "update", params, response => {
      svc.code = response["code"];
      State.update(appState);
    });
  }

  export function getTemplate(templateName: string, appState: Models.AppState) {
    RPC.call(
      "openapi",
      appState.services.openapi.server,
      "template",
      { name: templateName },
      response => {
        appState.selectedTab = "openapi";
        appState.services.openapi.code = response["code"];
        Methods.parse("openapi", appState);
        State.update(appState);
      }
    );
  }
}
