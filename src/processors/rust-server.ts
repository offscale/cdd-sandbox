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
        console.log("-> RustServerProcessor.extractSpec()", ast, structs);
        if (!Util.isIterable(structs)) {
            return {};
        }

        let components = {};

        for (const struct of structs) {
            const structName = struct.ident;

            Object.assign(components,
                OpenAPIProcessor.createComponent(structName));

            for (const field of struct.fields.named) {
                let property = extractVar(field);
                if (property.optional) {
                    components[structName].required.push(property.name);
                };
                Object.assign(components[structName].properties,
                    OpenAPIProcessor.createProperty(property.name, property.type ));
            }
        }

        console.log("<- RustServerProcessor.extractSpec()", components);
        return { components: { schemas: components }};
    }

    // takes variable ast, returns generic object
    function extractVar(field: { ident: string }): { name: string, type: string, optional: boolean } {
        let types = select(field, '$..ty..ident');
        // account for bracketed types
        // let internal_type = select(field, '$..angle_bracketed..ident')[0];
        console.log("RustServerProcessor.extractVar()", field, types);

        return { name: field.ident, type: types.pop(), optional: Util.arrayIncludes('Option', types) };
    }

    // takes an openapi spec, updates ast
    export function merge(currentast: {}, spec: {}) {
        console.log("RustServerProcessor.merge()");
        // todo: increase complexity of this merge to not touch unrelated ast constructs.

        let ast = { items: [] };

        // add models to the ast
        OpenAPIProcessor.eachComponent(spec, (componentName, component, optional) => {
            // console.log(componentName, component);
            let properties = OpenAPIProcessor.selectComponentProperties(component).map((property) => {
                return createClassField(property["name"], property["type"], optional);
            });
            
            ast.items.push(createClass(componentName, properties));
        });

        // currentast = ast;
        return ast;
    }

    // // reads a openapi spec, returns rust ast 
    // export async function generate(spec: {}): Promise<{}> {
    //     console.log("RustServerProcessor.generate()");

    //     let ast = { items: [] };
    //     // OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
    //     //     console.log(componentName, component);
    //     //     // add models to the ast
    //     //     ast.items.push(createClass(componentName));
    //     // });

    //     return ast;
    // }

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

    function createOptionalField(type: string): {} {
        return {
            "ident": "Option",
            arguments: {
                angle_bracketed: {
                    args: [
                        {
                            type: {
                                path: {
                                    segments: [
                                        { ident: type }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        };
    }

    function createClassField(name: string, type: string, optional: boolean): {} {
        let ident = optional ? createOptionalField(type) : { "ident": type };
        return {
            "vis": "pub",
            "ident": name,
            "colon_token": true,
            "ty": {
              "path": {
                "segments": [ ident ]
              }
            }
        };
        // return {
        //     "vis": "pub",
        //     "ident": name,
        //     "colon_token": true,
        //     "ty": {
        //       "path": {
        //         "segments": [
        //           {
        //             "ident": type
        //           }
        //         ]
        //       }
        //     }
        // };
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