export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
}
export interface Constraint {
  id: string;
  group: string;
  label: string;
  value: string;
  status?: string;
  scope?: string;
  note?: string;
  sourceIds?: string[];
  machine?: Record<string, unknown>;
}
export interface Platform {
  slug: string;
  name: string;
  domain: string;
  verifiedAt: string;
  description: string;
  sources: Source[];
  constraints: Constraint[];
}
export interface Dataset {
  version: string;
  platforms: Platform[];
}
export interface RpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}
export type RpcResponse = {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
};
