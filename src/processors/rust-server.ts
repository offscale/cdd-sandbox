import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";
import * as _ from "lodash";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module RustServerProcessor {
    export function extractSpec(ast: {}): {} {
        if (!ast) {
            console.log("RustServerProcessor.extractSpec(): null ast");
            return {};
        }
        const structs = select(ast, '$..struct');
        if (!Util.isIterable(structs)) {
            return {};
        }

        let spec = { components: { schemas: {} }, paths: {} };

        for (const struct of structs) {
            const structName = struct.ident;

            Object.assign(spec.components.schemas,
                OpenAPIProcessor.createObjectComponent(structName));

            for (const field of struct.fields.named) {
                let property = extractVar(field);
                if (property.optional) {
                    spec.components.schemas[structName].required.push(property.name);
                };
                Object.assign(spec.components.schemas[structName].properties,
                    OpenAPIProcessor.createProperty(property.name, toType(property.type) ));
            }
        }

        for (const fn of select(ast, '$..fn')) {
            const fnName = fn.ident;
            const fnPath = extractRequestPath(fn); // fix
            const fnMethod = extractRequestMethod(fn);
            const fnReturnType = extractReturnType(fn);
            const fnParams = extractFunctionParams(fn);

            if (fnReturnType.array) {
              Object.assign(spec.components.schemas,
                OpenAPIProcessor.createArrayComponent(Util.pluralise(fnReturnType.name), fnReturnType.name));
            }

            spec.paths = _.merge(OpenAPIProcessor.createPath(fnPath, fnMethod, fnName), spec.paths);
            spec.paths[fnPath][fnMethod].responses = OpenAPIProcessor.createResponse(fnReturnType.name, fnReturnType.array);

            if (fnParams) {
                spec.paths[fnPath][fnMethod].parameters = fnParams.map((param) => {
                  return OpenAPIProcessor.createRequestParameter(param.paramName, param.paramType)
                });
            }
        }

        console.log("<- RustServerProcessor.extractSpec()", spec);
        return spec;
    }

    function extractRequestPath(spec: {}): string {
        let responses = select(spec, '$..str');
        if (!responses) { return; }
        for (const response of responses) {
            if (response.includes("/") == true) {
                return response.replace(/\"/, "").replace(/\"/, "");
            }
        }
    }

    function extractFunctionParams(spec: { inputs: [] }): {paramName, paramType}[] {
        if (!spec.inputs) {
            return [];
        }
        return spec.inputs.map((arg) => {
            let paramName = select(arg, '$.typed..ident.ident')[0];
            let paramType = select(arg, '$.typed..ty..ident')[0];
            return { paramName: paramName, paramType: paramType };
        });
    }

    function extractRequestMethod(spec: {}): string {
        let responses = select(spec, '$..str');
        if (!responses) { return; }
        if (Util.arrayIncludes("\"GET\"", responses)) {
            return "get";
        }
        if (Util.arrayIncludes("\"POST\"", responses)) {
            return "post";
        }
    }

    function extractReturnType(spec: {}): { name: string, array: boolean } {
        let responses = select(spec, '$.output..ident');
        if (responses) {
            return { name: responses.pop(), array: Util.arrayIncludes("Vec", responses)};
        };
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
        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            let properties = OpenAPIProcessor.selectComponentProperties(component).map(({ name, type }) => {
                const optional = Util.arrayIncludes(name, component.required);
                return createClassField(name, fromType(type), optional);
            });
            
            ast.items.push(createClass(componentName, properties));
        });

        // add requests to the ast
        OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
            console.log("OpenAPIProcessor->request", spec, requestName, requestMethod, requestPath, request);
            let params = OpenAPIProcessor.selectRequestParams(request).map(({name, type}) => {
                return createFunctionParam(name, fromType(type));
            });
            let requestCallStatement = createRequestCall(requestPath, requestMethod);
            var returnObject = OpenAPIProcessor.extractReturnType(request, spec);

            let fn = createFunction(requestName, params, [
              requestCallStatement
            ], returnObject);

            console.log("made fn:", fn);

            ast.items.push(fn);
        })

        return ast;
    }

    function createFunctionParam(name: string, type: string): {} {
        return {
            "typed": {
                "pat": {
                    "ident": {"ident": name}
                    },
                    "ty": {
                        "path": {
                            "segments": [{ "ident": type }]
                    }
                }
            }
        };
    }

    function createFunction(functionName: string, params: [], content: {}, returnType: {type: string, array: boolean}): { fn: {} } {
        // console.log("createFunction()", returnType);
        let rt = {
            "fn": {
                "ident": functionName,
                "stmts": content,
                "inputs": params
            }
        };

        if (returnType) {
          rt.fn["output"] = createFunctionReturnType(returnType.type, "ApiBase", returnType.array);
        };

        return rt;
    }

    function createRequestCall(requestPath: string, requestMethod: string) {
      return {
        "expr": {
          "call": {
            "func": {
              "path": {
                "segments": [
                  {
                    "ident": "ApiBase"
                  },
                  {
                    "ident": "call"
                  }
                ]
              }
            },
            "args": [
              {
                "lit": {
                  "str": `\"${requestMethod.toUpperCase()}\"`
                }
              },
              {
                "lit": {
                  "str": `\"${requestPath}\"`
                }
              }
            ]
          }
        }
      };
    }
    
    function wrapFunctor(name: string, content: {}): {} {
      return { "path": {
          "segments": [
            {
              "arguments": {
                "angle_bracketed": {
                  "args": [
                    {
                      "type": content
                    }
                  ]
                }
              },
              "ident": name
            }
          ]
        }
      };
    }

    function createFunctionReturnType(type: string, bracketType: string, array: boolean): {} {
      var innerType: {} = {"path": {
        "segments": [
          {
            "ident": type
          }
        ]
      }};

      if (array == true) {
        innerType = wrapFunctor("Vec", innerType);
      }
      
      return wrapFunctor(bracketType, innerType);
    }

    /// convert from openapi type to rust type
    function fromType(type: string): string {
        switch (type) {
            case "boolean": return "bool"
            case "float": return "f64";
            case "integer": return "i64";
            case "string": return "String";
            default: return "unknown";
        }
    }

    /// convert from rust type to openapi type
    function toType(type: string): string {
        switch (type) {
            case "bool":
              return "boolean";
            case "float":
              return "f64";
            case "i32":
            case "u32":
            case "u64":
            case "i64":
              return "integer";
            case "&str":
            case "String":
              return "string";
            default: return "unknown";
        }
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
    }
}

function transform(json:any, transform: string): {} {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    const selector = JSONPath({path: path, json: json, wrap: false});
    return selector;
}