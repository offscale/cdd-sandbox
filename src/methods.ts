import { RPC } from "./rpc";

export module Methods {
  export async function serialise(server: string, code: string) {
    return await RPC.ccall(server, "serialise", { code: code });
  }

  export async function deserialise(server: string, ast: any) {
    return await RPC.ccall(server, "deserialise", { ast: ast });
  }
}
