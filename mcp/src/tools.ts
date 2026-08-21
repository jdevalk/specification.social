import type { Dataset, Platform } from "./types";

const text = (value: unknown, isError = false) => ({
  content: [
    {
      type: "text",
      text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
    },
  ],
  isError,
});
const findPlatform = (data: Dataset, slug: unknown) =>
  data.platforms.find(
    (platform) =>
      platform.slug === String(slug).toLowerCase() ||
      platform.name.toLowerCase() === String(slug).toLowerCase(),
  );
const constraint = (platform: Platform, id: string) =>
  platform.constraints.find((item) => item.id === id);

export const tools = [
  {
    name: "list_platforms",
    title: "List social platforms",
    description: "List every platform and its verification date.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_platform",
    title: "Get a platform specification",
    description: "Get every sourced constraint and source for one platform.",
    inputSchema: {
      type: "object",
      properties: { platform: { type: "string", description: "Platform slug or name" } },
      required: ["platform"],
    },
  },
  {
    name: "compare_platforms",
    title: "Compare platform constraints",
    description: "Compare one normalized constraint across platforms.",
    inputSchema: {
      type: "object",
      properties: {
        constraint: {
          type: "string",
          description: "For example post.image.formats or post.text.max",
        },
        platforms: {
          type: "array",
          items: { type: "string" },
          description: "Optional platform slugs",
        },
      },
      required: ["constraint"],
    },
  },
  {
    name: "get_image_formats",
    title: "Get supported image formats",
    description: "Return documented profile and post image formats for a platform.",
    inputSchema: {
      type: "object",
      properties: { platform: { type: "string" } },
      required: ["platform"],
    },
  },
  {
    name: "validate_post",
    title: "Validate a social post",
    description:
      "Preflight text length, image count, MIME type, and image byte size against machine-readable limits.",
    inputSchema: {
      type: "object",
      properties: {
        platform: { type: "string" },
        textLength: { type: "number" },
        imageCount: { type: "number" },
        imageMimeType: { type: "string" },
        imageBytes: { type: "number" },
      },
      required: ["platform"],
    },
  },
  {
    name: "search",
    title: "Search constraints",
    description: "Search platform names, labels, values, and notes.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 50 },
      },
      required: ["query"],
    },
  },
];

export function callTool(data: Dataset, name: unknown, args: Record<string, unknown>) {
  if (name === "list_platforms")
    return text(
      data.platforms.map(({ slug, name, verifiedAt, description }) => ({
        slug,
        name,
        verifiedAt,
        description,
      })),
    );
  if (name === "get_platform") {
    const p = findPlatform(data, args.platform);
    return p ? text(p) : text(`Unknown platform: ${args.platform}`, true);
  }
  if (name === "get_image_formats") {
    const p = findPlatform(data, args.platform);
    if (!p) return text(`Unknown platform: ${args.platform}`, true);
    return text({
      platform: p.name,
      formats: p.constraints.filter(
        (item) => item.id.includes("formats") && item.id.includes("image"),
      ),
    });
  }
  if (name === "compare_platforms") {
    const id = String(args.constraint ?? "");
    const requested = Array.isArray(args.platforms) ? args.platforms.map(String) : [];
    const rows = data.platforms
      .filter((p) => !requested.length || requested.includes(p.slug))
      .map((p) => ({
        platform: p.name,
        constraint: constraint(p, id) ?? {
          id,
          value: "Not documented",
          status: "not-documented",
        },
      }));
    return text(rows);
  }
  if (name === "search") {
    const query = String(args.query ?? "").toLowerCase();
    const limit = Math.min(50, Math.max(1, Number(args.limit) || 10));
    const matches = data.platforms
      .flatMap((p) => p.constraints.map((c) => ({ platform: p.name, slug: p.slug, ...c })))
      .filter((item) => JSON.stringify(item).toLowerCase().includes(query))
      .slice(0, limit);
    return text(matches);
  }
  if (name === "validate_post") {
    const p = findPlatform(data, args.platform);
    if (!p) return text(`Unknown platform: ${args.platform}`, true);
    const checks: {
      field: string;
      status: "pass" | "fail" | "unknown";
      message: string;
    }[] = [];
    const textRule = constraint(p, "post.text.max")?.machine as
      { max?: number } | undefined;
    checks.push(
      typeof args.textLength !== "number" || !textRule?.max
        ? {
            field: "textLength",
            status: "unknown",
            message: "No comparable documented value or no input supplied.",
          }
        : args.textLength <= textRule.max
          ? {
              field: "textLength",
              status: "pass",
              message: `${args.textLength} ≤ ${textRule.max}`,
            }
          : {
              field: "textLength",
              status: "fail",
              message: `${args.textLength} exceeds ${textRule.max}`,
            },
    );
    const countRule = constraint(p, "post.image.count")?.machine as
      { max?: number } | undefined;
    checks.push(
      typeof args.imageCount !== "number" || !countRule?.max
        ? {
            field: "imageCount",
            status: "unknown",
            message: "No comparable documented value or no input supplied.",
          }
        : args.imageCount <= countRule.max
          ? {
              field: "imageCount",
              status: "pass",
              message: `${args.imageCount} ≤ ${countRule.max}`,
            }
          : {
              field: "imageCount",
              status: "fail",
              message: `${args.imageCount} exceeds ${countRule.max}`,
            },
    );
    const formats = (
      constraint(p, "post.image.formats")?.machine as { formats?: string[] } | undefined
    )?.formats;
    checks.push(
      typeof args.imageMimeType !== "string" || !formats || formats.includes("image/*")
        ? {
            field: "imageMimeType",
            status: "unknown",
            message: "No closed format list or no input supplied.",
          }
        : formats.includes(args.imageMimeType)
          ? {
              field: "imageMimeType",
              status: "pass",
              message: `${args.imageMimeType} is documented.`,
            }
          : {
              field: "imageMimeType",
              status: "fail",
              message: `${args.imageMimeType} is not in the documented list.`,
            },
    );
    const bytes = constraint(p, "post.image.max-size")?.machine as
      { maxBytes?: number } | undefined;
    checks.push(
      typeof args.imageBytes !== "number" || !bytes?.maxBytes
        ? {
            field: "imageBytes",
            status: "unknown",
            message: "No comparable documented value or no input supplied.",
          }
        : args.imageBytes <= bytes.maxBytes
          ? {
              field: "imageBytes",
              status: "pass",
              message: `${args.imageBytes} ≤ ${bytes.maxBytes}`,
            }
          : {
              field: "imageBytes",
              status: "fail",
              message: `${args.imageBytes} exceeds ${bytes.maxBytes}`,
            },
    );
    return text({
      platform: p.name,
      verifiedAt: p.verifiedAt,
      valid: !checks.some((check) => check.status === "fail"),
      checks,
    });
  }
  return text(`Unknown tool: ${String(name)}`, true);
}
