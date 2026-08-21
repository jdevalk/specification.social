import { groups, platforms } from "~/lib/platforms";
export function getStaticPaths() {
  return platforms.map((platform) => ({
    params: { slug: platform.slug },
    props: { platform },
  }));
}
export function GET({ props }: { props: { platform: (typeof platforms)[number] } }) {
  const p = props.platform;
  const lines = [
    `# ${p.name} social publishing specification`,
    "",
    p.description,
    "",
    `Verified: ${p.verifiedAt}`,
    "",
  ];
  for (const group of groups) {
    const items = p.constraints.filter((item) => item.group === group.slug);
    if (!items.length) continue;
    lines.push(`## ${group.title}`, "");
    for (const item of items) {
      lines.push(`### ${item.label}`, "", item.value, "");
      if (item.note) lines.push(item.note, "");
      if (item.sourceIds?.length)
        lines.push(
          `Sources: ${item.sourceIds
            .map((id) => p.sources.find((source) => source.id === id)?.url)
            .filter(Boolean)
            .join(", ")}`,
          "",
        );
    }
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
