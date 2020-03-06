import { Methods } from "./methods";
import { Models } from "./models";

export module Processors {
    export let services = {
        "rust": "ws://localhost:7779",
        "openapi": "ws://localhost:7779"
    };
    export let processors = {
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            getProject(code: string): Models.Project {
                let ast = Methods.serialise(this.server, code);
                return {
                    models: [
                        { name: "Pet", vars: [] }
                    ],
                    requests: [],
                };
            }
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            getProject(code: string) { return Methods.serialise(this.server, code) }
        },
    };
}
