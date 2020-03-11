import { Models } from "../models";
import { Methods } from "../methods";
import { State } from "../state";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module OpenAPIProcessor {
    // parse code into ast
    export async function parse(code: string) {

    }

    export function merge(left: {}, right: {}): {} {
        console.log("OpenAPIProcessor.merge()", left, right);
        return right;
    }

    // reads current spec, returns code
    export async function generate(spec: any): Promise<string> {
        return "new openapi code!";
    }

    export function extractSpec(ast: {}): {} {
        return ast;
    }

    // iterate over components
    export function eachComponent(spec: any, fn: (componentName, component) => void) {
        let components = select(spec, '$..components.schemas');
        for (const componentName in components) {
            if(components[componentName].type == "object") {
                fn(componentName, components[componentName]);
            }
        }
    }

    export function eachComponentProperty(spec: any, fn: (propertyName: string, propertyType: string) => void) {
        for (const propertyName in spec.properties) {
            fn(propertyName, spec.properties[propertyName].type);
        }
    }

    export function selectComponentProperties(spec: any): {name: string, type: string}[] {
        let properties = [];
        eachComponentProperty(spec, (propertyName, propertyType) => {
            properties.push({name: propertyName, type: propertyType});
        });
        return properties;
    }

    export function createComponent() {
        return {
            type: "object"
        };
    }

    export async function getProject(code: string): Promise<Models.Project> {
        return await Methods.serialise(this.server, code).then((response) => {

            var models = [];
            for (const components of select(response, '$..components.schemas')) {
                for (const modelName in components) {
                    if (components[modelName].type == "object") {
                        const properties = components[modelName].properties;
                        var variables = [];
    
                        for (const variableName in properties) {
                            const variable = properties[variableName];
    
                            variables.push({name: variableName, type: variable.type});
                        };
    
                        models.push({name: modelName, vars: variables});
                    }
                }
            }

            return {
                models: models,
                requests: [],
            };
        });
    }
}

function transform(json:any, transform: string) {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    return JSONPath({path: path, json: json, wrap: false});
}
