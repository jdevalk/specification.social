import { copyFile, mkdir } from "node:fs/promises";
await mkdir(new URL("../src/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../../src/data/platforms.json", import.meta.url),
  new URL("../src/data.json", import.meta.url),
);
