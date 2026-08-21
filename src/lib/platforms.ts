import rawData from "~/data/platforms.json";
import type { Constraint, Platform, SocialData } from "~/lib/types";

export const data = rawData as SocialData;
export const platforms = data.platforms;

export const platformBySlug = (slug: string) =>
  platforms.find((platform) => platform.slug === slug);

export const constraintsFor = (platform: Platform, group: Constraint["group"]) =>
  platform.constraints.filter((constraint) => constraint.group === group);

export const sourceFor = (platform: Platform, id: string) =>
  platform.sources.find((source) => source.id === id);

export const groups: { slug: Constraint["group"]; title: string; summary: string }[] = [
  {
    slug: "profile",
    title: "Profile",
    summary: "Profile images, banners, biographies, names, and account presentation.",
  },
  {
    slug: "text",
    title: "Text",
    summary: "Post, caption, title, description, and alternative-text limits.",
  },
  {
    slug: "images",
    title: "Images",
    summary: "Dimensions, aspect ratios, file sizes, formats, animation, and processing.",
  },
  {
    slug: "video",
    title: "Video",
    summary: "Duration, dimensions, file sizes, containers, codecs, and captions.",
  },
  {
    slug: "publishing",
    title: "Publishing",
    summary: "Attachment counts, API differences, scheduling, editing, and delivery notes.",
  },
];

export const compareKeys = [
  { id: "profile.image.dimensions", label: "Profile image" },
  { id: "profile.header.dimensions", label: "Header / banner" },
  { id: "profile.bio.max", label: "Profile biography" },
  { id: "post.text.max", label: "Post text" },
  { id: "post.image.count", label: "Images per post" },
  { id: "post.image.dimensions", label: "Post image dimensions" },
  { id: "post.image.formats", label: "Image formats" },
  { id: "post.image.max-size", label: "Image file size" },
  { id: "post.image.alt", label: "Image alternative text" },
];
