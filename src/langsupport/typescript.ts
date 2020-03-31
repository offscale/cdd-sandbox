
export module TypescriptGenerator {
    // export function createClass(name: string, fields: {}[]): {} {
    //     console.log("TypescriptGenerator.createClass()");
    //     return variableAssignment("a", "string", "5");
    // }
    // export function createClassMemberVariable

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

    export function createClass(name: string, fields: {}[]): {} {
        return {
            "kind": classDefKind,
            "name": {
                "kind": 75,
				"escapedText": name
            }
        }
    }

    export function createClassMemberVariable(name: string, type: string): {} {
        return {};
    }

    export function createFunction(name: string, args: []): {} {
        return {
            "kind": 243,
            "name": {
                "kind": 75,
                "escapedText": name
            },
            "parameters": args,
			"body": {
                "kind": 222,
                "statements": []
            }
        };
    }

    export function createFunctionParam(name: string, type: string): {} {
        return {};
    }

    export function typeFromOpenAPI(type: string): string {
        return "string";
    }
}

// types
const literalKind = 8;
const quotedStringKind = 10;
const classDefKind = 244;


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