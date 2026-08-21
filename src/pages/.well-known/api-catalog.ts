import { site } from "~/lib/site";
export function GET() {
  return new Response(
    JSON.stringify(
      {
        version: "1.0",
        title: site.name,
        description: site.description,
        apis: [
          {
            name: "Platform dataset",
            type: "open-data",
            url: `${site.url}/api/platforms.json`,
            documentation: `${site.url}/about/`,
          },
          {
            name: "MCP",
            type: "mcp",
            url: site.mcp.endpoint,
            documentation: `${site.url}/mcp/`,
          },
        ],
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json" } },
  );
}
