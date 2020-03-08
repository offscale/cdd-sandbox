import { Methods } from "./methods";
import { Models } from "./models";
const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

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

                    // const components = select(response, '$..components.schemas');
                    // const models = transform(components, '.[]|to_entries[]|{"name":.key, "vars": .value.properties | to_entries[] |{"name": .key, "type": .value.type }}');

                    select(response, '$..components.schemas').map((component) => {
                        console.log(component);
                        console.log(select(component, '$.properties'));
                        return {};
                        
                        // select(component, '$...properties')).map((property) => {
                        //     console.log(component);
                        //     return {};
                        // });
                        // return {name: "", vars: []};
                    });


                    var models = [];
                    for (const components of select(response, '$..components.schemas')) {
                        for (const modelName in components) {
                            const properties = components[modelName].properties;
                            var variables = [];

                            for (const variableName in properties) {
                                const variable = properties[variableName];

                                variables.push({name: variableName, type: variable.type});
                            };

                            models.push({name: modelName, vars: variables});
                        }
                    }

                    return {
                        models: models,
                        requests: [],
                    };
                });
            }
        },
    };
}

function transform(json:any, transform: string) {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    return JSONPath({path: '$..components.schemas', json: json, wrap: false});
}