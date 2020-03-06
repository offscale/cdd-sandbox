import { RPC } from "./rpc";

let response = RPC.call("rust", "ws://127.0.0.1:7779", "serialise", { code: "let a: u32 = 6;" }, response => {
    console.log(response);
});