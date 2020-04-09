import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";
import * as _ from "lodash";
import { TypescriptGenerator, TypescriptVisitor } from "../langsupport/typescript";

// const { JSONPath } = require('jsonpath-plus');
// const nodejq = require("jq-in-the-browser").default;

export module TypescriptClientProcessor {
    // generate openapi spec from ast
    export function extractSpec(ast: {}): {} {
        console.log("TypescriptClientProcessor.extractSpec()", ast);
        let spec = { components: { schemas: {} }, paths: {} };

        TypescriptVisitor.eachClass(ast, (className, members) => {
            Object.assign(spec.components.schemas,
                OpenAPIProcessor.createObjectComponent(className));

            if (Util.isIterable(members)) {
                for (const member of members) {
                    if (member.optional) {
                        spec.components.schemas[className].required.push(member.name);
                    };
                    Object.assign(spec.components.schemas[className].properties,
                        OpenAPIProcessor.createProperty(member.name, member.type));
                }
            }
        });

        TypescriptVisitor.eachFunction(ast, (fnName) => {
            spec.paths = _.merge(OpenAPIProcessor.createPath("/", "GET", fnName), spec.paths);
        });

        return spec;
    }
    
    // takes an openapi spec, updates ast
    export function merge(currentast: {}, spec: {}) {
        console.log("TypescriptClientProcessor.merge()", spec);
        let ast = { statements: [], "kind": 288, "text": "" };

        ast.statements.push(TypescriptGenerator.importStatement());

        // add models to the ast
        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            let members = OpenAPIProcessor.selectComponentProperties(component).map(({ name, type }) => {
                const optional = Util.arrayIncludes(name, component.required);
                // return createClassMemberVariable(name, fromType(type), optional);
                return TypescriptGenerator.createClassMemberVariable(
                    name,
                    type,
                    optional
                );
            });
            
            // ast.items.push(createClass(componentName, properties));
            ast.statements.push(TypescriptGenerator.createClass(componentName, members));
        });

        OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
            let params = OpenAPIProcessor.selectRequestParams(request).map(({name, type}) => {
                return TypescriptGenerator.createFunctionParam(
                    name,
                    type
                );
            });

            ast.statements.push(TypescriptGenerator.createFunction(requestName, []));
        });

        return ast;
    }
}
