import { Methods } from "./methods";
import { Models } from "./models";
const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

import { OpenAPIProcessor } from "./processors/openapi";
import { RustServerProcessor } from "./processors/rust-server";

// tip: use https://jsonpath.com/ and https://duckduckgo.com/?q=json+format https://github.com/s3u/JSONPath
// json templating: https://www.npmjs.com/package/jsonpath-object-transform
// https://runkit.com/kantord/runkit-npm-jq-in-the-browser
// https://github.com/kantord/jq-in-the-browser

export module Processors {
    export let services = {
        "rust": "ws://localhost:7779",
        "openapi": "ws://localhost:7777"
    };
    export let processors = {
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            extractSpec: RustServerProcessor.extractSpec,
            generate: RustServerProcessor.generate,
            update: RustServerProcessor.update,
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
            }
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            extractSpec: OpenAPIProcessor.extractSpec,
            getProject: OpenAPIProcessor.getProject,
            generate: OpenAPIProcessor.generate,
            update: RustServerProcessor.update
        },
    };
    export function sync() {
        console.log(processors);
    }
}

function transform(json:any, transform: string) {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    return JSONPath({path: '$..components.schemas', json: json, wrap: false});
}