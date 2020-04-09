import { Util } from "../utils";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module OpenAPIProcessor {
    // right is new spec, left previous
    export function merge(left: any, right: any) {
        console.log("-> OpenAPIProcessor.merge()", left, right);
        // Object.assign(left, right);
        // return right;
        // Object.assign(left["components"], right["components"]);
        left.components = right.components;
        left.paths = right.paths;

        // Object.assign(left, right);

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

    export function extractReturnType(request: {}, spec: {}): { type: string, array: boolean } {
        console.log("-> extractReturnType()", request, spec);
        let responses = select(request, '$.responses..schema.$ref');
        if (responses) {
            let refType = extractTypeFromRef(responses[0]);
            let componentType = extractComponentType(spec, refType);

            if (componentType) {
                console.log("<- extractReturnType()", { type: componentType.type, array: componentType.array });
                return { type: componentType.type, array: componentType.array };
            }
        }
    }

    export function extractComponentType(spec: {}, componentName: string): any {
        console.log("-> extractComponentType()", spec, componentName);
        let components = select(spec, '$..components.schemas');
        for (const ident in components) {
            if (ident == componentName) {
                const component = components[componentName];

                if (component.type == "array") {
                    const returnType = extractTypeFromRef(component.items["$ref"]);
                    if (returnType) {
                        return { type: returnType, array: true };
                    }
                }
                return { type: componentName, array: false };
            };
        };
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

    export function createObjectComponent(componentName: string) {
        return {
            [componentName]: {
                type: "object",
                properties: {},
                required: []
            }
        };
    }

    export function pushComponent(spec: { components: { schemas: {} } }, componentName: string) {
        spec.components.schemas[componentName] = {
            type: "object",
            properties: {},
            required: []
        };

        return;
    }

    export function pushComponentProperty(spec: { components: { schemas: {} } }, componentName: string, propertyName: string, propertyType: string, isOptional: boolean) {
        spec.components.schemas[componentName].properties[propertyName] = {
            type: propertyType
        };
    }

    export function pushPath(spec: { paths: {} }) {
        return;
    }

    export function createArrayComponent(pluralName: string, singularName: string) {
        return {
            [pluralName]: {
                type: "array",
                items: {
                    $ref: `#/components/schemas/${singularName}`
                }
            }
        };
    }

    export function createResponse(responseType: string, array: boolean): {} {
        console.log("createResponse", responseType, array);
        let response = array ? Util.pluralise(responseType) : responseType;
        return {
            "200": {
                content: {
                    ["application/json"]: {
                        schema: {
                            "$ref": `#/components/schemas/${response}`
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
}

function transform(json:any, transform: string) {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    return JSONPath({path: path, json: json, wrap: false});
}
