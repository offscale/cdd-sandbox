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

    // right is new spec, left previous
    export function merge(left: any, right: any) {
        console.log("-> OpenAPIProcessor.merge()", left, right);
        // Object.assign(left, right);
        // return right;
        Object.assign(left["components"], right["components"]);
        console.log("<- OpenAPIProcessor.merge()", left);
        // left.components = right.components;
        // left.paths = right.components;

        Object.assign(left, right);

        return left;
    }

    // reads current spec, returns code
    export async function generate(spec: any): Promise<string> {
        return "new openapi code!";
    }

    export function extractSpec(ast: {}): {} {
        return ast;
    }

    export function eachRequest(spec: any, fn: (requestName, requestMethod, requestPath, request) => void) {
        for (const requestPath in spec.paths) {
            for (const requestMethod in spec.paths[requestPath]) {
                let request = spec.paths[requestPath][requestMethod];
                let requestName = request.operationId;
                fn(requestName, requestMethod, requestPath, request);
            }
        }
    }

    export function eachRequestParam(spec: { parameters: [{name: string, schema: { type: string }}]}, fn: (paramName: string, paramType: string, optional: boolean) => void) {
        if(!spec.parameters) { return; }
        for (const param of spec.parameters) {
            fn(param.name, param.schema.type, true);
        }
    }

    export function extractReturnType(spec: {}): string {
        let responses = select(spec, '$.responses..schema.$ref');
        if (responses) {
            return extractTypeFromRef(responses[0]);
        }
    }

    // extract a type from a ref string eg: 
    function extractTypeFromRef(ref: string): string {
        // todo: fix
        return ref.split("/").pop();
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

    export function selectRequestParams(spec: any) {
        if (!spec.parameters) { return []; }
        return spec.parameters.map((param) => {
            return { name: param.name, type: param.schema.type };
        });
    }

    export function createRequestParameter(paramName: string, paramType: string): {} {
        return {
            name: paramName,
            schema: {
                type: paramType
            }
        };
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

    export function createResponse(responseType: string): {} {
        return {
            default: {
                content: {
                    ["application/json"]: {
                        schema: {
                            "$ref": `#/components/schemas/${responseType}`
                        }
                    }
                }
            }
        };
    }

    export function createPath(path: string, pathMethod: string, pathName: string) {
        return {
            [path]: {
                [pathMethod]: {
                    tags: [],
                    summary: "",
                    operationId: pathName,
                    parameters: [],
                    responses: {   
                    }
                }
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
