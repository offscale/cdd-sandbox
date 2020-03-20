import { OpenAPIProcessor } from "./openapi";
import { RustServerProcessor } from "./rust-server";

// tip: use https://jsonpath.com/ and https://duckduckgo.com/?q=json+format https://github.com/s3u/JSONPath
// json templating: https://www.npmjs.com/package/jsonpath-object-transform
// https://runkit.com/kantord/runkit-npm-jq-in-the-browser
// https://github.com/kantord/jq-in-the-browser

export module Processors {
    export let services = {
        "rust": "ws://172.105.183.189/rust",
        "typescript": "ws://172.105.183.189/rust",
        "openapi": "ws://172.105.183.189/openapi"
    };
    export let processors = {
        "typescript-client": {
            server: services.typescript,
            syntax: "typescript"
        },
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            extractSpec: RustServerProcessor.extractSpec,
            merge: RustServerProcessor.merge,
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            extractSpec: OpenAPIProcessor.extractSpec,
            merge: OpenAPIProcessor.merge
        },
    };
}
