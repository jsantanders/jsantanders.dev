import type { LocalePrefix } from "next-intl/routing";

export const localePrefix = "as-needed" satisfies LocalePrefix;
export const locales = ["en", "es"] as const;
export type Locales = (typeof locales)[number];

function createFullyQualifiedDomainName() {
  if (process.env.NEXT_PUBLIC_FQDN) {
    return process.env.NEXT_PUBLIC_FQDN;
  }
  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL;
  }
  return "jsantanders.dev";
}

const scheme = process.env.NEXT_PUBLIC_SCHEME
  ? process.env.NEXT_PUBLIC_SCHEME
  : "https";
const fqdn = createFullyQualifiedDomainName();
export const baseUrl = `${scheme}://${fqdn}`;

export const createCompleteUrl = (path: string) => {
  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${path}`;
};
