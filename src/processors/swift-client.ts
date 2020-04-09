import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";
import * as _ from "lodash";
import { TypescriptGenerator, TypescriptVisitor } from "../langsupport/typescript";

export module SwiftClientProcessor {
    export function extractSpec(ast: { statements: []}): {} {
        let spec = { components: { schemas: {} }, paths: {} };

        for (const statement of ast.statements) {
            console.log(Object.keys(statement))
            for (const objectType of Object.keys(statement)) {
                switch (objectType) {
                    case "functionNode":
                        let node = statement["functionNode"];
                        spec.paths = _.merge(OpenAPIProcessor.createPath("/", "GET", node["ident"]), spec.paths);
                        break;

                    case "structNode":
                        Object.assign(spec.components.schemas,
                            OpenAPIProcessor.createObjectComponent(statement["structNode"]["ident"]));
                        break;
                }
            }
        }

        return spec;
    }

    export function merge(currentast: {}, spec: {}) {
        let statements = [];

        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            statements.push({
                "structNode": {
                    "ident": componentName,
                    "members": [

                    ]
                }
            })
        })

        OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
            statements.push({
                "functionNode": {
                    "ident": requestName,
                    "statements": [],
                    "params": []
                }
            })
        })

        return { statements: statements }
    }
}
