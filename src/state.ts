import { Models } from "./models";
import { Sidebar } from "./sidebar";
import { Tabs } from "./tabs"; // extract later
import { Editor } from "./editor";
import { Processors } from "./processors";
import { Methods } from "./methods";
import { UI } from "./ui";

export module State {

  export class AppState {
    selectedTab: string;
    editor: any;
    project: Models.Project;
    services: any;
    projects: any;

    constructor(editor: any) {
      this.selectedTab = "rust-server";
      this.editor = editor;
      this.project = {
        models: [],
        requests: []
      };
      this.projects = [
        {
          name: "rust-server",
          description: "Rust Server",
          processor: Processors.processors["rust-server"],
          syntax: "rust",
          ast: {},
          code: "use diesel::Queryable;\n\n#[derive(Queryable, Debug)]\npub struct Pet {\n\tpub id: i32,\n\tpub name: String,\n\tpub tag: String,\n}\n\n#[derive(Queryable, Debug)]\npub struct Error {\n\tpub code: i32,\n\tpub message: String,\n}\n\npub fn listPets(limit: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets\", vec![(\"limit\", limit)])\n}\n\n\npub fn createPets() -> ApiResult<Error> {\n    ApiBase::call(\"POST\", \"/pets\", vec![])\n}\n\n\npub fn showPetById(petId: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets/{petId}\", vec![(\"petId\", petId)])\n}\n" // mostly a cache for tab switching
        },
        {
          name: "openapi",
          description: "OpenAPI v3",
          processor: Processors.processors["openapi"],
          syntax: "yaml",
          ast: {},
          code: "openapi code", // mostly a cache for tab switching
        }
      ];
      this.services = { // delete this stuff
        openapi: {
          server: "ws://localhost:7777",
          syntax: "yaml",
          code: ""
        },
        // typescript: {
        //   server: "ws://localhost:7778",
        //   syntax: "typescript",
        //   code: ""
        // },
        rust: {
          server: "ws://localhost:7779",
          syntax: "rust",
          code: ""
        }
      };
    }

    currentProject() {
      let currentProject = this.projects.find((project) => project.name === this.selectedTab);
      if (!currentProject) {
        console.log("no current project selected", this);
      }
      return currentProject;
    }

    clickTab(tabId: string) {
      this.selectedTab = tabId;
    }

    save() {
      let currentProject = this.currentProject();

      currentProject.code = this.editor.getValue();
      // update sidebar
      this.project = currentProject.processor.getProject(currentProject.code);

      // currentProject.ast = currentProject.processor.getAST(currentProject.code);
    }
  }

  // export function update() {
  //   console.log("state.update", appState);
  //   Tabs.update(appState);
  //   Editor.update(appState);
  //   Sidebar.update(appState);
  // }

  // export function save() {
  //   // if a tab is active and selected,
  //   if (appState.selectedTab) {
  //     // grab the editors code and save it
  //     // appState.services[appState.selectedTab].code = appState.editor.getValue();
  //     // parse and save the ast structure
  //     // appState.projects[appState.selectedTab].code = appState.editor.getValue();
  //     currentProject().code = appState.editor.getValue();
  //   }
  // }
}

// function updateTabs(appState: Models.AppState) {
//   document.querySelectorAll(`.tab-bar--tab.active`).forEach(value => {
//     value.classList.remove("active");
//   });
//   if (appState.selectedTab) {
//     document
//       .querySelector(`.tab-bar--tab.${appState.selectedTab}`)
//       .classList.add("active");
//   }
// }

// function updateEditor(appState: Models.AppState) {
//   if (appState.selectedTab) {
//     let service = appState.services[appState.selectedTab];
//     appState.editor.getSession().setMode(`ace/mode/${service.syntax}`);
//     appState.editor.setValue(service.code);
//     appState.editor.clearSelection();
//   }
// }
