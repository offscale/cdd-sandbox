import { OpenAPIProcessor } from "./openapi";
import { Util } from "../utils";
import * as _ from "lodash";
import { TypescriptGenerator } from "../langsupport/typescript";

const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

export module TypescriptClientProcessor {
    // generate openapi spec from ast
    export function extractSpec(ast: {}): {} {
        console.log("TypescriptClientProcessor.extractSpec()", ast);
        return {};
    }
    
    // takes an openapi spec, updates ast
    export function merge(currentast: {}, spec: {}) {
        console.log("TypescriptClientProcessor.merge()", spec);
        let ast = { statements: [], "kind": 288, "text": "" };

        // add models to the ast
        OpenAPIProcessor.eachComponent(spec, (componentName, component) => {
            let properties = OpenAPIProcessor.selectComponentProperties(component).map(({ name, type }) => {
                const optional = Util.arrayIncludes(name, component.required);
                // return createClassMemberVariable(name, fromType(type), optional);
                return TypescriptGenerator.createClassMemberVariable(
                    name,
                    TypescriptGenerator.typeFromOpenAPI(type)
                );
                return [];
            });
            
            // ast.items.push(createClass(componentName, properties));
            ast.statements.push(TypescriptGenerator.createClass(componentName, properties));
        });

        OpenAPIProcessor.eachRequest(spec, (requestName, requestMethod, requestPath, request) => {
            let params = OpenAPIProcessor.selectRequestParams(request).map(({name, type}) => {
                return TypescriptGenerator.createFunctionParam(
                    name,
                    TypescriptGenerator.typeFromOpenAPI(type)
                );
            });

            ast.statements.push(TypescriptGenerator.createFunction(requestName, []));
        });

        return ast;
    }
}
