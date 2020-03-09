import { Models } from "../models";
import { Methods } from "../methods";
import { State } from "../state";
import { OpenAPIProcessor } from "./openapi";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module RustServerProcessor {
    // extract a project model so the sidebar updates
    // export async function getProject(code: string): Promise<Models.Project> {
    // }

    export function extractSpec(ast: {}): {} {
        console.log("RustServerProcessor.extractSpec()");
        return { components: { schemas: {"Pet": {}}}};
    }

    // // parses current code into openapi
    // export async function parse(code: string): Promise<any> {
    //     console.log("RustServerProcessor.parse()");

    //     // const functions = JSONPath({path: '$..fn.ident', json: response});
    //     const structs = JSONPath({path: '$..struct.ident', json: response});
    //     let models = structs.map((struct) => {
    //         return { name: struct, vars: [] };
    //     });

    //     return {
    //         models: models,
    //         requests: [],
    //     };
    //     return {};
    // }

    // reads a openapi spec, returns rust ast 
    export async function generate(spec: {}): Promise<{}> {
        console.log("RustServerProcessor.generate()");

        let ast = { items: [{}] };
        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            console.log(componentName, component);
            // add models to the ast
            ast.items.push(createClass(componentName));
        });

        return ast;
    }

    function createClass(name: string): {} {
        return {
            "struct": {}
        };
    }
}

function transform(json:any, transform: string): {} {
    return nodejq(transform)(json);
}

function select(json: any, path: string): {} {
    return JSONPath({path: '$..components.schemas', json: json, wrap: false});
}