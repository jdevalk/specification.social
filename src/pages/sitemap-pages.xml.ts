import { site } from "~/lib/site";
const pages = ["", "platforms/", "compare/", "changelog/", "about/", "mcp/", "search/"];
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${site.url}/${page}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
