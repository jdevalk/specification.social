import { platforms } from "~/lib/platforms";
import { site } from "~/lib/site";
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${platforms.map((platform) => `<url><loc>${site.url}/platforms/${platform.slug}/</loc><lastmod>${platform.verifiedAt}</lastmod></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
