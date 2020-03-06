import { Methods } from "./methods";

export module Processors {
    export let services = {
        "rust": "ws://localhost:7779",
        "openapi": "ws://localhost:7779"
    };
    export let processors = {
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            getProject(code: string) { return Methods.serialise(this.server, code) },
            getAST() { console.log("ast got:", this.ast); return {}; }
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            getProject() { console.log("getProject called"); },
            getAST() { console.log("ast got:", this.ast);}
        },
    };
}
