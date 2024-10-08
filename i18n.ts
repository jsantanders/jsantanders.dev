import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Locales, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as Locales)) notFound();

	return {
		messages: (await import(`./messages/${locale}.json`)).default,
	};
});
