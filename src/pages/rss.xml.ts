import rss from "@astrojs/rss";
import changes from "~/data/changelog.json";
import { site } from "~/lib/site";
export function GET() {
  return rss({
    title: `${site.name} changes`,
    description: "Changes to the social publishing specification.",
    site: site.url,
    items: changes.map((change) => ({
      title: change.title,
      pubDate: new Date(`${change.date}T12:00:00Z`),
      description: change.description,
      link: "/changelog/",
    })),
    customData: "<language>en</language>",
  });
}
