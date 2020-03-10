import { Models } from "../models";
import { Methods } from "../methods";
import { State } from "../state";
import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module RustServerProcessor {
    // extract a project model so the sidebar updates
    // export async function getProject(code: string): Promise<Models.Project> {
    // }

    export function extractSpec(ast: {}): {} {
        if (!ast) {
            console.log("RustServerProcessor.extractSpec(): null ast");
            return {};
        }
        const structs = select(ast, '$..struct');
        console.log("RustServerProcessor.extractSpec()", ast, structs);
        if (!Util.isIterable(structs)) {
            return {};
        }

        let components = {};

        for (const struct of structs) {
            components[struct["ident"]] = {};
        }

        console.log("RustServerProcessor.extractSpec() -> ", components);
        return { components: { schemas: components }};
    }

    // takes an openapi spec, updates ast
    export function merge(currentast: {}, spec: {}) {
        console.log("RustServerProcessor.generate()");

        let ast = { items: [] };

        // add models to the ast
        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            // console.log(componentName, component);
            let properties = OpenAPIProcessor.selectComponentProperties(component).map((property) => {
                return createClassField(property["name"], property["type"]);
            });
            
            ast.items.push(createClass(componentName, properties));
        });

        return ast;
    }

    // reads a openapi spec, returns rust ast 
    export async function generate(spec: {}): Promise<{}> {
        console.log("RustServerProcessor.generate()");

        let ast = { items: [] };
        // OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
        //     console.log(componentName, component);
        //     // add models to the ast
        //     ast.items.push(createClass(componentName));
        // });

        return ast;
    }

    function createClass(name: string, fields: {}[]): {} {
        return {
            "struct": {
                "ident": name,
                "fields": {
                    "named": fields
                },
                "attrs": [],
                "vis": "pub"
            }
        };
    }

    function createClassField(name: string, type: string): {} {
        return {
            "vis": "pub",
            "ident": name,
            "colon_token": true,
            "ty": {
              "path": {
                "segments": [
                  {
                    "ident": type
                  }
                ]
              }
            }
        };
    }
}

function transform(json:any, transform: string): {} {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    const selector = JSONPath({path: path, json: json, wrap: false});
    console.log('select():', selector);
    return selector;
}