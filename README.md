# The Social Specification

[The Social Specification](https://specification.social) is an open, sourced reference for social media image sizes, accepted formats, text limits, profile artwork, accessibility fields, and publishing constraints.

## One dataset, many outputs

`src/data/platforms.json` generates:

- browsable HTML pages and a cross-platform comparison;
- per-platform JSON and Markdown;
- a complete public JSON dataset;
- sitemaps, schema.org dataset metadata, RSS, and `llms-full.txt`;
- a Pagefind search index;
- data for the read-only MCP Worker.

## Development

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev              # site: http://localhost:31339
npm run build
npm run check
npm run mcp:typecheck
npm run mcp:dry-run
```

The Astro build is static and can be deployed to Cloudflare Pages with build command `npm run build` and output directory `dist`. The MCP Worker deploys separately from `mcp/` to `mcp.specification.social`.

## Data policy

Each stated constraint needs a first-party help page, developer document, or protocol schema. Unknown values remain `not-documented`; server-configured values use `dynamic`. Use `scope` to separate manual and API rules.

## License

Code and data are available under the MIT license.
