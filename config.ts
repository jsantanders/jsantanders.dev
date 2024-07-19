import type { LocalePrefix } from "next-intl/routing";

export const localePrefix = "as-needed" satisfies LocalePrefix;
export const locales = ["en", "es"] as const;
export type Locales = (typeof locales)[number];
