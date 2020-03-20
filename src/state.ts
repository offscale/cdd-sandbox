import { Processors } from "./processors/processors";
import { UI } from "./ui";
import { Methods } from "./methods";
import { OpenAPIProcessor } from "./processors/openapi";

export module State {
  export class AppState {
    selectedTab: string;
    editor: any;
    spec: {};
    services: any;
    projects: any;

    constructor(editor: any) {
      this.selectedTab = "openapi";
      this.editor = editor;
      this.spec = {"openapi":"3.0.0","info":{"title":"Swagger Petstore","license":{"name":"MIT"},"version":"1.0.0"},"servers":[{"url":"http://petstore.swagger.io/v1"}],"paths":{"/pets":{"get":{"tags":["pets"],"summary":"List all pets","operationId":"listPets","parameters":[{"in":"query","name":"limit","description":"How many items to return at one time (max 100)","schema":{"type":"integer","format":"int32"},"style":"form"}],"responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"200":{"description":"A paged array of pets","headers":{"x-next":{"description":"A link to the next page of responses","style":"simple","schema":{"type":"string"}}},"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pets"}}}}}},"post":{"tags":["pets"],"summary":"Create a pet","operationId":"createPets","responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"201":{"description":"Null response"}}}},"/pets/{petId}":{"get":{"tags":["pets"],"summary":"Info for a specific pet","operationId":"showPetById","parameters":[{"in":"path","name":"petId","description":"The id of the pet to retrieve","required":true,"schema":{"type":"string"},"style":"simple"}],"responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"200":{"description":"Expected response to a valid request","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}}}}}},"components":{"schemas":{"Pet":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}},"required":["id","name"]},"Pets":{"type":"array","items":{"$ref":"#/components/schemas/Pet"}},"Error":{"type":"object","properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}},"required":["code","message"]}}}};
      this.projects = [
        {
          name: "openapi",
          description: "OpenAPI v3 Spec",
          processor: Processors.processors["openapi"],
          syntax: "yaml",
          ast: {"openapi":"3.0.0","info":{"title":"Swagger Petstore","license":{"name":"MIT"},"version":"1.0.0"},"servers":[{"url":"http://petstore.swagger.io/v1"}],"paths":{"/pets":{"get":{"tags":["pets"],"summary":"List all pets","operationId":"listPets","parameters":[{"in":"query","name":"limit","description":"How many items to return at one time (max 100)","schema":{"type":"integer","format":"int32"},"style":"form"}],"responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"200":{"description":"A paged array of pets","headers":{"x-next":{"description":"A link to the next page of responses","style":"simple","schema":{"type":"string"}}},"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pets"}}}}}},"post":{"tags":["pets"],"summary":"Create a pet","operationId":"createPets","responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"201":{"description":"Null response"}}}},"/pets/{petId}":{"get":{"tags":["pets"],"summary":"Info for a specific pet","operationId":"showPetById","parameters":[{"in":"path","name":"petId","description":"The id of the pet to retrieve","required":true,"schema":{"type":"string"},"style":"simple"}],"responses":{"default":{"description":"unexpected error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Error"}}}},"200":{"description":"Expected response to a valid request","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}}}}}},"components":{"schemas":{"Pet":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}},"required":["id","name"]},"Pets":{"type":"array","items":{"$ref":"#/components/schemas/Pet"}},"Error":{"type":"object","properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}},"required":["code","message"]}}}},
          code: "---\r\nopenapi: 3.0.0\r\ninfo:\r\n  title: Swagger Petstore\r\n  license:\r\n    name: MIT\r\n  version: 1.0.0\r\nservers:\r\n  - url: \"http:\/\/petstore.swagger.io\/v1\"\r\npaths:\r\n  \/pets:\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: List all pets\r\n      operationId: listPets\r\n      parameters:\r\n        - in: query\r\n          name: limit\r\n          description: How many items to return at one time (max 100)\r\n          schema:\r\n            type: integer\r\n            format: int32\r\n          style: form\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: A paged array of pets\r\n          headers:\r\n            x-next:\r\n              description: A link to the next page of responses\r\n              style: simple\r\n              schema:\r\n                type: string\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pets\"\r\n    post:\r\n      tags:\r\n        - pets\r\n      summary: Create a pet\r\n      operationId: createPets\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"201\":\r\n          description: Null response\r\n  \"\/pets\/{petId}\":\r\n    get:\r\n      tags:\r\n        - pets\r\n      summary: Info for a specific pet\r\n      operationId: showPetById\r\n      parameters:\r\n        - in: path\r\n          name: petId\r\n          description: The id of the pet to retrieve\r\n          required: true\r\n          schema:\r\n            type: string\r\n          style: simple\r\n      responses:\r\n        default:\r\n          description: unexpected error\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Error\"\r\n        \"200\":\r\n          description: Expected response to a valid request\r\n          content:\r\n            application\/json:\r\n              schema:\r\n                $ref: \"#\/components\/schemas\/Pet\"\r\ncomponents:\r\n  schemas:\r\n    Pet:\r\n      type: object\r\n      properties:\r\n        id:\r\n          type: integer\r\n          format: int64\r\n        name:\r\n          type: string\r\n        tag:\r\n          type: string\r\n      required:\r\n        - id\r\n        - name\r\n    Pets:\r\n      type: array\r\n      items:\r\n        $ref: \"#\/components\/schemas\/Pet\"\r\n    Error:\r\n      type: object\r\n      properties:\r\n        code:\r\n          type: integer\r\n          format: int32\r\n        message:\r\n          type: string\r\n      required:\r\n        - code\r\n        - message", // mostly a cache for tab switching
        },
        {
          name: "rust-server",
          description: "API Server (Rust)",
          processor: Processors.processors["rust-server"],
          syntax: "rust",
          ast: {"items":[{"use":{"tree":{"path":{"ident":"diesel","tree":{"ident":"Queryable"}}}}},{"struct":{"attrs":[{"path":{"segments":[{"ident":"derive"}]},"style":"outer","tokens":[{"group":{"delimiter":"parenthesis","stream":[{"ident":"Queryable"},{"punct":{"op":",","spacing":"alone"}},{"ident":"Debug"}]}}]}],"fields":{"named":[{"colon_token":true,"ident":"id","ty":{"path":{"segments":[{"ident":"i32"}]}},"vis":"pub"},{"colon_token":true,"ident":"name","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"},{"colon_token":true,"ident":"tag","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"}]},"ident":"Pet","vis":"pub"}},{"struct":{"attrs":[{"path":{"segments":[{"ident":"derive"}]},"style":"outer","tokens":[{"group":{"delimiter":"parenthesis","stream":[{"ident":"Queryable"},{"punct":{"op":",","spacing":"alone"}},{"ident":"Debug"}]}}]}],"fields":{"named":[{"colon_token":true,"ident":"code","ty":{"path":{"segments":[{"ident":"i32"}]}},"vis":"pub"},{"colon_token":true,"ident":"message","ty":{"path":{"segments":[{"ident":"String"}]}},"vis":"pub"}]},"ident":"Error","vis":"pub"}},{"fn":{"ident":"listPets","inputs":[{"typed":{"pat":{"ident":{"ident":"limit"}},"ty":{"path":{"segments":[{"ident":"String"}]}}}}],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"GET\""}},{"lit":{"str":"\"/pets\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[{"group":{"delimiter":"parenthesis","stream":[{"lit":"\"limit\""},{"punct":{"op":",","spacing":"alone"}},{"ident":"limit"}]}}]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}},{"fn":{"ident":"createPets","inputs":[],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"POST\""}},{"lit":{"str":"\"/pets\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}},{"fn":{"ident":"showPetById","inputs":[{"typed":{"pat":{"ident":{"ident":"petId"}},"ty":{"path":{"segments":[{"ident":"String"}]}}}}],"output":{"path":{"segments":[{"arguments":{"angle_bracketed":{"args":[{"type":{"path":{"segments":[{"ident":"Error"}]}}}]}},"ident":"ApiResult"}]}},"stmts":[{"expr":{"call":{"args":[{"lit":{"str":"\"GET\""}},{"lit":{"str":"\"/pets/{petId}\""}},{"macro":{"delimiter":"bracket","path":{"segments":[{"ident":"vec"}]},"tokens":[{"group":{"delimiter":"parenthesis","stream":[{"lit":"\"petId\""},{"punct":{"op":",","spacing":"alone"}},{"ident":"petId"}]}}]}}],"func":{"path":{"segments":[{"ident":"ApiBase"},{"ident":"call"}]}}}}}],"vis":"pub"}}]},
          code: "use diesel::Queryable;\n\n#[derive(Queryable, Debug)]\npub struct Pet {\n\tpub id: i32,\n\tpub name: String,\n\tpub tag: String,\n}\n\n#[derive(Queryable, Debug)]\npub struct Error {\n\tpub code: i32,\n\tpub message: String,\n}\n\npub fn listPets(limit: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets\", vec![(\"limit\", limit)])\n}\n\n\npub fn createPets() -> ApiResult<Error> {\n    ApiBase::call(\"POST\", \"/pets\", vec![])\n}\n\n\npub fn showPetById(petId: String) -> ApiResult<Error> {\n    ApiBase::call(\"GET\", \"/pets/{petId}\", vec![(\"petId\", petId)])\n}\n" // mostly a cache for tab switching
        }
      ];
    }

    currentProject() {
      let currentProject = this.projects.find((project) => project.name === this.selectedTab);
      console.log("currentProject: ", currentProject);
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
      // console.log("currentProject:", currentProject);

      // save the current tab's code (THIS SHOULD HAPPEN ONLY ON VALID CODE)
      currentProject.code = this.editor.getValue();

      // try to convert to ast via service adaptor
      Methods.serialise(currentProject.processor.server, currentProject.code).then((result) => {
        let currentProject = this.currentProject();
        console.log("State.save->Methods.serialise", this, result);
        
        const ast = result["ast"];
        // memoize ast
        currentProject.ast = ast;

        // get spec update
        const specUpdate = currentProject.processor.extractSpec(ast);

        // merge spec with primary spec
        this.spec = OpenAPIProcessor.merge(this.spec, specUpdate);

        for (var backgroundProject of this.projects) {
          if (backgroundProject.name != this.currentProject().name) {
            console.log("State.save->Methods.serialise->backgroundProject", backgroundProject.name, this, backgroundProject);

            // some stupid state preservation issue in typescript, which is a broken piece of shit.
            let arrrrr = backgroundProject;

            // send spec to every project, to update each ast
            arrrrr.ast = arrrrr.processor.merge(arrrrr.ast, this.spec);
            // Object.assign(this.spec, arrrrr.processor.extractSpec(arrrrr.ast))

            // deserialise each ast to code
            Methods.deserialise(backgroundProject.processor.server, backgroundProject.ast).then((result) => {
              console.log("State.save->Methods.serialise->Methods.deserialise = ", arrrrr, backgroundProject, result, this);
              if (result) {
                arrrrr.code = result["output"];
              }
            });
          }
        }

        // finally refresh the display
        UI.update(this);
      });
    }
  }
}
