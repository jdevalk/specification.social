export type ConstraintStatus = "documented" | "dynamic" | "not-documented";
export type ConstraintScope = "manual" | "api" | "all";

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
}

export interface Constraint {
  id: string;
  group: "profile" | "text" | "images" | "video" | "publishing";
  label: string;
  value: string;
  status?: ConstraintStatus;
  scope?: ConstraintScope;
  note?: string;
  sourceIds?: string[];
  machine?: Record<string, string | number | boolean | string[]>;
}

export interface Platform {
  slug: string;
  name: string;
  shortName: string;
  domain: string;
  color: string;
  description: string;
  verifiedAt: string;
  sources: Source[];
  constraints: Constraint[];
}

export interface SocialData {
  version: string;
  generatedFor: string;
  platforms: Platform[];
}
