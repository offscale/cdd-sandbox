import { match } from "assert";
import { Util } from "../utils";

const { JSONPath } = require('jsonpath-plus');

function select(json: any, path: string) {
    return JSONPath({path: path, json: json, wrap: false});
}

export module TypescriptVisitor {
    export function eachClass(ast: any, fn: (className, members) => void) {
        let classes = select(ast, '$..statements[?(@.kind==244)]');
        console.log('classes: ', classes);

        if (!Util.isIterable(classes)) { return; }

        for (const klass of classes) {
            let members = [];
            TypescriptVisitor.eachClassMember(klass, (varName, varType, isOptional) => {
                members.push({
                    name: varName,
                    type: varType,
                    optional: isOptional,
                });
            });
            fn(klass.name.escapedText, members);
        }
    }

    export function eachClassMember(ast: any, fn: (varName, varType, isOptional) => void) {
        console.log("members", ast);
        for (const member of ast.members) {
            fn(member.name.escapedText, fromType(member.type.kind), true);
        }
    }

    export function eachFunction(ast: any, fn: (fnName) => void) {
        let fns = select(ast, '$..statements[?(@.kind==243)]..escapedText');
        if (!Util.isIterable(fns)) { return; }
        for (const fnName of fns) {
            fn(fnName);
        }
    }
}

export module TypescriptGenerator {
    // export function createClass(name: string, fields: {}[]): {} {
    //     console.log("TypescriptGenerator.createClass()");
    //     return variableAssignment("a", "string", "5");
    // }
    // export function createClassMemberVariable

    export function importStatement() {
        return {
            "kind": 253,
            "importClause": {
                "kind": 254,
                "namedBindings": [{
                    "kind": 256,
                    "elements": [{
                        "kind": 257,
                        "name": {
                            "kind": 75,
                            "escapedText": "ApiBase"
                        }
                    }]
                }]
            },
            "moduleSpecifier": {
                "kind": 10,
                "text": "./apibase.ts"
            }
        }
    }

    export function variableAssignment(varName: string, varType: string, varValue: string) {
        return {
            "kind": 224,
            "declarationList": {
                "kind": 242,
                "declarations": [
                    {
                        "kind": 241,
                        "name": {
                            "kind": 75,
                            "escapedText": varName
                        },
                        "initializer": {
                            "kind": quotedStringKind,
                            "text": varValue
                        }
                    }
                ]
            }
        };
    }

    export function createClass(name: string, members: {}[]): {} {
        return {
            "kind": classDefKind,
            "name": {
                "kind": 75,
				"escapedText": name
            },
            "members": members
        }
    }

    export function createClassMemberVariable(name: string, type: string, optional: boolean): {} {
        if (optional == true) {
            return {
                "kind": 158,
                "name": {
                    "kind": 75,
                    "escapedText": name
                },
                "type": {
                    "kind": toType(type)
                }
            }
        };

        return {
            "kind": 158,
            "name": {
                "kind": 75,
                "escapedText": name
            },
            "type": {
                "kind": toType(type)
            },
            "modifiers": [{
                "kind": 137
            }]
        };
    }

    export function createFunction(name: string, args: []): {} {
        return {
            "kind": 243,
            "name": escapedText(name),
            "parameters": args,
			"body": {
                "kind": 222,
                "multiLine": true,
                "statements": [{
                    "kind": 225,
                    "expression": {
                        "kind": 193,
                        "expression": escapedText("ApiBase"),
                        "name": escapedText("call")
                    },
                    "arguments": [
                        {
                            "kind": 10,
                            "text": "GET",
                        },
                        {
                            "kind": 10,
                            "text": "/"
                        }
                    ]
                }]
            }
        };
    }

    export function createFunctionParam(name: string, type: string): {} {
        return {};
    }

    export function toOpenAPI(ty: number): string {
        return fromType(ty);
    }
}

// types
const literalKind = 8;
const quotedStringKind = 10;
const classDefKind = 244;

function toType(ty: string): number {
    switch (ty) {

        case "string":
            return 142;

        case "integer":
            return 139;
    
        default:
            return 0;
    }
}

function fromType(ty: number): string {
    switch (ty) {

        case 142:
            return "string";

        case 139:
            return "integer";
    
        default:
            "error";
    }
}

function escapedText(text: string) {
    return {
        "kind": 75,
        "escapedText": text
    };
}


// {
//     "pos": 0,
//     "end": 32,
//     "flags": 0,
//     "modifierFlagsCache": 536870912,
//     "transformFlags": 0,
//     "kind": 244,
//     "name": {
//         "pos": 5,
//         "end": 9,
//         "flags": 0,
//         "modifierFlagsCache": 0,
//         "transformFlags": 0,
//         "kind": 75,
//         "escapedText": "Pet"
//     },
//     "members": [
//         {
//             "pos": 11,
//             "end": 30,
//             "flags": 0,
//             "modifierFlagsCache": 536870912,
//             "transformFlags": 0,
//             "kind": 158,
//             "name": {
//                 "pos": 11,
//                 "end": 21,
//                 "flags": 0,
//                 "modifierFlagsCache": 0,
//                 "transformFlags": 0,
//                 "kind": 75,
//                 "escapedText": "selected"
//             },
//             "type": {
//                 "pos": 22,
//                 "end": 29,
//                 "flags": 0,
//                 "modifierFlagsCache": 0,
//                 "transformFlags": 0,
//                 "kind": 142
//             }
//         }