// @ts-check
import { defineConfig } from "astro/config";
import seoGraph from "@jdevalk/astro-seo-graph/integration";

const SITE = "https://specification.social";

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  integrations: [
    seoGraph({
      validateH1: true,
      validateUniqueMetadata: true,
      validateImageAlt: true,
      validateMetadataLength: true,
      validateInternalLinks: true,
      llmsTxt: {
        title: "The Social Specification",
        siteUrl: SITE,
        summary:
          "A sourced, continuously verified reference for publishing content across social platforms.",
        autoSectionName: "Platform specifications",
        filter: (url) => !new URL(url).pathname.startsWith("/404"),
      },
    }),
  ],
  server: { port: 31339, host: true },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light-default", dark: "github-dark-default" },
      defaultColor: false,
      wrap: true,
    },
  },
  build: { inlineStylesheets: "auto" },
});
