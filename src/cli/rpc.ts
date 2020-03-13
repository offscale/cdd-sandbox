var JsonRpcWs = require("json-rpc-ws/browser");

export module RPC {
  export function call(
    servername: string,
    host: string,
    method: string,
    params: any,
    callback: (response: any) => void
  ) {
    console.info(`rpc_call: ${servername} -> ${method}`, params);

    var client = JsonRpcWs.createClient();

    try {
      client.connect(host, () => {
        try {
          client.send(
            method,
            params,
            async (error: any, response: { [x: string]: any }) => {
              if (error != null) {
                console.error(`rpc-error-response: ${servername}/${method}: `, error.message);
              } else {
                console.log(
                  `rpc-response: ${servername} -> ${method}`,
                  response
                );
                callback(response);
              }
            }
          );
        } catch (Error) {
        //   ErrorBar.pushError(
        //     `RPC Client Error: ${servername}: ${Error.message}`
        //   );
          // console.error(Error);
        }
      });
    } catch (Error) {
    //   ErrorBar.pushError(
    //     `RPC Connection Error: ${servername}: ${Error.message}`
    //   );
    }
  }
}
