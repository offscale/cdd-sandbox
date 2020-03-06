import { Methods } from "./methods";
import { Models } from "./models";
import { UI } from "./ui";
const { JSONPath } = require('jsonpath-plus');

export module Processors {
    export let services = {
        "rust": "ws://localhost:7779",
        "openapi": "ws://localhost:7779"
    };
    export let processors = {
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            async getProject(code: string): Promise<Models.Project> {
                return await Methods.serialise(this.server, code).then((response) => {
                    console.log(response);

                    // const functions = JSONPath({path: '$..fn.ident', json: response});
                    const structs = JSONPath({path: '$..struct.ident', json: response});
                    let models = structs.map((struct) => {
                        return { name: struct, vars: [] };
                    });

                    return {
                        models: models,
                        requests: [],
                    };
                });

                // return await project;
                
                // Methods.serialise(this.server, code, (ast) => {
                //     const result = JSONPath({path: '$..fn.ident', json: ast});
                //     console.log(result);
                // });
                // console.log(response);
                // const result = JSONPath({path: '$..fn', json: response.ast});
                // console.log(result);


            }
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            getProject(code: string) {  }
        },
    };
}
