import { platforms } from "~/lib/platforms";
import { site } from "~/lib/site";
export function GET() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "The Social Specification platform dataset",
    description: site.description,
    url: `${site.url}/api/platforms.json`,
    dateModified: "2026-08-21",
    license: "https://opensource.org/license/mit",
    creator: { "@type": "Person", name: site.author.name, url: site.author.url },
    variableMeasured: platforms.flatMap((p) =>
      p.constraints.map((c) => `${p.name}: ${c.label}`),
    ),
  };
  return new Response(JSON.stringify(graph, null, 2), {
    headers: { "Content-Type": "application/ld+json" },
  });
}
