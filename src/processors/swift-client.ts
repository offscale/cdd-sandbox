import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";
import * as _ from "lodash";
import { TypescriptGenerator, TypescriptVisitor } from "../langsupport/typescript";

export module SwiftClientProcessor {
    export function extractSpec(ast: { statements: []}): {} {
        let spec = { components: { schemas: {} }, paths: {} };

        for (const statement of ast.statements) {
            console.log("-=---", ast, statement, Object.keys(statement))
            for (const objectType of Object.keys(statement)) {
                switch (objectType) {

                    case "structNode":
                        let structNode: { ident: string, members: [] } = statement["structNode"];

                        OpenAPIProcessor.pushComponent(spec, structNode.ident);

                        for (const member of structNode["members"]) {
                            let ident: string = member["ident"];
                            let type: string = member["type"];

                            OpenAPIProcessor.pushComponentProperty(spec, structNode.ident, ident, type, false);
                        }
                        break;
                                        
                    case "functionNode":
                        let functionNode = statement["functionNode"];
                        let path = functionNode["ident"];
                        let method = functionNode["ident"];

                        spec.paths = _.merge(OpenAPIProcessor.createPath(path, method, functionNode["ident"]), spec.paths);
                        break;
                }
            }
        }

        console.log("SwiftClientProcessor.extractSpec", ast, spec);
        return spec;
    }

    export function merge(currentast: {}, spec: {}) {
        let statements = [];

        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            var props = [];

            OpenAPIProcessor.eachComponentProperty(component, (propertyName, propertyType, optional) => {
                props.push({
                    ident: propertyName,
                    type: propertyType
                })
            });
            
            statements.push({
                "structNode": {
                    "ident": componentName,
                    "members": props
                }
            })
        })

        OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
            let params = [];

            OpenAPIProcessor.eachRequestParam(request, (paramName, paramType, isOptional) => {
                params.push({
                    "ident": paramName,
                    "type": paramType,
                    "isOptional": isOptional
                })
            });

            statements.push({
                "functionNode": {
                    "ident": requestName,
                    "statements": [],
                    "params": params
                }
            })
        })

        console.log("SwiftClientProcessor.merge", spec, statements);
        return { statements: statements }
    }
}
