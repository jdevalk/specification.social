import dataset from "./data.json" with { type: "json" };
import { callTool, tools } from "./tools";
import type { Dataset, RpcRequest, RpcResponse } from "./types";

const data = dataset as Dataset;
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, MCP-Protocol-Version, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};
const headers = { "Content-Type": "application/json; charset=utf-8", ...cors };
const ok = (id: RpcRequest["id"], result: unknown): RpcResponse => ({
  jsonrpc: "2.0",
  id: id ?? null,
  result,
});
const fail = (id: RpcRequest["id"], code: number, message: string): RpcResponse => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message },
});
const isRpc = (value: unknown): value is RpcRequest =>
  typeof value === "object" &&
  value !== null &&
  (value as RpcRequest).jsonrpc === "2.0" &&
  typeof (value as RpcRequest).method === "string";

function handle(request: RpcRequest): RpcResponse | null {
  if (
    request.method === "notifications/initialized" ||
    request.method === "notifications/cancelled"
  )
    return null;
  if (request.method === "initialize")
    return ok(request.id, {
      protocolVersion: "2025-11-25",
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: "specification-social",
        title: "The Social Specification",
        version: "0.1.0",
        websiteUrl: "https://specification.social",
      },
      instructions:
        "Use get_platform for complete sourced requirements, compare_platforms for a normalized comparison, and validate_post for preflight checks. All tools are read-only.",
    });
  if (request.method === "ping") return ok(request.id, {});
  if (request.method === "tools/list") return ok(request.id, { tools });
  if (request.method === "tools/call") {
    const params = request.params ?? {};
    const args =
      typeof params.arguments === "object" && params.arguments !== null
        ? (params.arguments as Record<string, unknown>)
        : {};
    return ok(request.id, callTool(data, params.name, args));
  }
  return fail(request.id, -32601, `Method not found: ${request.method}`);
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET" && url.pathname === "/")
      return new Response(
        "The Social Specification MCP server\n\nPOST JSON-RPC to /mcp.\n",
        { headers: { "Content-Type": "text/plain; charset=utf-8", ...cors } },
      );
    if (request.method === "GET" && url.pathname === "/.well-known/mcp/server-card.json")
      return Response.json(
        {
          name: "specification-social",
          version: "0.1.0",
          transport: { type: "streamable-http", url: `${url.origin}/mcp` },
          capabilities: { tools: true },
        },
        { headers: cors },
      );
    if (request.method !== "POST" || url.pathname !== "/mcp")
      return new Response("Not found", { status: 404, headers: cors });
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify(fail(null, -32700, "Parse error")), {
        status: 400,
        headers,
      });
    }
    const requests = Array.isArray(payload) ? payload : [payload];
    if (!requests.every(isRpc))
      return new Response(JSON.stringify(fail(null, -32600, "Invalid Request")), {
        status: 400,
        headers,
      });
    const responses = requests
      .map(handle)
      .filter((item): item is RpcResponse => item !== null);
    if (!responses.length) return new Response(null, { status: 202, headers: cors });
    return new Response(JSON.stringify(Array.isArray(payload) ? responses : responses[0]), {
      headers: { ...headers, "MCP-Protocol-Version": "2025-11-25" },
    });
  },
} satisfies ExportedHandler;
