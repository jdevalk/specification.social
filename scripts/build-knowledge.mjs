import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const data = JSON.parse(await readFile("src/data/platforms.json", "utf8"));
const lines = [
  "# The Social Specification",
  "",
  "Sourced social media image sizes, formats, text limits, and publishing requirements.",
  "",
  `Dataset version: ${data.version}`,
  "",
];
for (const platform of data.platforms) {
  lines.push(`## ${platform.name}`, "", platform.description, "");
  for (const constraint of platform.constraints)
    lines.push(
      `- ${constraint.label}: ${constraint.value}${constraint.scope && constraint.scope !== "all" ? ` (${constraint.scope})` : ""}`,
    );
  lines.push(
    "",
    "Sources:",
    ...platform.sources.map((source) => `- ${source.title}: ${source.url}`),
    "",
  );
}
await writeFile(path.join("dist", "llms-full.txt"), lines.join("\n"));
await writeFile(path.join("dist", "platforms.json"), JSON.stringify(data, null, 2));
