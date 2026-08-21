# Contributing

Corrections and additions are welcome.

1. Cite a first-party source for each stated requirement.
2. Preserve whether the value applies to manual publishing, an API, or both.
3. Use `not-documented` instead of filling gaps from blogs or memory.
4. Use `dynamic` for values a server or account can configure.
5. Add a changelog entry for material changes.

Before opening a pull request, run:

```sh
npm run format:check
npm run check
npm run build
npm run mcp:typecheck
npm run mcp:dry-run
```
