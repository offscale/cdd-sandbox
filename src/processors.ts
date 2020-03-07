import { Methods } from "./methods";
import { Models } from "./models";
const { JSONPath } = require('jsonpath-plus');
const jq = require("jq-in-the-browser").default;

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
            async getProject(code: string): Promise<Models.Project> {
                return await Methods.serialise(this.server, code).then((response) => {
                    const components = JSONPath({path: '$..components.schemas', json: response, wrap: false});
                    const result = jq('.[] | to_entries[] |{"name":.key, "vars":.value}')(components);
                    let models = result.map((model) => {
                        console.log("mm", model);
                        return model;
                    });

                    return {
                        models: result,
                        requests: [],
                    };
                });
            }
        },
    };
}
