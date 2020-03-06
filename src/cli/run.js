"use strict";
exports.__esModule = true;
var rpc_1 = require("./rpc");
var response = rpc_1.RPC.call("rust", "ws://127.0.0.1:7779", "serialise", { code: "let a: u32 = 6;" }, function (response) {
    console.log(response);
});
