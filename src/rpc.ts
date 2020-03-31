var JsonRpcWs = require("json-rpc-ws/browser");
import { RpcWebSocketClient } from 'rpc-websocket-client';
import { ErrorBar } from "./error";

export module RPC {
  export async function ccall(
    host: string,
    method: string,
    params: any
  ) {
    console.info(`RPC.call: ${host} -> ${method}`, params);

    const rpc = new RpcWebSocketClient();
    await rpc.connect(host);

    const response = await rpc.call(method, params).then((resp) => {
      // response ok
      console.log(
        `rpc.response: ${host} -> ${method}`,
        resp
      );
      return resp;
    }).catch((err) => {
      ErrorBar.pushError(`RPC.error-response: ${method}: ${err.message}`);
      console.error(`RPC.error-response: ${host}/${method}: `, err);
      return false;
    });

     // If catch wrapper returned false, let's not continue.
      if (response === false) {
        return;
      }

    rpc.ws.close();

    return response;
  }
}
