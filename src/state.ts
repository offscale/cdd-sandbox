import { Models } from "./models";
import { Processors } from "./processors";
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
          code: "---\r\nopenapi: 3.0.0\r\ninfo:\r\n  title: Swagger Petstore\r\n  license:\r\n    name: MIT\r\n  version: 1.0.0\r\nservers:\r\n  - url: \"http:\/\/petstore.swagger.io\/v1\"\r\npaths:\r\n  \/pets:\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: List all pets\r\n      operationId: listPets\r\n      parameters:\r\n        - in: query\r\n          name: limit\r\n          description: How many items to return at one time (max 100)\r\n          schema:\r\n            type: integer\r\n            format: int32\r\n          style: form\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: A paged array of pets\r\n          headers:\r\n            x-next:\r\n              description: A link to the next page of responses\r\n              style: simple\r\n              schema:\r\n                type: string\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pets\"\r\n    post:\r\n      tags:\r\n        - pets\r\n      summary: Create a pet\r\n      operationId: createPets\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"201\":\r\n          description: Null response\r\n  \"\/pets\/{petId}\":\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: Info for a specific pet\r\n      operationId: showPetById\r\n      parameters:\r\n        - in: path\r\n          name: petId\r\n          description: The id of the pet to retrieve\r\n          required: true\r\n          schema:\r\n            type: string\r\n          style: simple\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: Expected response to a valid request\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pet\"\r\ncomponents:\r\n  schemas:\r\n    Pet:\r\n      type: object\r\n      properties:\r\n        id:\r\n          type: integer\r\n          format: int64\r\n        name:\r\n          type: string\r\n        tag:\r\n          type: string\r\n      required:\r\n        - id\r\n        - name\r\n    Pets:\r\n      type: array\r\n      items:\r\n        $ref: \"#\/components\/schemas\/Pet\"\r\n    Error:\r\n      type: object\r\n      properties:\r\n        code:\r\n          type: integer\r\n          format: int32\r\n        message:\r\n          type: string\r\n      required:\r\n        - code\r\n        - message", // mostly a cache for tab switching
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
      currentProject.processor.getProject(currentProject.code).then((project) => {
        this.project = project;
        UI.update(this);
      });

    }
  }
}
