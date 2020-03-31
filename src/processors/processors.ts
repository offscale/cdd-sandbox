import { OpenAPIProcessor } from "./openapi";
import { RustServerProcessor } from "./rust-server";
import { TypescriptClientProcessor } from "./typescript";

// tip: use https://jsonpath.com/ and https://duckduckgo.com/?q=json+format https://github.com/s3u/JSONPath
// json templating: https://www.npmjs.com/package/jsonpath-object-transform
// https://runkit.com/kantord/runkit-npm-jq-in-the-browser
// https://github.com/kantord/jq-in-the-browser

export module Processors {
    let servers = {
        "rust":         "ws://172.105.183.189/rust",
        "typescript":   "ws://172.105.183.189/typescript",
        "openapi":      "ws://172.105.183.189/openapi",
        "swift":        "ws://127.0.0.1:7781"
    };
    export let processors = {
        "swift-client": {
            server: servers.swift,
            syntax: "swift",
            extractSpec: TypescriptClientProcessor.extractSpec,
            merge: TypescriptClientProcessor.merge,
        },
        "typescript-client": {
            server: servers.typescript,
            syntax: "typescript",
            extractSpec: TypescriptClientProcessor.extractSpec,
            merge: TypescriptClientProcessor.merge,
        },
        "rust-server": {
            server: servers.rust,
            syntax: "rust",
            extractSpec: RustServerProcessor.extractSpec,
            merge: RustServerProcessor.merge,
        },
        "openapi": {
            server: servers.openapi,
            syntax: "yaml",
            extractSpec: OpenAPIProcessor.extractSpec,
            merge: OpenAPIProcessor.merge,
        },
    };
}
