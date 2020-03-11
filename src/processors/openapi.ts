import { Models } from "../models";
import { Methods } from "../methods";
import { Util } from "../utils";

const { JSONPath } = require('jsonpath-plus');
// import * as _ from "lodash";
const nodejq = require("jq-in-the-browser").default;

export module OpenAPIProcessor {
    // parse code into ast
    export async function parse(code: string) {

    }

    export function merge(left: {}, right: {}) {
        console.log("-> OpenAPIProcessor.merge()", left, right);
        // Object.assign(left, right);
        // return right;
        Object.assign(left["components"], right["components"]);
        console.log("<- OpenAPIProcessor.merge()", left);
        return left;
    }

    // reads current spec, returns code
    export async function generate(spec: any): Promise<string> {
        return "new openapi code!";
    }

    export function extractSpec(ast: {}): {} {
        return ast;
    }

    // iterate over components (models)
    export function eachComponent(spec: any, fn: (componentName, component) => void) {
        let components = select(spec, '$..components.schemas');
        for (const componentName in components) {
            if(components[componentName].type == "object") {
                fn(componentName, components[componentName]);
            }
        }
    }

    export function eachComponentProperty(spec: any, fn: (propertyName: string, propertyType: string, optional: boolean) => void) {
        for (const propertyName in spec.properties) {
            let optional = !Util.arrayIncludes(propertyName, spec.required);
            fn(propertyName, spec.properties[propertyName].type, optional);
        }
    }

    export function selectComponentProperties(spec: any): {name: string, type: string}[] {
        let properties = [];
        eachComponentProperty(spec, (propertyName, propertyType) => {
            properties.push({name: propertyName, type: propertyType});
        });
        return properties;
    }

    export function createComponent(componentName: string) {
        return {
            [componentName]: {
                type: "object",
                properties: {},
                required: []
            }
        };
    }

    export function createProperty(propertyName: string, propertyType: string) {
        return {
            [propertyName]: {
                type: propertyType
            }
        }
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
