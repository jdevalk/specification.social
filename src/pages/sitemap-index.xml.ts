import { site } from "~/lib/site";
export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site.url}/sitemap-pages.xml</loc></sitemap><sitemap><loc>${site.url}/sitemap-platforms.xml</loc></sitemap></sitemapindex>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
