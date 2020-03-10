import { Models } from "./models";
import { Processors } from "./processors";
import { UI } from "./ui";
import { Methods } from "./methods";
import { OpenAPIProcessor } from "./processors/openapi";

export module State {

  export class AppState {
    selectedTab: string;
    editor: any;
    project: Models.Project;
    spec: {};
    services: any;
    projects: any;

    constructor(editor: any) {
      this.selectedTab = "openapi";
      this.editor = editor;
      this.spec = {"components":{"schemas":{"Error":{"properties":{"code":{"format":"int32","type":"integer"},"message":{"type":"string"}},"required":["code","message"],"type":"object"},"Pet":{"properties":{"id":{"format":"int64","type":"integer"},"name":{"type":"string"},"tag":{"type":"string"}},"required":["id","name"],"type":"object"},"Pets":{"items":{"$ref":"#/components/schemas/Pet"},"type":"array"}}},"info":{"license":{"name":"MIT"},"title":"Swagger Petstore","version":"1.0.0"},"openapi":"3.0.0","paths":{"/pets":{"get":{"operationId":"listPets","parameters":[{"description":"How many items to return at one time (max 100)","in":"query","name":"limit","schema":{"format":"int32","type":"integer"},"style":"form"}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pets"}}},"description":"A paged array of pets","headers":{"x-next":{"description":"A link to the next page of responses","schema":{"type":"string"},"style":"simple"}}},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"List all pets","tags":["pets"]},"post":{"operationId":"createPets","responses":{"201":{"description":"Null response"},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"Create a pet","tags":["pets"]}},"/pets/{petId}":{"get":{"operationId":"showPetById","parameters":[{"description":"The id of the pet to retrieve","in":"path","name":"petId","required":true,"schema":{"type":"string"},"style":"simple"}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Expected response to a valid request"},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"Info for a specific pet","tags":["pets"]}}},"servers":[{"url":"http://petstore.swagger.io/v1"}]};
      this.project = {
        models: [],
        requests: []
      };
      this.projects = [
        {
          name: "openapi",
          description: "OpenAPI v3",
          processor: Processors.processors["openapi"],
          syntax: "yaml",
          ast: {"components":{"schemas":{"Error":{"properties":{"code":{"format":"int32","type":"integer"},"message":{"type":"string"}},"required":["code","message"],"type":"object"},"Pet":{"properties":{"id":{"format":"int64","type":"integer"},"name":{"type":"string"},"tag":{"type":"string"}},"required":["id","name"],"type":"object"},"Pets":{"items":{"$ref":"#/components/schemas/Pet"},"type":"array"}}},"info":{"license":{"name":"MIT"},"title":"Swagger Petstore","version":"1.0.0"},"openapi":"3.0.0","paths":{"/pets":{"get":{"operationId":"listPets","parameters":[{"description":"How many items to return at one time (max 100)","in":"query","name":"limit","schema":{"format":"int32","type":"integer"},"style":"form"}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pets"}}},"description":"A paged array of pets","headers":{"x-next":{"description":"A link to the next page of responses","schema":{"type":"string"},"style":"simple"}}},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"List all pets","tags":["pets"]},"post":{"operationId":"createPets","responses":{"201":{"description":"Null response"},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"Create a pet","tags":["pets"]}},"/pets/{petId}":{"get":{"operationId":"showPetById","parameters":[{"description":"The id of the pet to retrieve","in":"path","name":"petId","required":true,"schema":{"type":"string"},"style":"simple"}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Expected response to a valid request"},"default":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}},"description":"unexpected error"}},"summary":"Info for a specific pet","tags":["pets"]}}},"servers":[{"url":"http://petstore.swagger.io/v1"}]},
          code: "---\r\nopenapi: 3.0.0\r\ninfo:\r\n  title: Swagger Petstore\r\n  license:\r\n    name: MIT\r\n  version: 1.0.0\r\nservers:\r\n  - url: \"http:\/\/petstore.swagger.io\/v1\"\r\npaths:\r\n  \/pets:\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: List all pets\r\n      operationId: listPets\r\n      parameters:\r\n        - in: query\r\n          name: limit\r\n          description: How many items to return at one time (max 100)\r\n          schema:\r\n            type: integer\r\n            format: int32\r\n          style: form\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: A paged array of pets\r\n          headers:\r\n            x-next:\r\n              description: A link to the next page of responses\r\n              style: simple\r\n              schema:\r\n                type: string\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pets\"\r\n    post:\r\n      tags:\r\n        - pets\r\n      summary: Create a pet\r\n      operationId: createPets\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"201\":\r\n          description: Null response\r\n  \"\/pets\/{petId}\":\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: Info for a specific pet\r\n      operationId: showPetById\r\n      parameters:\r\n        - in: path\r\n          name: petId\r\n          description: The id of the pet to retrieve\r\n          required: true\r\n          schema:\r\n            type: string\r\n          style: simple\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: Expected response to a valid request\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pet\"\r\ncomponents:\r\n  schemas:\r\n    Pet:\r\n      type: object\r\n      properties:\r\n        id:\r\n          type: integer\r\n          format: int64\r\n        name:\r\n          type: string\r\n        tag:\r\n          type: string\r\n      required:\r\n        - id\r\n        - name\r\n    Pets:\r\n      type: array\r\n      items:\r\n        $ref: \"#\/components\/schemas\/Pet\"\r\n    Error:\r\n      type: object\r\n      properties:\r\n        code:\r\n          type: integer\r\n          format: int32\r\n        message:\r\n          type: string\r\n      required:\r\n        - code\r\n        - message", // mostly a cache for tab switching
        },
        {
          name: "rust-server",
          description: "Rust Server",
          processor: Processors.processors["rust-server"],
          syntax: "rust",
          ast: {"items":[{"use":{"tree":{"path":{"ident":"diesel","tree":{"ident":"Queryable"}}}}},{"struct":{"attrs":[{"path":{"segments":[{"ident":"derive"}]},"style":"outer","tokens":[{"group":{"delimiter":"parenthesis","stream":[{"ident":"Queryable"},{"punct":{"op":",","spacing":"alone"}},{"ident":"Debug"}]}}]}],"fields":{"named":[{"colon_token":true,"ident":"id","ty":{"path":{"segments":[{"ident":"i32"}]}},"vis":"pub"},{"colon_token":true,"ident":"name","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"},{"colon_token":true,"ident":"tag","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"}]},"ident":"Pet","vis":"pub"}},{"struct":{"attrs":[{"path":{"segments":[{"ident":"derive"}]},"style":"outer","tokens":[{"group":{"delimiter":"parenthesis","stream":[{"ident":"Queryable"},{"punct":{"op":",","spacing":"alone"}},{"ident":"Debug"}]}}]}],"fields":{"named":[{"colon_token":true,"ident":"code","ty":{"path":{"segments":[{"ident":"i32"}]}},"vis":"pub"},{"colon_token":true,"ident":"message","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"}]},"ident":"Error","vis":"pub"}},{"fn":{"ident":"listPets","inputs":[{"typed":{"pat":{"ident":{"ident":"limit"}},"ty":{"path":{"segments":[{"ident":"String"}]}}}}],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"GET\""}},{"lit":{"str":"\"/pets\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[{"group":{"delimiter":"parenthesis","stream":[{"lit":"\"limit\""},{"punct":{"op":",","spacing":"alone"}},{"ident":"limit"}]}}]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}},{"fn":{"ident":"createPets","inputs":[],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"POST\""}},{"lit":{"str":"\"/pets\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}},{"fn":{"ident":"showPetById","inputs":[{"typed":{"pat":{"ident":{"ident":"petId"}},"ty":{"path":{"segments":[{"ident":"String"}]}}}}],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"GET\""}},{"lit":{"str":"\"/pets/{petId}\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[{"group":{"delimiter":"parenthesis","stream":[{"lit":"\"petId\""},{"punct":{"op":",","spacing":"alone"}},{"ident":"petId"}]}}]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}}]},
          code: "use diesel::Queryable;\n\n#[derive(Queryable, Debug)]\npub struct Pet {\n\tpub id: i32,\n\tpub name: String,\n\tpub tag: String,\n}\n\n#[derive(Queryable, Debug)]\npub struct Error {\n\tpub code: i32,\n\tpub message: String,\n}\n\npub fn listPets(limit: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets\", vec![(\"limit\", limit)])\n}\n\n\npub fn createPets() -> ApiResult<Error> {\n    ApiBase::call(\"POST\", \"/pets\", vec![])\n}\n\n\npub fn showPetById(petId: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets/{petId}\", vec![(\"petId\", petId)])\n}\n" // mostly a cache for tab switching
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

    save() { // sync
      console.log("State.save", this);
      let currentProject = this.currentProject();

      // save the current tab's code (THIS SHOULD HAPPEN ONLY ON VALID CODE)
      currentProject.code = this.editor.getValue();

      // try to convert to ast via service adaptor
      Methods.serialise(currentProject.processor.server, currentProject.code).then((result) => {
        console.log("State.save->Methods.serialise", this, result);
        
        const ast = result["ast"];
        // memoize ast
        currentProject.ast = ast;

        // get spec update
        const specUpdate = currentProject.processor.extractSpec(ast);

        // merge spec with primary spec
        // this.spec = OpenAPIProcessor.merge(this.spec, specUpdate);

        for (var project of this.projects) {
          if (project.name != this.selectedTab) {
            console.log("State.save->Methods.serialise->project", project);
            // send spec to every project, to update each ast
            project.processor.update(project.processor.server, this.spec);

            // deserialise each ast to code
            Methods.deserialise(project.processor.server, project.ast).then((result) => {
              project.code = result["output"];
            });
          }
        }

        // finally refresh the display
        UI.update(this);
      });

      // // modify main openapi spec to reflect changes

      // // update the sidebar (this is incorrect, directly call Sidebar.update(spec))
      // currentProject.processor.getProject(currentProject.code).then((project) => {
      //   this.project = project;

      //   Processors.sync();
      //   UI.update(this);
      // });

      // // 
      // for (var project of this.projects) {
      //   console.log("gggg", this);
        

      //   // send spec to every project, to update their ast
      //   // deserialise each ast to code
      //   project.processor.generate(this.spec).then((code) => {
      //     project.code = code;
      //   });
      // }
    }
  }
}
